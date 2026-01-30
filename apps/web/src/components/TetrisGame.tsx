import React, { useRef, useEffect, useState, useCallback } from 'react';

// Tetromino shapes and colors
const TETROMINOES = {
    I: { shape: [[1, 1, 1, 1]], color: '#00f5ff' },
    O: { shape: [[1, 1], [1, 1]], color: '#ffeb3b' },
    T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#9c27b0' },
    S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#4caf50' },
    Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#f44336' },
    J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#2196f3' },
    L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#ff9800' },
};

type TetrominoType = keyof typeof TETROMINOES;

// Reward amounts
const REWARDS = {
    1: 50,    // Single line
    2: 150,   // Double lines (1.5x)
    3: 300,   // Triple lines (2x)
    4: 600,   // Tetris (3x)
};
const COMBO_BONUS = 0.10;

// Board dimensions
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 28;

interface GameState {
    board: (string | null)[][];
    currentPiece: {
        type: TetrominoType;
        shape: number[][];
        x: number;
        y: number;
        color: string;
    } | null;
    nextPiece: TetrominoType | null;
    score: number;
    linesCleared: number;
    cashEarned: number;
    level: number;
    comboCount: number;
    maxCombo: number;
    isGameOver: boolean;
    isPaused: boolean;
}

interface TetrisGameProps {
    onGameOver?: (stats: { score: number; linesCleared: number; cashEarned: number; comboCount: number; maxCombo: number; duration: number }) => void;
    onScoreUpdate?: (stats: { score: number; linesCleared: number; cashEarned: number }) => void;
}

