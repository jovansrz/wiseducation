import React, { useRef, useEffect, useState, useCallback } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

interface TetrisGameProps {
    userId: string;
    onGameEnd: () => void;
}

// Tetr.io style colors
const COLORS = {
    I: '#00f0f0', // Cyan
    O: '#f0f000', // Yellow
    T: '#a000f0', // Purple
    S: '#00f000', // Green
    Z: '#f00000', // Red
    J: '#0000f0', // Blue
    L: '#f0a000', // Orange
    ghost: 'rgba(255, 255, 255, 0.15)',
    background: '#0a0a0a',
    grid: '#1a1a1a',
};

// Tetromino shapes
const TETROMINOS: Record<string, number[][]> = {
    I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
};

const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 28;

// DAS (Delayed Auto Shift) settings - tetr.io style
const DAS_DELAY = 133; // ms before auto-repeat starts
const ARR = 10; // ms between repeats (0 for instant)

const API_BASE = 'http://localhost:3005/api';

interface Piece {
    type: string;
    shape: number[][];
    x: number;
    y: number;
}

export const TetrisGame: React.FC<TetrisGameProps> = ({ userId, onGameEnd }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const holdCanvasRef = useRef<HTMLCanvasElement>(null);
    const nextCanvasRef = useRef<HTMLCanvasElement>(null);
    const { refreshPortfolio } = usePortfolio();

    const [board, setBoard] = useState<(string | null)[][]>(() =>
        Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null))
    );
    const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
    const [holdPiece, setHoldPiece] = useState<string | null>(null);
    const [canHold, setCanHold] = useState(true);
    const [nextQueue, setNextQueue] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [lines, setLines] = useState(0);
    const [level, setLevel] = useState(1);
    const [combo, setCombo] = useState(-1);
    const [gameOver, setGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [lastEarned, setLastEarned] = useState(0);
    const [showEarned, setShowEarned] = useState(false);

    // Key state for DAS
    const keysPressed = useRef<Set<string>>(new Set());
    const dasTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const arrTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    // Bag randomizer for fair piece distribution
    const bagRef = useRef<string[]>([]);

    const getNextFromBag = useCallback(() => {
        if (bagRef.current.length === 0) {
            bagRef.current = [...PIECE_TYPES].sort(() => Math.random() - 0.5);
        }
        return bagRef.current.pop()!;
    }, []);

    // Initialize next queue
    useEffect(() => {
        const initialQueue = [];
        for (let i = 0; i < 5; i++) {
            initialQueue.push(getNextFromBag());
        }
        setNextQueue(initialQueue);
    }, [getNextFromBag]);

    // Spawn new piece
    const spawnPiece = useCallback(() => {
        if (nextQueue.length === 0) return;

        const type = nextQueue[0];
        const newQueue = [...nextQueue.slice(1), getNextFromBag()];
        setNextQueue(newQueue);

        const shape = TETROMINOS[type];
        const x = Math.floor((BOARD_WIDTH - shape[0].length) / 2);
        const y = 0;

        const newPiece = { type, shape, x, y };

        // Check if can spawn
        if (!isValidPosition(newPiece, board)) {
            setGameOver(true);
            return null;
        }

        setCurrentPiece(newPiece);
        setCanHold(true);
        return newPiece;
    }, [nextQueue, getNextFromBag, board]);

    // Check valid position
    const isValidPosition = (piece: Piece, boardState: (string | null)[][]): boolean => {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const newX = piece.x + x;
                    const newY = piece.y + y;

                    if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                        return false;
                    }
                    if (newY >= 0 && boardState[newY][newX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    // Rotate piece with SRS kick system
    const rotatePiece = useCallback((clockwise: boolean) => {
        if (!currentPiece || gameOver || isPaused) return;

        const { shape, type } = currentPiece;
        const size = shape.length;
        const newShape: number[][] = [];

        for (let y = 0; y < size; y++) {
            newShape[y] = [];
            for (let x = 0; x < size; x++) {
                if (clockwise) {
                    newShape[y][x] = shape[size - 1 - x][y];
                } else {
                    newShape[y][x] = shape[x][size - 1 - y];
                }
            }
        }

        // SRS kick offsets
        const kicks = type === 'I'
            ? [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]]
            : [[0, 0], [-1, 0], [1, 0], [0, -1], [-1, -1], [1, -1]];

        for (const [kickX, kickY] of kicks) {
            const testPiece = { ...currentPiece, shape: newShape, x: currentPiece.x + kickX, y: currentPiece.y + kickY };
            if (isValidPosition(testPiece, board)) {
                setCurrentPiece(testPiece);
                return;
            }
        }
    }, [currentPiece, board, gameOver, isPaused]);

    // Move piece
    const movePiece = useCallback((dx: number, dy: number) => {
        if (!currentPiece || gameOver || isPaused) return false;

        const newPiece = { ...currentPiece, x: currentPiece.x + dx, y: currentPiece.y + dy };
        if (isValidPosition(newPiece, board)) {
            setCurrentPiece(newPiece);
            return true;
        }
        return false;
    }, [currentPiece, board, gameOver, isPaused]);

    // Get ghost piece Y position
    const getGhostY = useCallback(() => {
        if (!currentPiece) return 0;

        let ghostY = currentPiece.y;
        while (isValidPosition({ ...currentPiece, y: ghostY + 1 }, board)) {
            ghostY++;
        }
        return ghostY;
    }, [currentPiece, board]);

    // Hard drop
    const hardDrop = useCallback(() => {
        if (!currentPiece || gameOver || isPaused) return;

        const ghostY = getGhostY();
        const dropDistance = ghostY - currentPiece.y;
        setScore(prev => prev + dropDistance * 2);
        setCurrentPiece({ ...currentPiece, y: ghostY });

        // Lock immediately
        lockPiece({ ...currentPiece, y: ghostY });
    }, [currentPiece, getGhostY, gameOver, isPaused]);

    // Lock piece and clear lines
    const lockPiece = useCallback((piece: Piece) => {
        const newBoard = board.map(row => [...row]);

        // Place piece
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardY = piece.y + y;
                    const boardX = piece.x + x;
                    if (boardY >= 0) {
                        newBoard[boardY][boardX] = piece.type;
                    }
                }
            }
        }

        // Check for line clears
        let linesCleared = 0;
        for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
            if (newBoard[y].every(cell => cell !== null)) {
                newBoard.splice(y, 1);
                newBoard.unshift(Array(BOARD_WIDTH).fill(null));
                linesCleared++;
                y++; // Check same row again
            }
        }

        // Score calculation (tetr.io style)
        if (linesCleared > 0) {
            const linePoints = [0, 100, 300, 500, 800][linesCleared] * level;
            const newCombo = combo + 1;
            const comboBonus = newCombo > 0 ? 50 * newCombo * level : 0;

            setScore(prev => prev + linePoints + comboBonus);
            setLines(prev => prev + linesCleared);
            setCombo(newCombo);

            // Level up every 10 lines
            setLevel(Math.floor((lines + linesCleared) / 10) + 1);
        } else {
            setCombo(-1);
        }

        setBoard(newBoard);
        setCurrentPiece(null);
    }, [board, combo, level, lines]);

    // Hold piece
    const holdCurrentPiece = useCallback(() => {
        if (!currentPiece || !canHold || gameOver || isPaused) return;

        const currentType = currentPiece.type;

        if (holdPiece) {
            // Swap with hold
            const shape = TETROMINOS[holdPiece];
            const x = Math.floor((BOARD_WIDTH - shape[0].length) / 2);
            setCurrentPiece({ type: holdPiece, shape, x, y: 0 });
        } else {
            // Put in hold and spawn next
            setCurrentPiece(null);
            setTimeout(() => spawnPiece(), 0);
        }

        setHoldPiece(currentType);
        setCanHold(false);
    }, [currentPiece, holdPiece, canHold, spawnPiece, gameOver, isPaused]);

    // Initial piece spawn
    useEffect(() => {
        if (nextQueue.length > 0 && !currentPiece && !gameOver) {
            spawnPiece();
        }
    }, [nextQueue, currentPiece, spawnPiece, gameOver]);

    // Game loop - gravity
    useEffect(() => {
        if (gameOver || isPaused || !currentPiece) return;

        const speed = Math.max(50, 1000 - (level - 1) * 100);

        const interval = setInterval(() => {
            if (!movePiece(0, 1)) {
                lockPiece(currentPiece);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [currentPiece, level, movePiece, lockPiece, gameOver, isPaused]);

    // Keyboard controls with DAS/ARR
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (keysPressed.current.has(e.code)) return;
            keysPressed.current.add(e.code);

            switch (e.code) {
                case 'ArrowLeft':
                case 'ArrowRight':
                    const dir = e.code === 'ArrowLeft' ? -1 : 1;
                    movePiece(dir, 0);

                    // Start DAS
                    dasTimer.current = setTimeout(() => {
                        if (ARR <= 0) {
                            // Instant move to wall
                            while (movePiece(dir, 0)) { }
                        } else {
                            arrTimer.current = setInterval(() => movePiece(dir, 0), ARR);
                        }
                    }, DAS_DELAY);
                    break;
                case 'ArrowDown':
                    movePiece(0, 1);
                    setScore(prev => prev + 1);
                    break;
                case 'ArrowUp':
                case 'KeyX':
                    rotatePiece(true);
                    break;
                case 'KeyZ':
                case 'ControlLeft':
                case 'ControlRight':
                    rotatePiece(false);
                    break;
                case 'Space':
                    e.preventDefault();
                    hardDrop();
                    break;
                case 'KeyC':
                case 'ShiftLeft':
                case 'ShiftRight':
                    holdCurrentPiece();
                    break;
                case 'KeyP':
                case 'Escape':
                    setIsPaused(p => !p);
                    break;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current.delete(e.code);

            if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
                if (dasTimer.current) clearTimeout(dasTimer.current);
                if (arrTimer.current) clearInterval(arrTimer.current);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (dasTimer.current) clearTimeout(dasTimer.current);
            if (arrTimer.current) clearInterval(arrTimer.current);
        };
    }, [movePiece, rotatePiece, hardDrop, holdCurrentPiece]);

    // Render main canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = COLORS.grid;
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

        // Draw placed blocks
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                const cell = board[y][x];
                if (cell) {
                    drawBlock(ctx, x, y, COLORS[cell as keyof typeof COLORS] as string);
                }
            }
        }

        // Draw ghost piece
        if (currentPiece) {
            const ghostY = getGhostY();
            for (let y = 0; y < currentPiece.shape.length; y++) {
                for (let x = 0; x < currentPiece.shape[y].length; x++) {
                    if (currentPiece.shape[y][x]) {
                        const drawX = currentPiece.x + x;
                        const drawY = ghostY + y;
                        if (drawY >= 0) {
                            ctx.fillStyle = COLORS.ghost;
                            ctx.fillRect(drawX * CELL_SIZE + 2, drawY * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
                            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                            ctx.strokeRect(drawX * CELL_SIZE + 2, drawY * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
                        }
                    }
                }
            }
        }

        // Draw current piece
        if (currentPiece) {
            for (let y = 0; y < currentPiece.shape.length; y++) {
                for (let x = 0; x < currentPiece.shape[y].length; x++) {
                    if (currentPiece.shape[y][x]) {
                        const drawX = currentPiece.x + x;
                        const drawY = currentPiece.y + y;
                        if (drawY >= 0) {
                            drawBlock(ctx, drawX, drawY, COLORS[currentPiece.type as keyof typeof COLORS] as string);
                        }
                    }
                }
            }
        }

    }, [board, currentPiece, getGhostY]);

    // Draw block helper
    const drawBlock = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
        const padding = 2;
        ctx.fillStyle = color;
        ctx.fillRect(x * CELL_SIZE + padding, y * CELL_SIZE + padding, CELL_SIZE - padding * 2, CELL_SIZE - padding * 2);

        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(x * CELL_SIZE + padding, y * CELL_SIZE + padding, CELL_SIZE - padding * 2, 4);
        ctx.fillRect(x * CELL_SIZE + padding, y * CELL_SIZE + padding, 4, CELL_SIZE - padding * 2);

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(x * CELL_SIZE + padding, y * CELL_SIZE + CELL_SIZE - padding - 4, CELL_SIZE - padding * 2, 4);
        ctx.fillRect(x * CELL_SIZE + CELL_SIZE - padding - 4, y * CELL_SIZE + padding, 4, CELL_SIZE - padding * 2);
    };

    // Render hold canvas
    useEffect(() => {
        const canvas = holdCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (holdPiece) {
            const shape = TETROMINOS[holdPiece];
            const offsetX = (4 - shape[0].length) / 2;
            const offsetY = (4 - shape.length) / 2;

            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    if (shape[y][x]) {
                        const color = canHold ? COLORS[holdPiece as keyof typeof COLORS] as string : 'rgba(100,100,100,0.5)';
                        ctx.fillStyle = color;
                        ctx.fillRect((offsetX + x) * 20 + 2, (offsetY + y) * 20 + 2, 16, 16);
                    }
                }
            }
        }
    }, [holdPiece, canHold]);

    // Render next queue canvas
    useEffect(() => {
        const canvas = nextCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        nextQueue.slice(0, 5).forEach((type, index) => {
            const shape = TETROMINOS[type];
            const offsetX = (4 - shape[0].length) / 2;
            const offsetY = index * 3 + 0.5;

            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    if (shape[y][x]) {
                        ctx.fillStyle = COLORS[type as keyof typeof COLORS] as string;
                        ctx.fillRect((offsetX + x) * 20 + 2, (offsetY + y) * 20 + 2, 16, 16);
                    }
                }
            }
        });
    }, [nextQueue]);

    // Submit score on game over
    useEffect(() => {
        if (gameOver && userId) {
            const submitScore = async () => {
                try {
                    const response = await fetch(`${API_BASE}/game/submit-score`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId,
                            gameType: 'tetris',
                            score,
                            linesCleared: lines,
                        }),
                    });

                    if (response.ok) {
                        const result = await response.json();
                        setLastEarned(result.wiseCashEarned);
                        setShowEarned(true);
                        refreshPortfolio();
                    }
                } catch (error) {
                    console.error('Failed to submit score:', error);
                }
            };

            submitScore();
        }
    }, [gameOver, userId, score, lines]);

    const restartGame = () => {
        setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)));
        setCurrentPiece(null);
        setHoldPiece(null);
        setCanHold(true);
        bagRef.current = [];
        const initialQueue = [];
        for (let i = 0; i < 5; i++) {
            initialQueue.push(getNextFromBag());
        }
        setNextQueue(initialQueue);
        setScore(0);
        setLines(0);
        setLevel(1);
        setCombo(-1);
        setGameOver(false);
        setIsPaused(false);
        setShowEarned(false);
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex gap-6">
                {/* Hold Panel */}
                <div className="flex flex-col gap-4">
                    <div className="bg-card-dark rounded-xl border border-card-border p-4">
                        <p className="text-text-secondary text-xs font-bold uppercase mb-2">Hold</p>
                        <canvas
                            ref={holdCanvasRef}
                            width={80}
                            height={80}
                            className="rounded-lg"
                        />
                        <p className="text-text-secondary text-xs mt-2 text-center">C / Shift</p>
                    </div>

                    {/* Stats */}
                    <div className="bg-card-dark rounded-xl border border-card-border p-4 space-y-3">
                        <div>
                            <p className="text-text-secondary text-xs">Score</p>
                            <p className="text-white text-xl font-bold">{score.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-text-secondary text-xs">Lines</p>
                            <p className="text-white text-lg font-bold">{lines}</p>
                        </div>
                        <div>
                            <p className="text-text-secondary text-xs">Level</p>
                            <p className="text-primary text-lg font-bold">{level}</p>
                        </div>
                        {combo > 0 && (
                            <div className="text-yellow-400 font-bold animate-pulse">
                                {combo} Combo!
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Game Board */}
                <div className="relative">
                    <canvas
                        ref={canvasRef}
                        width={BOARD_WIDTH * CELL_SIZE}
                        height={BOARD_HEIGHT * CELL_SIZE}
                        className="rounded-lg border-2 border-card-border shadow-2xl"
                    />

                    {/* Pause Overlay */}
                    {isPaused && !gameOver && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
                            <div className="text-center">
                                <p className="text-white text-2xl font-bold mb-4">PAUSED</p>
                                <p className="text-text-secondary">Press P or ESC to resume</p>
                            </div>
                        </div>
                    )}

                    {/* Game Over Overlay */}
                    {gameOver && (
                        <div className="absolute inset-0 bg-black/90 flex items-center justify-center rounded-lg">
                            <div className="text-center p-8">
                                <p className="text-red-500 text-3xl font-black mb-4">GAME OVER</p>
                                <p className="text-white text-xl mb-2">Score: {score.toLocaleString()}</p>
                                <p className="text-text-secondary mb-4">Lines: {lines}</p>

                                {showEarned && (
                                    <div className="bg-primary/20 border border-primary/50 rounded-xl p-4 mb-6 animate-pulse">
                                        <p className="text-primary text-lg font-bold">
                                            +{lastEarned.toLocaleString()} WISE Cash!
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={restartGame}
                                        className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/80 transition-colors"
                                    >
                                        Play Again
                                    </button>
                                    <button
                                        onClick={onGameEnd}
                                        className="px-6 py-3 bg-card-border text-white font-bold rounded-xl hover:bg-card-dark transition-colors"
                                    >
                                        Exit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Next Queue Panel */}
                <div className="bg-card-dark rounded-xl border border-card-border p-4">
                    <p className="text-text-secondary text-xs font-bold uppercase mb-2">Next</p>
                    <canvas
                        ref={nextCanvasRef}
                        width={80}
                        height={300}
                        className="rounded-lg"
                    />
                </div>
            </div>

            {/* Controls Guide */}
            <div className="bg-card-dark/50 rounded-xl border border-card-border p-4 text-center max-w-md">
                <p className="text-text-secondary text-sm">
                    <span className="text-white font-bold">←→</span> Move •
                    <span className="text-white font-bold"> ↓</span> Soft Drop •
                    <span className="text-white font-bold"> Space</span> Hard Drop •
                    <span className="text-white font-bold"> ↑/X</span> Rotate CW •
                    <span className="text-white font-bold"> Z</span> Rotate CCW •
                    <span className="text-white font-bold"> C</span> Hold
                </p>
            </div>
        </div>
    );
};
