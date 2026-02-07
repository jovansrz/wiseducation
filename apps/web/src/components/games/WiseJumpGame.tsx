import React, { useRef, useEffect, useState, useCallback } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

interface WiseJumpGameProps {
    userId: string;
    onGameEnd: () => void;
}

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 400;
const GROUND_Y = 320;
const GRAVITY = 0.6;             // Lighter gravity for floatier T-Rex style jumps
const JUMP_FORCE = -10;          // Slightly lower base jump, but variable gravity will boost it
const INITIAL_SPEED = 2;         // Start very chill
const MAX_SPEED = 8;             // Lower cap for manageable difficulty
const SPEED_INCREMENT = 0.00005; // Very slow acceleration

const API_BASE = 'http://localhost:3005/api';

// Colors matching the WISE theme
const COLORS = {
    sky: '#0f1f1e',
    ground: '#162e2b',
    groundLine: '#30b8aa',
    coin: '#ffd700',
    specialCoin: '#00f0f0',
    obstacle: '#f04040',
    text: '#ffffff',
};

interface Obstacle {
    x: number;
    width: number;
    height: number;
    type: 'spike' | 'block';
}

interface Coin {
    x: number;
    y: number;
    collected: boolean;
    isSpecial: boolean;
}

export const WiseJumpGame: React.FC<WiseJumpGameProps> = ({ userId, onGameEnd }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mascotImageRef = useRef<HTMLImageElement | null>(null);
    const { refreshPortfolio } = usePortfolio();

    // Game state
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [distance, setDistance] = useState(0);
    const [coins, setCoins] = useState(0);
    const [specialCoins, setSpecialCoins] = useState(0);
    const [lastEarned, setLastEarned] = useState(0);
    const [showEarned, setShowEarned] = useState(false);
    const [highScore, setHighScore] = useState(0);

    // Game refs for animation loop
    const playerRef = useRef({
        x: 100,
        y: GROUND_Y - 60,
        width: 60,
        height: 60,
        velocityY: 0,
        isJumping: false,
        frame: 0,
        frameCount: 0,
    });

    const gameStateRef = useRef({
        speed: INITIAL_SPEED,
        obstacles: [] as Obstacle[],
        coins: [] as Coin[],
        frameCount: 0,
        distance: 0,
        score: 0,
        coinCount: 0,
        specialCoinCount: 0,
        isRunning: false,
        isHoldingJump: false,
        lastObstacleX: CANVAS_WIDTH,
    });

    // Load mascot image
    useEffect(() => {
        const img = new Image();
        img.src = '/mascot-flying.png';
        img.onload = () => {
            mascotImageRef.current = img;
        };
    }, []);

    // Fetch high score
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${API_BASE}/game/stats/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setHighScore(data.wiseJumpHighScore || 0);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };
        if (userId) fetchStats();
    }, [userId]);

    // Jump handler
    const jump = useCallback(() => {
        if (!playerRef.current.isJumping && gameStateRef.current.isRunning) {
            playerRef.current.velocityY = JUMP_FORCE;
            playerRef.current.isJumping = true;
        }
    }, []);

    // Stop jump (variable gravity handling)
    const stopJump = useCallback(() => {
        gameStateRef.current.isHoldingJump = false;
    }, []);

    // Start game
    const startGame = useCallback(() => {
        playerRef.current = {
            x: 100,
            y: GROUND_Y - 60,
            width: 60,
            height: 60,
            velocityY: 0,
            isJumping: false,
            frame: 0,
            frameCount: 0,
        };

        gameStateRef.current = {
            speed: INITIAL_SPEED,
            obstacles: [],
            coins: [],
            frameCount: 0,
            distance: 0,
            score: 0,
            coinCount: 0,
            specialCoinCount: 0,
            isRunning: true,
            isHoldingJump: false,
            lastObstacleX: CANVAS_WIDTH,
        };

        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setDistance(0);
        setCoins(0);
        setSpecialCoins(0);
        setShowEarned(false);
    }, []);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                if (!gameStarted || gameOver) {
                    startGame();
                } else {
                    jump();
                }
                gameStateRef.current.isHoldingJump = true;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                stopJump();
            }
        };

        const handleMouseDown = () => {
            if (!gameStarted || gameOver) {
                startGame();
            } else {
                jump();
            }
            gameStateRef.current.isHoldingJump = true;
        };

        const handleMouseUp = () => {
            stopJump();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        canvasRef.current?.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        // Touch support
        canvasRef.current?.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleMouseDown();
        });
        window.addEventListener('touchend', handleMouseUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            canvasRef.current?.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            canvasRef.current?.removeEventListener('touchstart', handleMouseDown);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [gameStarted, gameOver, startGame, jump, stopJump]);

    // Spawn obstacle
    const spawnObstacle = useCallback(() => {
        const state = gameStateRef.current;

        // Minimum gap between obstacles - scales with speed for fair reactions
        const minGap = 400 + Math.random() * 150;
        const speedAdjustedGap = minGap + (state.speed * 15);
        if (state.lastObstacleX > CANVAS_WIDTH - speedAdjustedGap) return;

        const type = Math.random() > 0.3 ? 'spike' : 'block';
        // Standardized obstacle sizes for predictable difficulty
        const height = type === 'spike' ? 35 + Math.random() * 15 : 45 + Math.random() * 20;
        const width = type === 'spike' ? 25 : 35 + Math.random() * 15;

        state.obstacles.push({
            x: CANVAS_WIDTH + 50,
            width,
            height,
            type,
        });

        state.lastObstacleX = CANVAS_WIDTH + 50;

        // Spawn coins near obstacle
        if (Math.random() > 0.3) {
            const coinCount = 1 + Math.floor(Math.random() * 3);
            const isSpecial = Math.random() > 0.85;

            for (let i = 0; i < coinCount; i++) {
                state.coins.push({
                    x: CANVAS_WIDTH + 100 + i * 50,
                    y: GROUND_Y - 40 - Math.random() * 100, // Adjusted height to be consistently reachable
                    collected: false,
                    isSpecial: i === 0 && isSpecial,
                });
            }
        }
    }, []);

    // Check collision
    const checkCollision = useCallback((player: typeof playerRef.current, obstacle: Obstacle): boolean => {
        // Forgiving hitbox - near-misses feel fair
        const playerBox = {
            left: player.x + 15,
            right: player.x + player.width - 15,
            top: player.y + 15,
            bottom: player.y + player.height - 10,
        };

        const obstacleBox = {
            left: obstacle.x,
            right: obstacle.x + obstacle.width,
            top: GROUND_Y - obstacle.height,
            bottom: GROUND_Y,
        };

        return !(playerBox.right < obstacleBox.left ||
            playerBox.left > obstacleBox.right ||
            playerBox.bottom < obstacleBox.top ||
            playerBox.top > obstacleBox.bottom);
    }, []);

    // Check coin collection
    const checkCoinCollection = useCallback((player: typeof playerRef.current, coin: Coin): boolean => {
        const dx = (player.x + player.width / 2) - coin.x;
        const dy = (player.y + player.height / 2) - coin.y;
        return Math.sqrt(dx * dx + dy * dy) < 40;
    }, []);

    // Game loop
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;

        const gameLoop = () => {
            const state = gameStateRef.current;
            const player = playerRef.current;

            if (!state.isRunning) return;

            // Update speed
            state.speed = Math.min(MAX_SPEED, state.speed + SPEED_INCREMENT);

            // Update distance/score
            state.distance += state.speed / 10;
            state.score = Math.floor(state.distance) + state.coinCount * 100 + state.specialCoinCount * 500;

            setDistance(Math.floor(state.distance));
            setScore(state.score);

            // Variable Gravity: Hold jump to jump higher (T-Rex style)
            // If moving up and holding jump, reduce gravity
            const currentGravity = (player.velocityY < 0 && state.isHoldingJump) ? GRAVITY * 0.3 : GRAVITY;

            player.velocityY += currentGravity;
            player.y += player.velocityY;

            // Ground collision
            if (player.y >= GROUND_Y - player.height) {
                player.y = GROUND_Y - player.height;
                player.velocityY = 0;
                player.isJumping = false;
            }

            // Animation frame
            player.frameCount++;
            if (player.frameCount % 6 === 0) {
                player.frame = (player.frame + 1) % 4;
            }

            // Update obstacles
            state.obstacles = state.obstacles.filter(obs => {
                obs.x -= state.speed;
                return obs.x > -100;
            });

            // Update track last obstacle position
            if (state.obstacles.length > 0) {
                state.lastObstacleX = Math.max(...state.obstacles.map(o => o.x));
            } else {
                state.lastObstacleX = 0;
            }

            // Spawn new obstacles
            state.frameCount++;
            if (state.frameCount % 60 === 0) {
                spawnObstacle();
            }

            // Update coins
            state.coins = state.coins.filter(coin => {
                coin.x -= state.speed;

                if (!coin.collected && checkCoinCollection(player, coin)) {
                    coin.collected = true;
                    if (coin.isSpecial) {
                        state.specialCoinCount++;
                        setSpecialCoins(state.specialCoinCount);
                    } else {
                        state.coinCount++;
                        setCoins(state.coinCount);
                    }
                }

                return coin.x > -50 && !coin.collected;
            });

            // Check obstacle collisions
            for (const obstacle of state.obstacles) {
                if (checkCollision(player, obstacle)) {
                    state.isRunning = false;
                    setGameOver(true);

                    // Submit score
                    submitScore(state.score, state.coinCount, state.specialCoinCount, Math.floor(state.distance));
                    return;
                }
            }

            // Render
            render(ctx, player, state);

            animationId = requestAnimationFrame(gameLoop);
        };

        animationId = requestAnimationFrame(gameLoop);

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [gameStarted, gameOver, spawnObstacle, checkCollision, checkCoinCollection]);

    // Render function
    const render = useCallback((
        ctx: CanvasRenderingContext2D,
        player: typeof playerRef.current,
        state: typeof gameStateRef.current
    ) => {
        // Clear canvas
        ctx.fillStyle = COLORS.sky;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw parallax background
        const bgOffset = (state.distance * 0.5) % 200;
        ctx.strokeStyle = 'rgba(48, 184, 170, 0.1)';
        ctx.lineWidth = 1;
        for (let i = -1; i < 10; i++) {
            const x = i * 200 - bgOffset;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + 100, CANVAS_HEIGHT);
            ctx.stroke();
        }

        // Draw ground
        ctx.fillStyle = COLORS.ground;
        ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

        // Ground line with glow
        ctx.shadowColor = COLORS.groundLine;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = COLORS.groundLine;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, GROUND_Y);
        ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw moving ground pattern
        ctx.fillStyle = 'rgba(48, 184, 170, 0.1)';
        const patternOffset = (state.distance * 2) % 40;
        for (let i = -1; i < CANVAS_WIDTH / 40 + 1; i++) {
            ctx.fillRect(i * 40 - patternOffset, GROUND_Y + 5, 20, 3);
        }

        // Draw obstacles
        for (const obstacle of state.obstacles) {
            if (obstacle.type === 'spike') {
                // Draw spike (triangle)
                ctx.fillStyle = COLORS.obstacle;
                ctx.beginPath();
                ctx.moveTo(obstacle.x, GROUND_Y);
                ctx.lineTo(obstacle.x + obstacle.width / 2, GROUND_Y - obstacle.height);
                ctx.lineTo(obstacle.x + obstacle.width, GROUND_Y);
                ctx.closePath();
                ctx.fill();

                // Spike glow
                ctx.shadowColor = COLORS.obstacle;
                ctx.shadowBlur = 8;
                ctx.stroke();
                ctx.shadowBlur = 0;
            } else {
                // Draw block
                ctx.fillStyle = COLORS.obstacle;
                ctx.fillRect(obstacle.x, GROUND_Y - obstacle.height, obstacle.width, obstacle.height);

                // Block highlight
                ctx.fillStyle = 'rgba(255,255,255,0.2)';
                ctx.fillRect(obstacle.x, GROUND_Y - obstacle.height, obstacle.width, 5);
            }
        }

        // Draw coins
        for (const coin of state.coins) {
            if (coin.collected) continue;

            ctx.beginPath();
            ctx.arc(coin.x, coin.y, coin.isSpecial ? 18 : 12, 0, Math.PI * 2);
            ctx.fillStyle = coin.isSpecial ? COLORS.specialCoin : COLORS.coin;
            ctx.fill();

            // Coin glow
            ctx.shadowColor = coin.isSpecial ? COLORS.specialCoin : COLORS.coin;
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Coin inner circle
            ctx.beginPath();
            ctx.arc(coin.x, coin.y, coin.isSpecial ? 10 : 6, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw player (mascot)
        if (mascotImageRef.current) {
            ctx.save();

            // Slight rotation based on velocity for dynamic feel
            const rotation = player.velocityY * 0.02;
            ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
            ctx.rotate(rotation);
            ctx.scale(-1, 1); // Flip mascot horizontally

            // Bobbing animation when running
            const bobOffset = player.isJumping ? 0 : Math.sin(player.frame * 0.8) * 3;

            ctx.drawImage(
                mascotImageRef.current,
                -player.width / 2,
                -player.height / 2 + bobOffset,
                player.width,
                player.height
            );

            ctx.restore();
        } else {
            // Fallback circle if image not loaded
            ctx.fillStyle = '#30b8aa';
            ctx.beginPath();
            ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw HUD
        ctx.fillStyle = COLORS.text;
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${state.score.toLocaleString()}`, 20, 40);

        ctx.font = '18px Inter, sans-serif';
        ctx.fillText(`Distance: ${Math.floor(state.distance)}m`, 20, 70);

        // Coins display
        ctx.fillStyle = COLORS.coin;
        ctx.beginPath();
        ctx.arc(CANVAS_WIDTH - 100, 35, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = COLORS.text;
        ctx.textAlign = 'right';
        ctx.fillText(`${state.coinCount}`, CANVAS_WIDTH - 120, 42);

        // Special coins
        if (state.specialCoinCount > 0) {
            ctx.fillStyle = COLORS.specialCoin;
            ctx.beginPath();
            ctx.arc(CANVAS_WIDTH - 100, 65, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = COLORS.text;
            ctx.fillText(`${state.specialCoinCount}`, CANVAS_WIDTH - 120, 72);
        }

    }, []);

    // Submit score
    const submitScore = async (finalScore: number, coinCount: number, specialCoinCount: number, dist: number) => {
        if (!userId) return;

        try {
            const response = await fetch(`${API_BASE}/game/submit-score`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    gameType: 'wise_jump',
                    score: finalScore,
                    coinsCollected: coinCount + specialCoinCount,
                    specialCoins: specialCoinCount,
                    distance: dist,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setLastEarned(result.wiseCashEarned);
                setShowEarned(true);
                refreshPortfolio();

                if (finalScore > highScore) {
                    setHighScore(finalScore);
                }
            }
        } catch (error) {
            console.error('Failed to submit score:', error);
        }
    };

    // Render start screen
    const renderStartScreen = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Background
        ctx.fillStyle = COLORS.sky;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Ground
        ctx.fillStyle = COLORS.ground;
        ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

        ctx.strokeStyle = COLORS.groundLine;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, GROUND_Y);
        ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
        ctx.stroke();

        // Title
        ctx.fillStyle = COLORS.text;
        ctx.font = 'bold 48px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('WISE JUMP', CANVAS_WIDTH / 2, 120);

        // Subtitle
        ctx.font = '20px Inter, sans-serif';
        ctx.fillStyle = '#30b8aa';
        ctx.fillText('Collect coins, avoid obstacles!', CANVAS_WIDTH / 2, 160);

        // Mascot
        if (mascotImageRef.current) {
            ctx.save();
            ctx.translate(CANVAS_WIDTH / 2, 230); // Center of image (180 + 100/2)
            ctx.scale(-1, 1);
            ctx.drawImage(mascotImageRef.current, -50, -50, 100, 100);
            ctx.restore();
        }

        // Instructions
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '18px Inter, sans-serif';
        ctx.fillText('Press SPACE or Click to Start', CANVAS_WIDTH / 2, 320);

        // High score
        if (highScore > 0) {
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 16px Inter, sans-serif';
            ctx.fillText(`High Score: ${highScore.toLocaleString()}`, CANVAS_WIDTH / 2, 360);
        }
    }, [highScore]);

    // Show start screen when not started
    useEffect(() => {
        if (!gameStarted) {
            const interval = setInterval(renderStartScreen, 100);
            return () => clearInterval(interval);
        }
    }, [gameStarted, renderStartScreen]);

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative">
                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="rounded-2xl border-2 border-card-border shadow-2xl cursor-pointer"
                />

                {/* Game Over Overlay */}
                {gameOver && (
                    <div className="absolute inset-0 bg-black/85 flex items-center justify-center rounded-2xl">
                        <div className="text-center p-8">
                            <p className="text-red-500 text-4xl font-black mb-4">GAME OVER</p>

                            <div className="grid grid-cols-2 gap-6 mb-6 text-left">
                                <div>
                                    <p className="text-text-secondary text-sm">Score</p>
                                    <p className="text-white text-2xl font-bold">{score.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-text-secondary text-sm">Distance</p>
                                    <p className="text-white text-2xl font-bold">{distance}m</p>
                                </div>
                                <div>
                                    <p className="text-text-secondary text-sm">Coins</p>
                                    <p className="text-yellow-400 text-xl font-bold">{coins}</p>
                                </div>
                                <div>
                                    <p className="text-text-secondary text-sm">Special Coins</p>
                                    <p className="text-cyan-400 text-xl font-bold">{specialCoins}</p>
                                </div>
                            </div>

                            {showEarned && (
                                <div className="bg-primary/20 border border-primary/50 rounded-xl p-4 mb-6 animate-pulse">
                                    <p className="text-primary text-xl font-bold">
                                        +{lastEarned.toLocaleString()} WISE Cash!
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={startGame}
                                    className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/80 transition-colors"
                                >
                                    Play Again
                                </button>
                                <button
                                    onClick={onGameEnd}
                                    className="px-8 py-3 bg-card-border text-white font-bold rounded-xl hover:bg-card-dark transition-colors"
                                >
                                    Exit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="bg-card-dark/50 rounded-xl border border-card-border p-4 text-center">
                <p className="text-text-secondary text-sm">
                    <span className="text-white font-bold">Space / ↑ / Click</span> to Jump (Hold to Jump Higher)
                </p>
            </div>
        </div>
    );
};