export const TetrisGame: React.FC<TetrisGameProps> = ({ onGameOver, onScoreUpdate }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nextPieceCanvasRef = useRef<HTMLCanvasElement>(null);
    const gameLoopRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const lastDropTimeRef = useRef<number>(Date.now());
    const comboTimerRef = useRef<number | null>(null);

    const [gameState, setGameState] = useState<GameState>({
        board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)),
        currentPiece: null,
        nextPiece: null,
        score: 0,
        linesCleared: 0,
        cashEarned: 0,
        level: 1,
        comboCount: 0,
        maxCombo: 0,
        isGameOver: false,
        isPaused: false,
    });

    const [rewardPopup, setRewardPopup] = useState<{ amount: number; lines: number; combo: number } | null>(null);

    // Get random tetromino
    const getRandomPiece = useCallback((): TetrominoType => {
        const pieces = Object.keys(TETROMINOES) as TetrominoType[];
        return pieces[Math.floor(Math.random() * pieces.length)];
    }, []);

    // Create new piece
    const createPiece = useCallback((type: TetrominoType) => {
        const tetromino = TETROMINOES[type];
        return {
            type,
            shape: tetromino.shape.map(row => [...row]),
            x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
            y: 0,
            color: tetromino.color,
        };
    }, []);

    // Check collision
    const checkCollision = useCallback((piece: typeof gameState.currentPiece, board: (string | null)[][], offsetX = 0, offsetY = 0): boolean => {
        if (!piece) return true;

        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const newX = piece.x + x + offsetX;
                    const newY = piece.y + y + offsetY;

                    if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                        return true;
                    }
                    if (newY >= 0 && board[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }, []);

    // Rotate piece
    const rotatePiece = useCallback((piece: typeof gameState.currentPiece): typeof gameState.currentPiece => {
        if (!piece) return null;

        const rotated = piece.shape[0].map((_, index) =>
            piece.shape.map(row => row[index]).reverse()
        );

        return { ...piece, shape: rotated };
    }, []);

    // Lock piece to board
    const lockPiece = useCallback((piece: typeof gameState.currentPiece, board: (string | null)[][]): (string | null)[][] => {
        if (!piece) return board;

        const newBoard = board.map(row => [...row]);

        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x] && piece.y + y >= 0) {
                    newBoard[piece.y + y][piece.x + x] = piece.color;
                }
            }
        }

        return newBoard;
    }, []);

    // Clear completed lines
    const clearLines = useCallback((board: (string | null)[][]): { newBoard: (string | null)[][]; linesCleared: number } => {
        const newBoard = board.filter(row => row.some(cell => !cell));
        const linesCleared = BOARD_HEIGHT - newBoard.length;

        while (newBoard.length < BOARD_HEIGHT) {
            newBoard.unshift(Array(BOARD_WIDTH).fill(null));
        }

        return { newBoard, linesCleared };
    }, []);

    // Calculate reward
    const calculateReward = useCallback((lines: number, combo: number): number => {
        const baseReward = REWARDS[lines as keyof typeof REWARDS] || 0;
        const comboMultiplier = 1 + (combo * COMBO_BONUS);
        return Math.floor(baseReward * comboMultiplier);
    }, []);

    // Calculate score points
    const calculateScore = useCallback((lines: number, level: number): number => {
        const basePoints = { 1: 100, 2: 300, 3: 500, 4: 800 };
        return (basePoints[lines as keyof typeof basePoints] || 0) * level;
    }, []);

    // Spawn new piece
    const spawnNewPiece = useCallback(() => {
        setGameState(prev => {
            const nextType = prev.nextPiece || getRandomPiece();
            const newPiece = createPiece(nextType);

            // Check if game over
            if (checkCollision(newPiece, prev.board)) {
                const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
                onGameOver?.({
                    score: prev.score,
                    linesCleared: prev.linesCleared,
                    cashEarned: prev.cashEarned,
                    comboCount: prev.comboCount,
                    maxCombo: prev.maxCombo,
                    duration,
                });
                return { ...prev, isGameOver: true, currentPiece: null };
            }

            return {
                ...prev,
                currentPiece: newPiece,
                nextPiece: getRandomPiece(),
            };
        });
    }, [checkCollision, createPiece, getRandomPiece, onGameOver]);

    // Move piece down
    const moveDown = useCallback(() => {
        setGameState(prev => {
            if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;

            if (!checkCollision(prev.currentPiece, prev.board, 0, 1)) {
                return {
                    ...prev,
                    currentPiece: { ...prev.currentPiece, y: prev.currentPiece.y + 1 }
                };
            }

            // Lock piece and clear lines
            const lockedBoard = lockPiece(prev.currentPiece, prev.board);
            const { newBoard, linesCleared } = clearLines(lockedBoard);

            let newCombo = prev.comboCount;
            let newMaxCombo = prev.maxCombo;
            let earnedCash = 0;

            if (linesCleared > 0) {
                newCombo = prev.comboCount + 1;
                newMaxCombo = Math.max(prev.maxCombo, newCombo);
                earnedCash = calculateReward(linesCleared, prev.comboCount);

                // Show reward popup
                setRewardPopup({ amount: earnedCash, lines: linesCleared, combo: prev.comboCount });
                setTimeout(() => setRewardPopup(null), 1500);

                // Reset combo after delay
                if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
                comboTimerRef.current = window.setTimeout(() => {
                    setGameState(p => ({ ...p, comboCount: 0 }));
                }, 2000);
            } else {
                // No lines cleared, reset combo
                newCombo = 0;
            }

            const scoreGain = calculateScore(linesCleared, prev.level);
            const newTotalLines = prev.linesCleared + linesCleared;
            const newLevel = Math.floor(newTotalLines / 10) + 1;

            const newState = {
                ...prev,
                board: newBoard,
                currentPiece: null,
                score: prev.score + scoreGain,
                linesCleared: newTotalLines,
                cashEarned: prev.cashEarned + earnedCash,
                level: newLevel,
                comboCount: newCombo,
                maxCombo: newMaxCombo,
            };

            onScoreUpdate?.({
                score: newState.score,
                linesCleared: newState.linesCleared,
                cashEarned: newState.cashEarned,
            });

            return newState;
        });
    }, [checkCollision, lockPiece, clearLines, calculateReward, calculateScore, onScoreUpdate]);

    // Handle key press
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (gameState.isGameOver) return;

        if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
            setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
            return;
        }

        if (gameState.isPaused) return;

        setGameState(prev => {
            if (!prev.currentPiece) return prev;

            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (!checkCollision(prev.currentPiece, prev.board, -1, 0)) {
                        return { ...prev, currentPiece: { ...prev.currentPiece, x: prev.currentPiece.x - 1 } };
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (!checkCollision(prev.currentPiece, prev.board, 1, 0)) {
                        return { ...prev, currentPiece: { ...prev.currentPiece, x: prev.currentPiece.x + 1 } };
                    }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (!checkCollision(prev.currentPiece, prev.board, 0, 1)) {
                        return { ...prev, currentPiece: { ...prev.currentPiece, y: prev.currentPiece.y + 1 } };
                    }
                    break;
                case 'ArrowUp':
                case 'w':
                case 'W':
                    const rotated = rotatePiece(prev.currentPiece);
                    if (rotated && !checkCollision(rotated, prev.board)) {
                        return { ...prev, currentPiece: rotated };
                    }
                    break;
                case ' ':
                    // Hard drop
                    let dropY = 0;
                    while (!checkCollision(prev.currentPiece, prev.board, 0, dropY + 1)) {
                        dropY++;
                    }
                    return { ...prev, currentPiece: { ...prev.currentPiece, y: prev.currentPiece.y + dropY } };
            }
            return prev;
        });
    }, [gameState.isGameOver, gameState.isPaused, checkCollision, rotatePiece]);

    // Draw board
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        // Clear canvas
        ctx.fillStyle = '#0a1a19';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = '#1a2f2e';
        ctx.lineWidth = 1;
        for (let x = 0; x <= BOARD_WIDTH; x++) {
            ctx.beginPath();
            ctx.moveTo(x * CELL_SIZE, 0);
            ctx.lineTo(x * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);
            ctx.stroke();
        }
        for (let y = 0; y <= BOARD_HEIGHT; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * CELL_SIZE);
            ctx.lineTo(BOARD_WIDTH * CELL_SIZE, y * CELL_SIZE);
            ctx.stroke();
        }

        // Draw locked pieces
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                if (gameState.board[y][x]) {
                    drawCell(ctx, x, y, gameState.board[y][x]!);
                }
            }
        }

        // Draw current piece
        if (gameState.currentPiece) {
            for (let y = 0; y < gameState.currentPiece.shape.length; y++) {
                for (let x = 0; x < gameState.currentPiece.shape[y].length; x++) {
                    if (gameState.currentPiece.shape[y][x]) {
                        drawCell(
                            ctx,
                            gameState.currentPiece.x + x,
                            gameState.currentPiece.y + y,
                            gameState.currentPiece.color
                        );
                    }
                }
            }

            // Draw ghost piece
            let ghostY = 0;
            while (!checkCollision(gameState.currentPiece, gameState.board, 0, ghostY + 1)) {
                ghostY++;
            }
            if (ghostY > 0) {
                ctx.globalAlpha = 0.3;
                for (let y = 0; y < gameState.currentPiece.shape.length; y++) {
                    for (let x = 0; x < gameState.currentPiece.shape[y].length; x++) {
                        if (gameState.currentPiece.shape[y][x]) {
                            drawCell(
                                ctx,
                                gameState.currentPiece.x + x,
                                gameState.currentPiece.y + y + ghostY,
                                gameState.currentPiece.color
                            );
                        }
                    }
                }
                ctx.globalAlpha = 1;
            }
        }

        // Draw next piece preview
        const nextCanvas = nextPieceCanvasRef.current;
        const nextCtx = nextCanvas?.getContext('2d');
        if (nextCtx && nextCanvas && gameState.nextPiece) {
            nextCtx.fillStyle = '#0a1a19';
            nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

            const nextTetromino = TETROMINOES[gameState.nextPiece];
            const offsetX = (nextCanvas.width / CELL_SIZE - nextTetromino.shape[0].length) / 2;
            const offsetY = (nextCanvas.height / CELL_SIZE - nextTetromino.shape.length) / 2;

            for (let y = 0; y < nextTetromino.shape.length; y++) {
                for (let x = 0; x < nextTetromino.shape[y].length; x++) {
                    if (nextTetromino.shape[y][x]) {
                        drawCell(nextCtx, offsetX + x, offsetY + y, nextTetromino.color, 0.9);
                    }
                }
            }
        }
    }, [gameState, checkCollision]);

    // Draw cell helper
    const drawCell = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, scale: number = 1) => {
        const size = CELL_SIZE * scale;
        const px = x * CELL_SIZE;
        const py = y * CELL_SIZE;

        // Main fill
        ctx.fillStyle = color;
        ctx.fillRect(px + 1, py + 1, size - 2, size - 2);

        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(px + 1, py + 1, size - 2, 3);
        ctx.fillRect(px + 1, py + 1, 3, size - 2);

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(px + size - 4, py + 1, 3, size - 2);
        ctx.fillRect(px + 1, py + size - 4, size - 2, 3);
    };

    // Game loop
    useEffect(() => {
        const update = () => {
            const now = Date.now();
            const dropInterval = Math.max(100, 1000 - (gameState.level - 1) * 100);

            if (!gameState.isPaused && !gameState.isGameOver) {
                if (!gameState.currentPiece) {
                    spawnNewPiece();
                } else if (now - lastDropTimeRef.current > dropInterval) {
                    moveDown();
                    lastDropTimeRef.current = now;
                }
            }

            draw();
            gameLoopRef.current = requestAnimationFrame(update);
        };

        gameLoopRef.current = requestAnimationFrame(update);

        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [gameState.isPaused, gameState.isGameOver, gameState.currentPiece, gameState.level, spawnNewPiece, moveDown, draw]);

    // Handle keyboard
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Start game
    const startGame = () => {
        startTimeRef.current = Date.now();
        setGameState({
            board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)),
            currentPiece: null,
            nextPiece: getRandomPiece(),
            score: 0,
            linesCleared: 0,
            cashEarned: 0,
            level: 1,
            comboCount: 0,
            maxCombo: 0,
            isGameOver: false,
            isPaused: false,
        });
    };

    // Initialize game on mount
    useEffect(() => {
        startGame();
    }, []);

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Main game area */}
            <div className="relative">
                <canvas
                    ref={canvasRef}
                    width={BOARD_WIDTH * CELL_SIZE}
                    height={BOARD_HEIGHT * CELL_SIZE}
                    className="rounded-lg border-2 border-primary/50 shadow-[0_0_30px_rgba(43,161,149,0.2)]"
                />

                {/* Pause overlay */}
                {gameState.isPaused && !gameState.isGameOver && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
                        <div className="text-center">
                            <span className="material-symbols-outlined text-6xl text-primary mb-4">pause</span>
                            <p className="text-white text-xl font-bold">PAUSED</p>
                            <p className="text-gray-400 text-sm mt-2">Press P or ESC to resume</p>
                        </div>
                    </div>
                )}

                {/* Game over overlay */}
                {gameState.isGameOver && (
                    <div className="absolute inset-0 bg-black/90 flex items-center justify-center rounded-lg">
                        <div className="text-center p-6">
                            <span className="material-symbols-outlined text-6xl text-red-500 mb-4">sports_esports</span>
                            <p className="text-white text-2xl font-bold mb-2">GAME OVER</p>
                            <div className="space-y-1 mb-4 text-gray-300">
                                <p>Score: <span className="text-primary font-bold">{gameState.score.toLocaleString()}</span></p>
                                <p>Lines: <span className="text-blue-400 font-bold">{gameState.linesCleared}</span></p>
                                <p>Cash Earned: <span className="text-yellow-400 font-bold">Rp {gameState.cashEarned.toLocaleString()}</span></p>
                                <p>Max Combo: <span className="text-orange-400 font-bold">{gameState.maxCombo}x</span></p>
                            </div>
                            <button
                                onClick={startGame}
                                className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-lg"
                            >
                                Play Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Reward popup */}
                {rewardPopup && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-bounce">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-6 py-3 rounded-lg shadow-2xl">
                            <p className="text-2xl">+Rp {rewardPopup.amount.toLocaleString()}</p>
                            {rewardPopup.combo > 0 && (
                                <p className="text-sm text-center">Combo {rewardPopup.combo}x! (+{(rewardPopup.combo * 10)}%)</p>
                            )}
                            <p className="text-xs text-center mt-1">
                                {rewardPopup.lines === 4 ? 'TETRIS!' : `${rewardPopup.lines} Line${rewardPopup.lines > 1 ? 's' : ''}`}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Side panel */}
            <div className="flex flex-col gap-4 min-w-[180px]">
                {/* Next piece */}
                <div className="bg-card-dark border border-card-border rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-2">Next</p>
                    <canvas
                        ref={nextPieceCanvasRef}
                        width={4 * CELL_SIZE}
                        height={4 * CELL_SIZE}
                        className="mx-auto"
                    />
                </div>

                {/* Stats */}
                <div className="bg-card-dark border border-card-border rounded-xl p-4 space-y-3">
                    <div>
                        <p className="text-gray-400 text-xs">Score</p>
                        <p className="text-white text-xl font-bold">{gameState.score.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs">Level</p>
                        <p className="text-primary text-xl font-bold">{gameState.level}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs">Lines</p>
                        <p className="text-blue-400 text-xl font-bold">{gameState.linesCleared}</p>
                    </div>
                    <div className="pt-2 border-t border-card-border">
                        <p className="text-gray-400 text-xs">Cash Earned</p>
                        <p className="text-yellow-400 text-xl font-bold">Rp {gameState.cashEarned.toLocaleString()}</p>
                    </div>
                    {gameState.comboCount > 0 && (
                        <div className="bg-orange-500/20 rounded-lg p-2 text-center">
                            <p className="text-orange-400 font-bold text-lg">{gameState.comboCount}x COMBO!</p>
                            <p className="text-orange-300 text-xs">+{(gameState.comboCount * 10)}% bonus</p>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="bg-card-dark border border-card-border rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-2">Controls</p>
                    <div className="text-xs text-gray-300 space-y-1">
                        <p><span className="text-primary">←→</span> Move</p>
                        <p><span className="text-primary">↓</span> Soft drop</p>
                        <p><span className="text-primary">↑</span> Rotate</p>
                        <p><span className="text-primary">Space</span> Hard drop</p>
                        <p><span className="text-primary">P/ESC</span> Pause</p>
                    </div>
                </div>

                {/* Rewards Info */}
                <div className="bg-card-dark border border-card-border rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-2">Rewards</p>
                    <div className="text-xs space-y-1">
                        <p className="text-gray-300">1 Line: <span className="text-yellow-400">Rp 50</span></p>
                        <p className="text-gray-300">2 Lines: <span className="text-yellow-400">Rp 150</span></p>
                        <p className="text-gray-300">3 Lines: <span className="text-yellow-400">Rp 300</span></p>
                        <p className="text-gray-300">Tetris: <span className="text-yellow-400">Rp 600</span></p>
                        <p className="text-orange-400 text-xs mt-2">+ 10% per combo!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TetrisGame;
