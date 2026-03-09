import Phaser from 'phaser';
import EventBus from './EventBus';
import { audio } from './audio';

const CAM_W = 1280;
const CAM_H = 720;
const WORLD_W = 4000;
const WORLD_H = 3000;
const SPEED = 200;
const HQ_XP_REQUIRED = 1200;

// ── Buildings (Interactive Hubs + Scenic Landmarks) ─────────────────────
const BUILDINGS = [
    // --- Original Core Activities ---
    {
        id: 'hackathon',
        label: 'Hackathon Arena',
        sublabel: 'Code. Compete. Win.',
        x: 300, y: 250, w: 300, h: 220,
        color: 0x7c3aed, accent: 0xc084fc, roofColor: 0x3b0764,
        iconEmoji: '⚡', xp: 250,
    },
    {
        id: 'workshop',
        label: 'Workshop Hall',
        sublabel: 'Learn & Build',
        x: WORLD_W - 600, y: 250, w: 300, h: 220,
        color: 0x1d4ed8, accent: 0x60a5fa, roofColor: 0x1e3a8a,
        iconEmoji: '🔧', xp: 200,
    },
    {
        id: 'events',
        label: 'Sir MV Hall', // Replaced IEEE Events Center
        sublabel: 'Seminars & Talks',
        x: WORLD_W / 2 - 150, y: 250, w: 300, h: 220,
        color: 0x059669, accent: 0x34d399, roofColor: 0x064e3b,
        iconEmoji: '🏛️', xp: 200,
    },
    {
        id: 'volunteering',
        label: 'Volunteering Hub',
        sublabel: 'Give Back & Grow',
        x: 300, y: WORLD_H / 2 - 110, w: 300, h: 220,
        color: 0xea580c, accent: 0xfb923c, roofColor: 0x7c2d12,
        iconEmoji: '🤝', xp: 250,
    },
    {
        id: 'industry',
        label: 'Industry Visit',
        sublabel: 'Tech Tours & Exposure',
        x: WORLD_W - 615, y: WORLD_H / 2 - 75, w: 330, h: 150,
        color: 0xdb2777, accent: 0xf472b6, roofColor: 0x831843,
        iconEmoji: '🚌', xp: 300,
        isImage: true,
        texture: 'bus_sprite',
        locked: true, reqXP: 300,
    },
    {
        id: 'hq',
        label: 'NISB Club (IEEE HQ)',
        sublabel: 'Professional Membership',
        x: WORLD_W / 2 - 200, y: WORLD_H / 2 - 170, w: 400, h: 280,
        color: 0x92400e, accent: 0xfbbf24, roofColor: 0x451a03,
        iconEmoji: '🌟', xp: 0,
        locked: true,
    },

    // --- New NIE Mysore Campus Additions ---
    {
        id: 'golden_jubilee',
        label: 'Golden Jubilee',
        sublabel: 'Academic Block',
        x: 200, y: WORLD_H - 1250, w: 500, h: 350,
        color: 0xd97706, accent: 0xfcd34d, roofColor: 0x78350f,
        iconEmoji: '🏢', xp: 0,
    },
    {
        id: 'diamond_jubilee',
        label: 'Diamond Jubilee',
        sublabel: 'Sports & Recreation',
        x: WORLD_W - 700, y: WORLD_H - 1250, w: 500, h: 350,
        color: 0x0ea5e9, accent: 0x7dd3fc, roofColor: 0x0c4a6e,
        iconEmoji: '💎', xp: 0,
    },
    {
        id: 'virgin_tree',
        label: 'Virgin Tree',
        sublabel: 'Hangout Spot',
        x: WORLD_W / 2 - 125, y: WORLD_H - 1000, w: 250, h: 250,
        color: 0x16a34a, accent: 0x4ade80, roofColor: 0x064e3b,
        iconEmoji: '🌳', xp: 0,
        isNature: true // Custom flag if we want it drawn differently later
    },
    {
        id: 'red_canteen',
        label: 'Red Canteen',
        sublabel: 'Grab a bite',
        x: 400, y: WORLD_H - 450, w: 220, h: 180,
        color: 0xef4444, accent: 0xf87171, roofColor: 0x7f1d1d,
        iconEmoji: '🍔', xp: 0,
    },
    {
        id: 'chai_shop',
        label: 'Chai Shop',
        sublabel: 'Tapri Break',
        x: WORLD_W - 620, y: WORLD_H - 450, w: 180, h: 160,
        color: 0xa8a29e, accent: 0xd6d3d1, roofColor: 0x44403c,
        iconEmoji: '☕', xp: 0,
    },
    {
        id: 'yuvika_gate',
        label: 'Yuvika Girls Hostel',
        sublabel: 'Hostel Gate',
        x: WORLD_W - 380, y: 540, w: 250, h: 200,
        color: 0xf472b6, accent: 0xfbcfe8, roofColor: 0xbe185d,
        iconEmoji: '🏫', xp: 0,
        isImage: true,
        texture: 'gate'
    }
];

// ── Draw a building ───────────────────────────────────────────────────────
function drawBuilding(g, b) {
    const { x, y, w, h, color, accent, roofColor } = b;

    // Drop shadow
    g.fillStyle(0x000000, 0.3);
    g.fillRect(x + 10, y + 10, w, h);

    // Body
    g.fillStyle(color, 1);
    g.fillRect(x, y, w, h);

    // Roof
    g.fillStyle(roofColor, 1);
    g.fillRect(x, y, w, 34);

    // Roof stripe
    g.fillStyle(accent, 0.5);
    g.fillRect(x, y + 30, w, 4);

    // Windows
    const cols = Math.floor((w - 32) / 52);
    const rows = Math.floor((h - 72) / 48);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const wx = x + 16 + c * 52;
            const wy = y + 48 + r * 48;
            // Frame
            g.fillStyle(0xffffff, 0.1);
            g.fillRect(wx - 2, wy - 2, 30, 24);
            // Glass
            const lit = (c + r) % 3 !== 0;
            g.fillStyle(lit ? 0xbfdbfe : 0x1e3a5f, lit ? 0.85 : 0.5);
            g.fillRect(wx, wy, 26, 20);
            // Shine
            g.fillStyle(0xffffff, 0.25);
            g.fillRect(wx + 1, wy + 1, 8, 4);
        }
    }

    // Door
    const dx = x + w / 2 - 18;
    const dy = y + h - 50;
    g.fillStyle(roofColor, 1);
    g.fillRect(dx, dy, 36, 50);
    g.fillStyle(accent, 0.6);
    g.fillRect(dx + 3, dy + 4, 12, 22);
    g.fillRect(dx + 21, dy + 4, 12, 22);
    g.fillStyle(0xffd700, 1);
    g.fillRect(dx + 16, dy + 28, 4, 3);

    // Pillars
    g.fillStyle(0xe2e8f0, 0.85);
    g.fillRect(x + 8, y + 30, 12, h - 30);
    g.fillRect(x + w - 20, y + 30, 12, h - 30);

    // Border
    g.lineStyle(2.5, accent, 0.9);
    g.strokeRect(x, y, w, h);
}

// ── Main Scene ────────────────────────────────────────────────────────────
export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.playerXP = 0;
        this.playerLevel = 1;
        this.nearBuilding = null;
        this.interactZones = [];
        this.staticGroup = null;
        this.lastDir = 'down';
        this.walkFrame = 0;
        this.walkTimer = 0;
        this.joystickDir = { x: 0, y: 0 };
        this.mobileInteract = false;
        this.walkingNPCs = [];   // patrol NPCs
        this.bannerNPCs = [];    // IEEE banner holders
        this.hqLockOverlay = null;
        this.promptText = null;
        this.levelAura = null;
        this.playerShadow = null;
        this.bgMusic = null;
        this.bgMusicElement = null;
        this.bgMusicEnabled = true;
        // NISBOT
        this.nisbot = null;
        this.nisbotLabel = null;
        this.nisbotHandshakeDone = false;
    }

    // ── Texture generation ──────────────────────────────────────────────────
    createPlayerFrame(key, dir, frame) {
        if (this.textures.exists(key)) return;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const W = 48, H = 72;
        const CX = W / 2;

        const swing = frame % 2 === 0;
        const lL = swing ? -6 : 5, lR = swing ? 5 : -6;
        const both = dir === 'down' || dir === 'up';

        // ── Ground shadow (solid dark) ──
        g.fillStyle(0x0a1a0a); g.fillEllipse(CX, H - 1, 32, 8);

        // ── Legs – dark navy jeans ──
        const lW = 10, lH = 26;
        const lX1 = CX - 12, lX2 = CX + 2;
        if (both) {
            g.fillStyle(0x1e3a5f); g.fillRect(lX1, H - lH + lL, lW, lH);
            g.fillStyle(0x1e3a5f); g.fillRect(lX2, H - lH + lR, lW, lH);
            // Jeans crease highlight
            g.fillStyle(0x274d7a); g.fillRect(lX1 + 3, H - lH + lL + 4, 2, lH - 8);
            g.fillStyle(0x274d7a); g.fillRect(lX2 + 3, H - lH + lR + 4, 2, lH - 8);
        } else {
            g.fillStyle(0x1e3a5f); g.fillRect(CX - 5, H - lH, 10, lH);
            g.fillStyle(0x274d7a); g.fillRect(CX - 2, H - lH + 4, 2, lH - 8);
        }

        // ── Shoes – black with white toe ──
        g.fillStyle(0x111827);
        if (both) {
            g.fillRect(lX1 - 2, H - 6 + lL, 14, 6);
            g.fillRect(lX2, H - 6 + lR, 14, 6);
            g.fillStyle(0xf1f5f9);
            g.fillRect(lX1 + 9, H - 5 + lL, 3, 4);
            g.fillRect(lX2 + 11, H - 5 + lR, 3, 4);
        } else {
            const sx = dir === 'right' ? CX : CX - 10;
            g.fillRect(sx, H - 6, 16, 6);
            g.fillStyle(0xf1f5f9); g.fillRect(sx + 12, H - 5, 4, 4);
        }

        // ── Shirt – crisp white with collar and shadow ──
        g.fillStyle(0xf1f5f9); g.fillRect(CX - 14, H - 50, 28, 22);
        // Dark side shadows on shirt
        g.fillStyle(0xd1d9e0); g.fillRect(CX - 14, H - 50, 4, 22);
        g.fillStyle(0xd1d9e0); g.fillRect(CX + 10, H - 50, 4, 22);
        // Shirt collar (V-neck) - dark notch
        g.fillStyle(0x475569);
        g.fillTriangle(CX - 5, H - 50, CX + 5, H - 50, CX, H - 42);
        // Shirt crease
        g.fillStyle(0xe2e8f0); g.fillRect(CX - 1, H - 50, 2, 22);

        // ── IEEE Lanyard – bright green cord ──
        g.fillStyle(0x16a34a); g.fillRect(CX - 1, H - 50, 2, 16);
        // Lanyard badge – gold
        g.fillStyle(0xfbbf24); g.fillRect(CX - 6, H - 37, 12, 8);
        // Badge interior – blue
        g.fillStyle(0x1d4ed8); g.fillRect(CX - 5, H - 36, 10, 6);
        // Badge text (white lines)
        g.fillStyle(0xffffff);
        g.fillRect(CX - 3, H - 35, 6, 1);
        g.fillRect(CX - 2, H - 33, 4, 1);

        // ── Backpack ──
        if (dir === 'down') {
            // Blue backpack visible to right
            g.fillStyle(0x2563eb); g.fillRect(CX + 12, H - 50, 13, 22);
            g.fillStyle(0x1d4ed8); g.fillRect(CX + 13, H - 46, 11, 13);
            g.fillStyle(0x3b82f6); g.fillRect(CX + 14, H - 45, 4, 11);
            g.fillStyle(0xfbbf24); g.fillCircle(CX + 21, H - 30, 2);
            g.fillStyle(0x93c5fd); g.fillRect(CX + 12, H - 50, 2, 20);
        } else if (dir === 'up') {
            g.fillStyle(0x2563eb); g.fillRect(CX - 25, H - 50, 13, 22);
            g.fillStyle(0x3b82f6); g.fillRect(CX - 24, H - 46, 4, 11);
            g.fillStyle(0x93c5fd); g.fillRect(CX - 25, H - 50, 2, 20);
        } else {
            const bx = dir === 'right' ? CX - 10 : CX - 5;
            g.fillStyle(0x2563eb); g.fillRect(bx, H - 50, 10, 18);
            g.fillStyle(0x3b82f6); g.fillRect(bx + 1, H - 47, 4, 11);
        }

        // ── Neck ──
        g.fillStyle(0xb87333); g.fillRect(CX - 5, H - 54, 10, 7);
        g.fillStyle(0xa06020); g.fillRect(CX + 3, H - 54, 2, 7); // neck shadow

        // ── Head – large clean skin ellipse ──
        g.fillStyle(0xc68642); g.fillEllipse(CX, H - 64, 30, 30);
        // Head shading (solid darker tone, small area)
        g.fillStyle(0xa85c28);
        if (dir === 'right') g.fillEllipse(CX - 7, H - 64, 12, 26);
        else if (dir === 'left') g.fillEllipse(CX + 7, H - 64, 12, 26);
        else g.fillEllipse(CX + 10, H - 64, 10, 22);

        // ── Ears (side views only) ──
        if (dir === 'left' || dir === 'right') {
            const ex = dir === 'left' ? CX - 15 : CX + 15;
            g.fillStyle(0xb87333); g.fillEllipse(ex, H - 64, 7, 10);
            g.fillStyle(0xa06020); g.fillEllipse(ex, H - 64, 4, 6);
        }

        // ── Hair – dark, styled ──
        g.fillStyle(0x1c0a00);
        if (dir === 'down') {
            g.fillEllipse(CX, H - 76, 30, 16);
            g.fillRect(CX - 15, H - 74, 30, 10);
            // Side hair coverage
            g.fillRect(CX - 15, H - 70, 5, 12);
            g.fillRect(CX + 10, H - 70, 5, 12);
            // Hair sheen
            g.fillStyle(0x2d1000); g.fillRect(CX - 8, H - 78, 10, 5);
        } else if (dir === 'up') {
            g.fillEllipse(CX, H - 77, 30, 18);
            g.fillStyle(0x2d1000); g.fillEllipse(CX + 5, H - 80, 12, 7);
        } else {
            const ho = dir === 'right' ? 3 : -3;
            g.fillEllipse(CX + ho, H - 75, 28, 16);
            // Quiff
            g.fillRect(dir === 'right' ? CX + 8 : CX - 16, H - 82, 10, 8);
            g.fillStyle(0x2d1000); g.fillEllipse(CX + ho + 3, H - 78, 12, 7);
        }

        // ── Facial features (all solid, no alpha) ──
        if (dir === 'down') {
            // Eyebrows – thick dark
            g.fillStyle(0x1c0a00);
            g.fillRect(CX - 11, H - 70, 9, 2);
            g.fillRect(CX + 2, H - 70, 9, 2);
            // Eye whites
            g.fillStyle(0xfff8e7);
            g.fillEllipse(CX - 7, H - 65, 9, 7);
            g.fillEllipse(CX + 7, H - 65, 9, 7);
            // Irises – dark brown
            g.fillStyle(0x3b1f0a);
            g.fillCircle(CX - 7, H - 65, 3.5);
            g.fillCircle(CX + 7, H - 65, 3.5);
            // Eye shine (solid white dot)
            g.fillStyle(0xffffff);
            g.fillCircle(CX - 5, H - 67, 1.5);
            g.fillCircle(CX + 9, H - 67, 1.5);
            // Nose
            g.fillStyle(0xa06020);
            g.fillRect(CX - 1, H - 61, 3, 5);
            g.fillEllipse(CX, H - 57, 6, 4);
            // Mouth / lips
            g.fillStyle(0xc0704a);
            g.fillRect(CX - 5, H - 55, 10, 3);
            g.fillStyle(0x9a4a2a);
            g.fillRect(CX - 5, H - 53, 10, 2);
        } else if (dir === 'left') {
            g.fillStyle(0x1c0a00); g.fillRect(CX - 12, H - 70, 8, 2);
            g.fillStyle(0xfff8e7); g.fillEllipse(CX - 7, H - 65, 8, 6);
            g.fillStyle(0x3b1f0a); g.fillCircle(CX - 8, H - 65, 3);
            g.fillStyle(0xffffff); g.fillCircle(CX - 7, H - 67, 1.2);
            g.fillStyle(0xa06020); g.fillRect(CX - 4, H - 61, 3, 4);
            g.fillStyle(0xc0704a); g.fillRect(CX - 7, H - 55, 8, 3);
        } else if (dir === 'right') {
            g.fillStyle(0x1c0a00); g.fillRect(CX + 4, H - 70, 8, 2);
            g.fillStyle(0xfff8e7); g.fillEllipse(CX + 7, H - 65, 8, 6);
            g.fillStyle(0x3b1f0a); g.fillCircle(CX + 8, H - 65, 3);
            g.fillStyle(0xffffff); g.fillCircle(CX + 9, H - 67, 1.2);
            g.fillStyle(0xa06020); g.fillRect(CX + 1, H - 61, 3, 4);
            g.fillStyle(0xc0704a); g.fillRect(CX - 1, H - 55, 8, 3);
        }

        g.generateTexture(key, W, H);
        g.destroy();
    }

    // ── NISBOT Robot Texture ────────────────────────────────────────────────
    createNISBOTTextures() {
        // ── nisbot_idle ──
        if (!this.textures.exists('nisbot_idle')) {
            const g = this.make.graphics({ add: false });
            const W = 52, H = 76;
            const CX = W / 2;

            // Shadow
            g.fillStyle(0x001122); g.fillEllipse(CX, H - 1, 36, 9);

            // FEET – dark metallic blocks
            g.fillStyle(0x374151); g.fillRect(CX - 14, H - 12, 13, 12);
            g.fillStyle(0x374151); g.fillRect(CX + 1, H - 12, 13, 12);
            g.fillStyle(0x4b5563); g.fillRect(CX - 14, H - 12, 13, 3);
            g.fillStyle(0x4b5563); g.fillRect(CX + 1, H - 12, 13, 3);

            // LEGS – gunmetal grey cylinders
            g.fillStyle(0x4b5563); g.fillRect(CX - 11, H - 32, 9, 22);
            g.fillStyle(0x4b5563); g.fillRect(CX + 3, H - 32, 9, 22);
            // Leg joint bolts
            g.fillStyle(0x9ca3af); g.fillCircle(CX - 6, H - 28, 2.5);
            g.fillStyle(0x9ca3af); g.fillCircle(CX + 8, H - 28, 2.5);

            // BODY – main chassis
            g.fillStyle(0x1e40af); g.fillRect(CX - 18, H - 56, 36, 26);
            // Body top edge highlight
            g.fillStyle(0x3b82f6); g.fillRect(CX - 18, H - 56, 36, 4);
            // Body side shading
            g.fillStyle(0x1e3a8a); g.fillRect(CX + 14, H - 56, 4, 26);
            g.fillStyle(0x1e3a8a); g.fillRect(CX - 18, H - 56, 4, 26);

            // Circuit panel on chest
            g.fillStyle(0x1d4ed8); g.fillRect(CX - 12, H - 50, 24, 14);
            // Circuit lines (cyan)
            g.fillStyle(0x06b6d4);
            g.fillRect(CX - 10, H - 48, 8, 1);
            g.fillRect(CX - 10, H - 45, 6, 1);
            g.fillRect(CX - 10, H - 42, 10, 1);
            g.fillRect(CX + 2, H - 48, 8, 1);
            g.fillRect(CX + 4, H - 45, 6, 1);
            // Chest LED indicator (green when idle)
            g.fillStyle(0x22c55e); g.fillCircle(CX, H - 42, 3);
            g.fillStyle(0x86efac); g.fillCircle(CX, H - 42, 1.5);

            // SHOULDERS – rounded caps
            g.fillStyle(0x374151); g.fillRect(CX - 22, H - 56, 6, 10);
            g.fillStyle(0x374151); g.fillRect(CX + 16, H - 56, 6, 10);

            // ARMS – folded (idle)
            g.fillStyle(0x4b5563); g.fillRect(CX - 22, H - 47, 6, 18);
            g.fillStyle(0x4b5563); g.fillRect(CX + 16, H - 47, 6, 18);
            // Elbow joint
            g.fillStyle(0x6b7280); g.fillCircle(CX - 19, H - 38, 4);
            g.fillStyle(0x6b7280); g.fillCircle(CX + 19, H - 38, 4);
            // Forearms
            g.fillStyle(0x374151); g.fillRect(CX - 20, H - 34, 5, 12);
            g.fillStyle(0x374151); g.fillRect(CX + 15, H - 34, 5, 12);

            // CLAW HANDS – 3 prong
            g.fillStyle(0x6b7280);
            // left claw
            g.fillRect(CX - 23, H - 23, 3, 8);
            g.fillRect(CX - 19, H - 22, 3, 7);
            g.fillRect(CX - 15, H - 23, 3, 8);
            // right claw
            g.fillRect(CX + 12, H - 23, 3, 8);
            g.fillRect(CX + 16, H - 22, 3, 7);
            g.fillRect(CX + 20, H - 23, 3, 8);

            // NECK cylinder
            g.fillStyle(0x374151); g.fillRect(CX - 5, H - 60, 10, 6);
            g.fillStyle(0x4b5563); g.fillRect(CX - 5, H - 60, 10, 2);

            // HEAD – wide rectangular with beveled edges
            g.fillStyle(0x1e40af); g.fillRect(CX - 18, H - 76, 36, 18);
            // Head top highlight
            g.fillStyle(0x3b82f6); g.fillRect(CX - 18, H - 76, 36, 3);
            // Head sides shading
            g.fillStyle(0x1e3a8a); g.fillRect(CX + 14, H - 76, 4, 18);
            g.fillStyle(0x1e3a8a); g.fillRect(CX - 18, H - 76, 4, 18);

            // VISOR – wide glowing cyan screen
            g.fillStyle(0x0f172a); g.fillRect(CX - 14, H - 73, 28, 12);
            g.fillStyle(0x06b6d4); g.fillRect(CX - 13, H - 72, 26, 10);
            // Visor glow center
            g.fillStyle(0x67e8f9); g.fillRect(CX - 10, H - 70, 6, 6);
            g.fillStyle(0x67e8f9); g.fillRect(CX + 4, H - 70, 6, 6);
            // Visor scan line
            g.fillStyle(0x0e7490); g.fillRect(CX - 13, H - 67, 26, 1);

            // ANTENNA
            g.fillStyle(0x6b7280); g.fillRect(CX - 1, H - 82, 3, 8);
            g.fillStyle(0xfbbf24); g.fillCircle(CX, H - 83, 4);
            g.fillStyle(0xfef3c7); g.fillCircle(CX, H - 83, 2);

            // NISBOT label
            // (rendered as part of the sprite: N I S B O T)

            g.generateTexture('nisbot_idle', W, H);
            g.destroy();
        }

        // ── nisbot_wave – right arm raised for handshake ──
        if (!this.textures.exists('nisbot_wave')) {
            const g = this.make.graphics({ add: false });
            const W = 52, H = 76;
            const CX = W / 2;

            // Shadow (same)
            g.fillStyle(0x001122); g.fillEllipse(CX, H - 1, 36, 9);
            // Feet
            g.fillStyle(0x374151); g.fillRect(CX - 14, H - 12, 13, 12);
            g.fillStyle(0x374151); g.fillRect(CX + 1, H - 12, 13, 12);
            g.fillStyle(0x4b5563); g.fillRect(CX - 14, H - 12, 13, 3);
            g.fillStyle(0x4b5563); g.fillRect(CX + 1, H - 12, 13, 3);
            // Legs
            g.fillStyle(0x4b5563); g.fillRect(CX - 11, H - 32, 9, 22);
            g.fillStyle(0x4b5563); g.fillRect(CX + 3, H - 32, 9, 22);
            g.fillStyle(0x9ca3af); g.fillCircle(CX - 6, H - 28, 2.5);
            g.fillStyle(0x9ca3af); g.fillCircle(CX + 8, H - 28, 2.5);
            // Body
            g.fillStyle(0x1e40af); g.fillRect(CX - 18, H - 56, 36, 26);
            g.fillStyle(0x3b82f6); g.fillRect(CX - 18, H - 56, 36, 4);
            g.fillStyle(0x1e3a8a); g.fillRect(CX + 14, H - 56, 4, 26);
            g.fillStyle(0x1e3a8a); g.fillRect(CX - 18, H - 56, 4, 26);
            // Chest circuit (same)
            g.fillStyle(0x1d4ed8); g.fillRect(CX - 12, H - 50, 24, 14);
            g.fillStyle(0x06b6d4);
            g.fillRect(CX - 10, H - 48, 8, 1); g.fillRect(CX - 10, H - 45, 6, 1); g.fillRect(CX - 10, H - 42, 10, 1);
            g.fillRect(CX + 2, H - 48, 8, 1); g.fillRect(CX + 4, H - 45, 6, 1);
            // Chest LED – GOLD when handshaking!
            g.fillStyle(0xfbbf24); g.fillCircle(CX, H - 42, 3);
            g.fillStyle(0xfef08a); g.fillCircle(CX, H - 42, 1.5);
            // Shoulders
            g.fillStyle(0x374151); g.fillRect(CX - 22, H - 56, 6, 10);
            g.fillStyle(0x374151); g.fillRect(CX + 16, H - 56, 6, 10);
            // LEFT ARM – folded (same)
            g.fillStyle(0x4b5563); g.fillRect(CX - 22, H - 47, 6, 18);
            g.fillStyle(0x6b7280); g.fillCircle(CX - 19, H - 38, 4);
            g.fillStyle(0x374151); g.fillRect(CX - 20, H - 34, 5, 12);
            g.fillStyle(0x6b7280);
            g.fillRect(CX - 23, H - 23, 3, 8); g.fillRect(CX - 19, H - 22, 3, 7); g.fillRect(CX - 15, H - 23, 3, 8);
            // RIGHT ARM – RAISED (wave / handshake)
            g.fillStyle(0x4b5563); g.fillRect(CX + 16, H - 56, 6, 10);
            // upper arm going up-right
            g.fillStyle(0x374151); g.fillRect(CX + 18, H - 68, 8, 14);
            g.fillStyle(0x6b7280); g.fillCircle(CX + 22, H - 56, 4);
            // forearm extended
            g.fillStyle(0x4b5563); g.fillRect(CX + 22, H - 80, 6, 14);
            // CLAW open forward
            g.fillStyle(0x6b7280);
            g.fillRect(CX + 20, H - 84, 3, 6);
            g.fillRect(CX + 24, H - 84, 3, 6);
            g.fillRect(CX + 28, H - 82, 3, 5);
            // NECK
            g.fillStyle(0x374151); g.fillRect(CX - 5, H - 60, 10, 6);
            g.fillStyle(0x4b5563); g.fillRect(CX - 5, H - 60, 10, 2);
            // HEAD
            g.fillStyle(0x1e40af); g.fillRect(CX - 18, H - 76, 36, 18);
            g.fillStyle(0x3b82f6); g.fillRect(CX - 18, H - 76, 36, 3);
            g.fillStyle(0x1e3a8a); g.fillRect(CX + 14, H - 76, 4, 18);
            g.fillStyle(0x1e3a8a); g.fillRect(CX - 18, H - 76, 4, 18);
            // VISOR – bright happy yellow/green during handshake
            g.fillStyle(0x0f172a); g.fillRect(CX - 14, H - 73, 28, 12);
            g.fillStyle(0x16a34a); g.fillRect(CX - 13, H - 72, 26, 10);
            g.fillStyle(0x86efac); g.fillRect(CX - 8, H - 70, 7, 6);
            g.fillStyle(0x86efac); g.fillRect(CX + 1, H - 70, 7, 6);
            g.fillStyle(0x14532d); g.fillRect(CX - 13, H - 67, 26, 1);
            // ANTENNA (blink – same)
            g.fillStyle(0x6b7280); g.fillRect(CX - 1, H - 82, 3, 8);
            g.fillStyle(0xfbbf24); g.fillCircle(CX, H - 83, 4);
            g.fillStyle(0xfef3c7); g.fillCircle(CX, H - 83, 2);

            g.generateTexture('nisbot_wave', W, H);
            g.destroy();
        }
    }

    // ── NISBOT NPC placement ──────────────────────────────────────────────
    createNISBOT() {
        const hq = BUILDINGS[4];
        const nx = hq.x + hq.w + 70;
        const ny = hq.y + hq.h / 2;

        this.nisbot = this.add.image(nx, ny, 'nisbot_idle').setDepth(11).setScale(1.05);

        // Floating NISBOT name label
        this.nisbotLabel = this.add.text(nx, ny - 56, 'NISBOT 🤖', {
            fontSize: '13px', fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#06b6d4', stroke: '#0c1a2e', strokeThickness: 4,
        }).setOrigin(0.5).setDepth(12);

        // Idle glow antenna pulse
        this.tweens.add({
            targets: this.nisbot, scaleX: 1.08, scaleY: 1.02,
            yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut',
        });
    }

    // ── Handshake celebration triggered when XP hits 900 ────────────────────
    triggerNISBOTHandshake() {
        if (!this.nisbot || this.nisbotHandshakeDone) return;
        this.nisbotHandshakeDone = true;

        // Stop the idle tween
        this.tweens.killTweensOf(this.nisbot);

        // Calculate target near player
        let targetX = this.player.x + 45;
        let targetY = this.player.y;
        if (targetX > WORLD_W - 50) targetX = this.player.x - 45;

        const dx = targetX - this.nisbot.x;
        const dy = targetY - this.nisbot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const walkDuration = Math.max(500, dist * 6); // Move speed

        // 1: Walk to player
        this.tweens.add({
            targets: this.nisbot,
            x: targetX,
            y: targetY,
            duration: walkDuration,
            ease: 'Power1',
            onUpdate: () => {
                // Keep label above NISBOT while moving
                this.nisbotLabel.setPosition(this.nisbot.x, this.nisbot.y - 56);
            },
            onComplete: () => {
                // 2: NISBOT bounces in excitement
                this.tweens.chain({
                    targets: this.nisbot,
                    tweens: [
                        { y: targetY - 18, duration: 200, ease: 'Quad.easeOut' },
                        { y: targetY, duration: 200, ease: 'Bounce.easeOut' },
                        { y: targetY - 12, duration: 150, ease: 'Quad.easeOut' },
                        { y: targetY, duration: 150, ease: 'Bounce.easeOut' },
                    ],
                    onComplete: () => {
                        // 3: Switch to wave texture
                        this.nisbot.setTexture('nisbot_wave');

                        // 4: Arm wave pulse
                        this.tweens.add({
                            targets: this.nisbot, scaleX: 1.12, scaleY: 1.12,
                            yoyo: true, repeat: 3, duration: 200, ease: 'Sine.easeInOut',
                            onComplete: () => {
                                this.nisbot.setScale(1.05);
                                // Gentle idle sway
                                this.tweens.add({
                                    targets: this.nisbot,
                                    y: targetY - 4, yoyo: true, repeat: -1, duration: 1200, ease: 'Sine.easeInOut',
                                    onUpdate: () => {
                                        this.nisbotLabel.setPosition(this.nisbot.x, this.nisbot.y - 56);
                                    }
                                });
                            }
                        });

                        // 5: Celebration particle burst
                        const burst = this.add.particles(targetX, targetY - 30, 'spark', {
                            speed: { min: 60, max: 180 },
                            angle: { min: 230, max: 310 },
                            scale: { start: 0.6, end: 0 },
                            alpha: { start: 1, end: 0 },
                            tint: [0xfbbf24, 0x06b6d4, 0x22c55e, 0xf472b6],
                            lifespan: 900, quantity: 20, explode: true,
                        }).setDepth(30);
                        this.time.delayedCall(1000, () => burst.destroy());

                        // 6: Second burst from opposite side
                        const burst2 = this.add.particles(targetX, targetY - 30, 'spark', {
                            speed: { min: 50, max: 140 },
                            angle: { min: 260, max: 280 },
                            scale: { start: 0.5, end: 0 },
                            tint: [0xfbbf24, 0xc084fc, 0x38bdf8],
                            lifespan: 1200, quantity: 15, explode: true,
                        }).setDepth(30);
                        this.time.delayedCall(1200, () => burst2.destroy());

                        // 7: Floating congratulatory text
                        const congrats = this.add.text(targetX, targetY - 90, '🤝 Welcome, Professional!', {
                            fontSize: '18px', fontFamily: 'Arial',
                            fontStyle: 'bold', color: '#fbbf24',
                            stroke: '#0c1a2e', strokeThickness: 5,
                            shadow: { blur: 8, color: '#000', fill: true },
                        }).setOrigin(0.5).setDepth(50).setAlpha(0);

                        this.tweens.chain({
                            targets: congrats,
                            tweens: [
                                { alpha: 1, y: targetY - 110, duration: 500, ease: 'Back.easeOut' },
                                { alpha: 1, duration: 1800 },
                                {
                                    alpha: 0, y: targetY - 150, duration: 700, ease: 'Quad.easeIn',
                                    onComplete: () => congrats.destroy()
                                },
                            ]
                        });

                        // 8: Update NISBOT label
                        this.nisbotLabel.setText('NISBOT 🤝 Fellow IEEE!');
                        this.nisbotLabel.setColor('#fbbf24');
                    }
                });
            }
        });
    }

    // ── Walking NPC frame (simple, distinct from player) ──────────────────
    createNPCFrame(keyPrefix, shirtColor, skinColor, hairColor, dir, frame) {
        const key = `${keyPrefix}_${dir}_${frame}`;
        if (this.textures.exists(key)) return;
        const g = this.make.graphics({ add: false });
        const W = 28, H = 48;
        const CX = W / 2;
        const swing = frame % 2 === 0;
        const lL = swing ? -4 : 3, lR = swing ? 3 : -4;
        const both = dir === 'down' || dir === 'up';

        // Shadow
        g.fillStyle(0x000000, 0.14); g.fillEllipse(CX, H - 1, 22, 6);
        // Legs
        g.fillStyle(0x1e3a5f);
        if (both) { g.fillRect(CX - 8, H - 22 + lL, 7, 18); g.fillRect(CX + 1, H - 22 + lR, 7, 18); }
        else { g.fillRect(CX - 4, H - 22, 8, 18); }
        // Shoes
        g.fillStyle(0x111827);
        if (both) { g.fillRect(CX - 9, H - 4 + lL, 10, 4); g.fillRect(CX, H - 4 + lR, 10, 4); }
        else { g.fillRect(dir === 'right' ? CX - 2 : CX - 6, H - 4, 12, 4); }
        // Body
        g.fillStyle(shirtColor); g.fillRect(CX - 10, H - 38, 20, 18);
        g.fillStyle(Phaser.Display.Color.GetColor32(255, 255, 255, Math.round(0.12 * 255)) & 0xffffff, 0.12);
        g.fillRect(CX - 10, H - 38, 3, 18);
        // Neck
        g.fillStyle(skinColor); g.fillRect(CX - 3, H - 42, 7, 6);
        // Head
        g.fillStyle(skinColor); g.fillEllipse(CX, H - 48, 20, 20);
        // Ear
        if (dir === 'left' || dir === 'right') {
            g.fillEllipse(dir === 'left' ? CX - 10 : CX + 10, H - 48, 5, 7);
        }
        // Hair
        g.fillStyle(hairColor);
        if (dir === 'down') { g.fillEllipse(CX, H - 54, 20, 10); g.fillRect(CX - 10, H - 55, 20, 6); }
        else if (dir === 'up') { g.fillEllipse(CX, H - 54, 20, 12); }
        else { g.fillEllipse(CX + (dir === 'right' ? 1 : -1), H - 54, 18, 10); }
        // Face (front only)
        if (dir === 'down') {
            g.fillStyle(0xfff8f0); g.fillEllipse(CX - 4, H - 47, 6, 5); g.fillEllipse(CX + 4, H - 47, 6, 5);
            g.fillStyle(0x3b1f0a); g.fillCircle(CX - 4, H - 47, 2); g.fillCircle(CX + 4, H - 47, 2);
            g.fillStyle(0xffffff); g.fillCircle(CX - 3, H - 48, 0.8); g.fillCircle(CX + 5, H - 48, 0.8);
            g.fillStyle(hairColor); g.fillRect(CX - 6, H - 52, 5, 1.5); g.fillRect(CX + 1, H - 52, 5, 1.5);
            g.fillStyle(0xc07040); g.fillRect(CX - 3, H - 43, 6, 2);
        } else if (dir === 'left') {
            g.fillStyle(0xfff8f0); g.fillEllipse(CX - 4, H - 47, 5, 4);
            g.fillStyle(0x3b1f0a); g.fillCircle(CX - 5, H - 47, 1.5);
            g.fillStyle(0xffffff); g.fillCircle(CX - 4, H - 48, 0.7);
        } else if (dir === 'right') {
            g.fillStyle(0xfff8f0); g.fillEllipse(CX + 4, H - 47, 5, 4);
            g.fillStyle(0x3b1f0a); g.fillCircle(CX + 5, H - 47, 1.5);
            g.fillStyle(0xffffff); g.fillCircle(CX + 6, H - 48, 0.7);
        }
        g.generateTexture(key, W, H);
        g.destroy();
    }

    // ── IEEE banner texture ─────────────────────────────────────────────────
    createBannerTexture() {
        if (this.textures.exists('banner')) return;
        const BW = 140, BH = 72;
        const g = this.make.graphics({ add: false });

        // Pole
        g.fillStyle(0x9ca3af); g.fillRect(2, 0, 5, BH);
        g.fillStyle(0x6b7280); g.fillRect(4, 0, 2, BH);
        g.fillStyle(0xfbbf24); g.fillCircle(4, 2, 5);

        // Flag body
        g.fillStyle(0x1d4ed8); g.fillRect(7, 5, BW - 10, 44);
        // Highlights
        g.fillStyle(0x3b82f6); g.fillRect(7, 5, BW - 10, 8);
        g.fillStyle(0x1e3a8a); g.fillRect(7, 41, BW - 10, 8);
        g.fillStyle(0x1a40a0); g.fillRect(BW - 6, 5, 3, 44);

        // Gold label band
        g.fillStyle(0xfbbf24); g.fillRect(10, 14, BW - 16, 22);
        g.fillStyle(0x92400e); g.fillRect(10, 33, BW - 16, 3);

        // Draw I-E-E-E (4 letters)
        const LY = 16, LH = 13, LS = 3;
        g.fillStyle(0x1e3a8a);

        // I
        let lx = 18;
        g.fillRect(lx + 1, LY, 5, LS);
        g.fillRect(lx + 3, LY + LS, 1, LH - LS * 2);
        g.fillRect(lx + 1, LY + LH - LS, 5, LS);

        // E (1st)
        lx += 14;
        g.fillRect(lx, LY, 7, LS);
        g.fillRect(lx, LY + LS, 1, LH - LS * 2);
        g.fillRect(lx, LY + 5, 5, 2);
        g.fillRect(lx, LY + LH - LS, 7, LS);

        // E (2nd)
        lx += 14;
        g.fillRect(lx, LY, 7, LS);
        g.fillRect(lx, LY + LS, 1, LH - LS * 2);
        g.fillRect(lx, LY + 5, 5, 2);
        g.fillRect(lx, LY + LH - LS, 7, LS);

        // E (3rd)
        lx += 14;
        g.fillRect(lx, LY, 7, LS);
        g.fillRect(lx, LY + LS, 1, LH - LS * 2);
        g.fillRect(lx, LY + 5, 5, 2);
        g.fillRect(lx, LY + LH - LS, 7, LS);

        // Decoration dots
        g.fillStyle(0xffffff);
        [70, 82, 94, 106].forEach(dx => g.fillCircle(dx, LY + LH + 7, 2));

        g.generateTexture('banner', BW, BH);
        g.destroy();
    }

    createAllTextures() {
        ['down', 'up', 'left', 'right'].forEach(dir => {
            for (let f = 0; f < 4; f++) this.createPlayerFrame(`p_${dir}_${f}`, dir, f);
        });

        // Tree
        if (!this.textures.exists('tree')) {
            const g = this.make.graphics({ add: false });
            // Trunk
            g.fillStyle(0x6b3a1f); g.fillRect(20, 46, 14, 20);
            // Shadow layer
            g.fillStyle(0x14532d, 0.6); g.fillCircle(30, 34, 30);
            // Main canopy
            g.fillStyle(0x15803d); g.fillCircle(26, 28, 26);
            // Lighter top
            g.fillStyle(0x22c55e); g.fillCircle(20, 20, 17);
            // Highlight
            g.fillStyle(0x86efac, 0.3); g.fillCircle(16, 14, 8);
            g.generateTexture('tree', 58, 66); g.destroy();
        }

        // Bench
        if (!this.textures.exists('bench')) {
            const g = this.make.graphics({ add: false });
            g.fillStyle(0x92400e); g.fillRect(0, 6, 50, 8);
            g.fillStyle(0x78350f);
            g.fillRect(4, 14, 6, 10); g.fillRect(40, 14, 6, 10);
            g.generateTexture('bench', 50, 24); g.destroy();
        }

        // Lamppost
        if (!this.textures.exists('lamp')) {
            const g = this.make.graphics({ add: false });
            g.fillStyle(0x374151); g.fillRect(6, 18, 4, 44);
            g.fillStyle(0xfbbf24); g.fillCircle(8, 14, 10);
            g.fillStyle(0xfef9c3, 0.5); g.fillCircle(8, 14, 6);
            g.generateTexture('lamp', 16, 62); g.destroy();
        }

        // Flower
        if (!this.textures.exists('flower')) {
            const g = this.make.graphics({ add: false });
            g.fillStyle(0x15803d); g.fillRect(4, 10, 24, 10);
            const fc = [0xff6b6b, 0xffd93d, 0xff9ff3, 0x74b9ff];
            [4, 10, 16, 22].forEach((fx, i) => {
                g.fillStyle(fc[i]); g.fillCircle(fx + 4, 8, 5);
            });
            g.generateTexture('flower', 32, 20); g.destroy();
        }

        // Particle: dust
        if (!this.textures.exists('dust')) {
            const g = this.make.graphics({ add: false });
            g.fillStyle(0xd1d5db); g.fillCircle(4, 4, 4);
            g.generateTexture('dust', 8, 8); g.destroy();
        }

        // Particle: sparkle/xp
        if (!this.textures.exists('spark')) {
            const g = this.make.graphics({ add: false });
            g.fillStyle(0xfbbf24); g.fillCircle(4, 4, 4);
            g.generateTexture('spark', 8, 8); g.destroy();
        }

        // Particle: leaf
        if (!this.textures.exists('leaf')) {
            const g = this.make.graphics({ add: false });
            g.fillStyle(0x4ade80); g.fillEllipse(6, 4, 12, 8);
            g.generateTexture('leaf', 12, 8); g.destroy();
        }

        // Walking NPC frames (4 directions × 4 frames × 3 NPCs)
        const npcDefs = [
            { key: 'npc_Aashish', shirt: 0xe11d48, skin: 0xc68642, hair: 0x1c0a00 },
            { key: 'npc_Sagar', shirt: 0x7c3aed, skin: 0xd4a070, hair: 0x1c0a00 },
            { key: 'npc_Yogesh', shirt: 0x059669, skin: 0xc07840, hair: 0x1c0a00 },
            { key: 'npc_banner1', shirt: 0x1d4ed8, skin: 0xc68642, hair: 0x2d1b00 },
            { key: 'npc_banner2', shirt: 0x1d4ed8, skin: 0xd4a070, hair: 0x1c0a00 },
        ];
        npcDefs.forEach(nd => {
            ['down', 'up', 'left', 'right'].forEach(dir => {
                for (let f = 0; f < 4; f++) this.createNPCFrame(nd.key, nd.shirt, nd.skin, nd.hair, dir, f);
            });
        });
        // Banner texture
        this.createBannerTexture();
        // NISBOT robot textures
        this.createNISBOTTextures();
    }

    // ── Preload ────────────────────────────────────────────────────────────
    preload() {
        this.load.image('golden_jubilee', '/assets/golden_jubilee.png');
        this.load.image('diamond_jubilee', '/assets/diamond_jubilee.png');
        this.load.image('virgin_tree', '/assets/virgin_tree.png');
        this.load.image('red_canteen', '/assets/red_canteen.png');
        this.load.image('chai_shop', '/assets/chai_shop.png');
        this.load.image('gate', '/assets/gate.png');
        this.load.image('bike_sprite', '/assets/bike_realistic.svg');
        this.load.image('scooty_sprite', '/assets/scooty_realistic.svg');
        this.load.image('bus_sprite', '/assets/bus.png');
        this.load.audio('bgm_track', '/assets/bgm_track.mpeg');
    }

    // ── Create ────────────────────────────────────────────────────────────
    create() {
        // 1. Create all textures first (renderer must be live)
        this.createAllTextures();

        // 2. World bounds
        this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
        this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);

        // 3. Ground layer
        this.drawGround();

        // 4. Environment objects
        this.drawEnvironment();

        // 5. Buildings
        this.drawBuildings();

        // 6. Physics
        this.staticGroup = this.physics.add.staticGroup();
        this.interactZones = [];

        BUILDINGS.forEach(b => {
            if (b.isImage && b.texture) {
                const img = this.add.image(b.x + b.w / 2, b.y + b.h / 2, b.texture).setDepth(4);
                img.setDisplaySize(b.w, b.h);
                this.physics.add.existing(img, true);
                this.staticGroup.add(img);
            } else {
                const rect = this.add.rectangle(b.x + b.w / 2, b.y + b.h / 2, b.w, b.h);
                this.physics.add.existing(rect, true);
                this.staticGroup.add(rect);
            }

            const zone = this.add.zone(b.x + b.w / 2, b.y + b.h / 2, b.w + 90, b.h + 90);
            this.physics.add.existing(zone, true);
            zone.buildingData = b;
            this.interactZones.push(zone);

            // Floating label
            this.add.text(b.x + b.w / 2, b.y - 10, `${b.iconEmoji} ${b.label}`, {
                fontSize: '16px', fontFamily: 'Arial',
                fontStyle: 'bold', color: '#ffffff',
                stroke: '#000000', strokeThickness: 4,
                shadow: { blur: 6, color: '#000000', fill: true },
            }).setOrigin(0.5, 1).setDepth(6);

            // XP badge under label
            if (b.xp > 0) {
                this.add.text(b.x + b.w / 2, b.y - 30, `+${b.xp} XP`, {
                    fontSize: '12px', fontFamily: 'Arial',
                    color: '#fbbf24', stroke: '#000000', strokeThickness: 3,
                }).setOrigin(0.5, 1).setDepth(6);
            }
        });

        // 7. Ambient particles
        this.add.particles(0, 0, 'leaf', {
            x: { min: 0, max: WORLD_W }, y: { min: -20, max: 0 },
            speedX: { min: -25, max: 25 }, speedY: { min: 20, max: 55 },
            rotate: { start: 0, end: 360 },
            alpha: { start: 0.9, end: 0 }, scale: { start: 0.7, end: 0.2 },
            lifespan: { min: 5000, max: 9000 }, frequency: 500, quantity: 1,
        }).setDepth(50);

        // 8. Fountain particles
        this.add.particles(WORLD_W / 2, WORLD_H / 2 - 8, 'dust', {
            speedX: { min: -35, max: 35 }, speedY: { min: -70, max: -15 },
            scale: { start: 0.5, end: 0 }, alpha: { start: 0.7, end: 0 },
            tint: [0x38bdf8, 0x7dd3fc, 0xbae6fd],
            lifespan: 1100, frequency: 70, quantity: 2,
        }).setDepth(5);

        // 9. Player
        this.createPlayer();

        // 10. NPCs
        this.createNPCs();

        // 10b. NISBOT Robot
        this.createNISBOT();

        // 11. Camera
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.cameras.main.setZoom(1.15);

        // 12. HQ overlay
        this.hqLockOverlay = this.add.graphics().setDepth(5);
        this.refreshHQOverlay();

        // 13. Prompt text (fixed to camera)
        this.promptText = this.add.text(CAM_W / 2, CAM_H - 60, '', {
            fontSize: '16px', fontFamily: 'Arial',
            color: '#ffffff', backgroundColor: '#000000bb',
            padding: { x: 16, y: 8 }, stroke: '#3b82f6', strokeThickness: 2,
        }).setOrigin(0.5).setScrollFactor(0).setDepth(200).setAlpha(0);

        // 14. Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // 15. EventBus
        EventBus.on('xp-update', ({ xp, level }) => {
            this.playerXP = xp;
            this.playerLevel = level;
            // Trigger NISBOT handshake when 900 XP is reached
            if (xp >= HQ_XP_REQUIRED && !this.nisbotHandshakeDone) {
                this.time.delayedCall(400, () => this.triggerNISBOTHandshake());
            }
        });
        EventBus.on('mobile-interact', () => { this.mobileInteract = true; });
        EventBus.on('joystick-move', ({ x, y }) => { this.joystickDir.x = x; this.joystickDir.y = y; });
        EventBus.on('toggle-music', (enabled) => {
            this.bgMusicEnabled = !!enabled;
            if (this.bgMusicEnabled) {
                if (this.bgMusic && !this.bgMusic.isPlaying) this.bgMusic.play();
                if (this.bgMusicElement) {
                    const p = this.bgMusicElement.play();
                    if (p && typeof p.catch === 'function') p.catch(() => { });
                }
            } else {
                if (this.bgMusic && this.bgMusic.isPlaying) this.bgMusic.stop();
                if (this.bgMusicElement) {
                    this.bgMusicElement.pause();
                    this.bgMusicElement.currentTime = 0;
                }
            }
        });

        // 15b. Background music
        if (this.cache.audio.exists('bgm_track')) {
            this.bgMusic = this.sound.add('bgm_track', { loop: true, volume: 0.45 });
        } else {
            this.bgMusicElement = new window.Audio('/assets/bgm_track.mpeg');
            this.bgMusicElement.loop = true;
            this.bgMusicElement.volume = 0.45;
        }
        const startBgm = () => {
            if (!this.bgMusicEnabled) return;
            if (this.bgMusic && !this.bgMusic.isPlaying) {
                this.bgMusic.play();
            }
            if (this.bgMusicElement) {
                const p = this.bgMusicElement.play();
                if (p && typeof p.catch === 'function') p.catch(() => { });
            }
        };
        // Try autoplay right after loading
        startBgm();
        this.time.delayedCall(250, startBgm);
        this.input.once('pointerdown', startBgm);
        this.input.keyboard.once('keydown', startBgm);

        // 16. Day-cycle overlay
        this.dayOverlay = this.add.graphics().setDepth(100).setScrollFactor(0);
        this.timeOfDay = 0;
        this.time.addEvent({ delay: 60, callback: this.tickDayCycle, callbackScope: this, loop: true });

        EventBus.emit('scene-ready', this);
    }

    drawGround() {
        const g = this.add.graphics().setDepth(0);

        // Grass base
        g.fillStyle(0x2d6a2d); g.fillRect(0, 0, WORLD_W, WORLD_H);

        // Grass tufts (simple, fast)
        g.fillStyle(0x276627, 0.6);
        for (let gx = 0; gx < WORLD_W; gx += 48) {
            for (let gy = 0; gy < WORLD_H; gy += 48) {
                if ((gx / 48 + gy / 48) % 3 === 0) g.fillRect(gx, gy, 14, 8);
            }
        }
        g.fillStyle(0x3a8c3a, 0.4);
        for (let gx = 14; gx < WORLD_W; gx += 60) {
            for (let gy = 20; gy < WORLD_H; gy += 60) {
                if ((gx + gy) % 5 !== 0) g.fillRect(gx, gy, 10, 6);
            }
        }

        // Horizontal path (Main Ave)
        g.fillStyle(0xb0bec5); g.fillRect(0, WORLD_H / 2 - 48, WORLD_W, 96);
        // Vertical path (Main St)
        g.fillRect(WORLD_W / 2 - 48, 0, 96, WORLD_H);

        // --- Side Paths to new buildings ---
        g.fillRect(300 + 170, WORLD_H - 1080 - 40, WORLD_W - 600 - 340, 80); // Connects Jubilees
        g.fillRect(510 - 40, WORLD_H / 2 + 48, 80, WORLD_H / 2 - 450 - (WORLD_H / 2 + 48)); // To Red Canteen
        g.fillRect(WORLD_W - 530 - 40, WORLD_H / 2 + 48, 80, WORLD_H / 2 - 450 - (WORLD_H / 2 + 48)); // To Chai Shop
        g.fillRect(WORLD_W / 2 - 40, WORLD_H - 1000 + 125, 80, (WORLD_H / 2 - 48) - (WORLD_H - 1000 + 125)); // To Virgin Tree

        // --- Decorative Tiles around Buildings ---
        const drawTiles = (cx, cy, cols, rows, size) => {
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    g.fillStyle((r + c) % 2 === 0 ? 0x9ca3af : 0x64748b);
                    g.fillRect(cx - (cols * size) / 2 + c * size, cy - (rows * size) / 2 + r * size, size, size);
                }
            }
        };
        // Sir MV Hall entrance
        drawTiles(WORLD_W / 2, WORLD_H / 2 - 250, 6, 4, 30);
        // Golden Jubilee entrance
        drawTiles(450, WORLD_H - 1050, 4, 8, 30);
        // Diamond Jubilee entrance
        drawTiles(WORLD_W - 450, WORLD_H - 1050, 4, 8, 30);

        // --- Parking Lot ---
        // Asphalt area bottom right
        g.fillStyle(0x374151); g.fillRect(WORLD_W / 2 + 100, WORLD_H - 450, 600, 300);
        // Parking stripes
        g.fillStyle(0xe2e8f0);
        for (let px = WORLD_W / 2 + 120; px < WORLD_W / 2 + 680; px += 60) {
            g.fillRect(px, WORLD_H - 440, 4, 80); // Top row
            g.fillRect(px, WORLD_H - 240, 4, 80); // Bottom row
        }
        g.fillRect(WORLD_W / 2 + 100, WORLD_H - 300, 600, 8); // Drive aisle divider

        // --- extensive road loops to fill space ---
        g.fillStyle(0xcfd8dc); // Slightly lighter path for loops
        // Top Left Loop
        g.fillRect(200, 400, 80, WORLD_H / 2 - 400);
        g.fillRect(200, 400, WORLD_W / 2 - 200, 80);
        g.fillRect(200, 800, WORLD_W / 2 - 200, 80);
        // Top Right Loop
        g.fillRect(WORLD_W - 280, 400, 80, WORLD_H / 2 - 400);
        g.fillRect(WORLD_W / 2, 400, WORLD_W / 2 - 200, 80);
        g.fillRect(WORLD_W / 2, 800, WORLD_W / 2 - 200, 80);
        // Bottom Left & Right Paths
        g.fillRect(200, WORLD_H / 2 + 48, 80, WORLD_H - (WORLD_H / 2 + 48) - 200);
        g.fillRect(200, WORLD_H - 300, WORLD_W / 2 - 200, 80);
        g.fillRect(WORLD_W - 280, WORLD_H / 2 + 48, 80, WORLD_H - (WORLD_H / 2 + 48) - 200);
        g.fillRect(WORLD_W / 2, WORLD_H - 300, WORLD_W / 2 - 200, 80);

        // STAGE (Open Air Theatre) at Top Left (x: 500, y: 560)
        g.fillStyle(0x78350f); g.fillRect(450, 550, 300, 200); // base
        g.fillStyle(0x92400e); g.fillRect(450, 540, 300, 200); // elevated floor
        g.fillStyle(0xb45309); g.fillRect(450, 530, 300, 15); // back edge
        g.fillRect(450, 730, 300, 10); // front edge
        // Stage steps
        g.fillStyle(0x78350f); g.fillRect(570, 740, 60, 20);
        g.fillStyle(0x92400e); g.fillRect(575, 745, 50, 15);
        // Stage backdrop / speakers
        g.fillStyle(0x111827);
        g.fillRect(460, 510, 40, 60); g.fillRect(700, 510, 40, 60); // speakers
        g.fillStyle(0x374151); g.fillRect(520, 500, 160, 120); // backdrop screen

        // Path lines (Main)
        g.lineStyle(2, 0x90a4ae, 0.35);
        for (let px = 0; px < WORLD_W; px += 96) g.lineBetween(px, WORLD_H / 2 - 48, px, WORLD_H / 2 + 48);
        for (let py = 0; py < WORLD_H; py += 96) g.lineBetween(WORLD_W / 2 - 48, py, WORLD_W / 2 + 48, py);

        // Center plaza
        g.fillStyle(0xcfd8dc); g.fillCircle(WORLD_W / 2, WORLD_H / 2, 130);
        g.lineStyle(5, 0xb0bec5, 0.7); g.strokeCircle(WORLD_W / 2, WORLD_H / 2, 130);

        // Fountain
        g.fillStyle(0x37474f); g.fillCircle(WORLD_W / 2, WORLD_H / 2, 44);
        g.fillStyle(0x0284c7, 0.9); g.fillCircle(WORLD_W / 2, WORLD_H / 2, 36);
        g.fillStyle(0x38bdf8, 0.7); g.fillCircle(WORLD_W / 2, WORLD_H / 2, 22);
        g.fillStyle(0xbae6fd, 0.5); g.fillCircle(WORLD_W / 2, WORLD_H / 2, 10);
    }

    drawEnvironment() {
        // Trees around the map perimeter, corners, and building edges
        const trees = [
            // Original
            [90, 90], [200, 120], [90, 400], [90, 700], [200, 900], [90, 1200], [200, 1500], [90, 1700],
            [WORLD_W - 90, 90], [WORLD_W - 200, 120], [WORLD_W - 90, 400], [WORLD_W - 90, 700], [WORLD_W - 200, 900], [WORLD_W - 90, 1200], [WORLD_W - 90, 1700],
            [500, 80], [900, 90], [1300, 80], [1700, 90],
            [500, WORLD_H - 80], [900, WORLD_H - 90], [1300, WORLD_H - 80], [1700, WORLD_H - 90],
            [650, 450], [1750, 450], [650, 1350], [1750, 1350],
            // New Perimeter Fillers
            [90, 2200], [200, 2500], [90, 2800], [400, 2900], [700, 2850], [1000, 2900],
            [WORLD_W - 90, 2200], [WORLD_W - 200, 2500], [WORLD_W - 90, 2800], [WORLD_W - 400, 2900], [WORLD_W - 700, 2850], [WORLD_W - 1000, 2900],
            [2200, 90], [2600, 120], [3000, 80], [3400, 100], [3800, 90],
            [2200, WORLD_H - 90], [2600, WORLD_H - 120], [3000, WORLD_H - 80], [3400, WORLD_H - 100], [3800, WORLD_H - 90],
            // Around Golden/Diamond Jubilee
            [200, WORLD_H - 1200], [700, WORLD_H - 1250], [850, WORLD_H - 1100],
            [WORLD_W - 200, WORLD_H - 1200], [WORLD_W - 700, WORLD_H - 1250], [WORLD_W - 850, WORLD_H - 1100],
            // Around Canteens
            [300, WORLD_H - 450], [700, WORLD_H - 350], [WORLD_W - 300, WORLD_H - 450], [WORLD_W - 700, WORLD_H - 350],
            // Near Virgin Tree grove
            [WORLD_W / 2 - 250, WORLD_H - 800], [WORLD_W / 2 + 250, WORLD_H - 800], [WORLD_W / 2 - 300, WORLD_H - 1000], [WORLD_W / 2 + 300, WORLD_H - 1000]
        ];
        trees.forEach(([tx, ty]) => this.add.image(tx, ty, 'tree').setDepth(2));

        const benches = [
            // Center Plaza
            [WORLD_W / 2 + 170, WORLD_H / 2 - 110], [WORLD_W / 2 - 170, WORLD_H / 2 + 110],
            [WORLD_W / 2 + 170, WORLD_H / 2 + 110], [WORLD_W / 2 - 170, WORLD_H / 2 - 110],
            // Near Virgin Tree
            [WORLD_W / 2 - 150, WORLD_H - 800], [WORLD_W / 2 + 150, WORLD_H - 800],
            // Near Golden/Diamond Jubilee
            [470, WORLD_H - 1020], [WORLD_W - 470, WORLD_H - 1020],
            // Near Canteens
            [470, WORLD_H - 250], [WORLD_W - 470, WORLD_H - 250],
            // --- NEW: Audience seating for the Stage ---
            [500, 800], [600, 800], [700, 800],
            [450, 850], [550, 850], [650, 850], [750, 850],
            // --- NEW: More benches along new roads ---
            [250, 500], [250, 1000], [250, 1200], [WORLD_W - 250, 500], [WORLD_W - 250, 1000], [WORLD_W - 250, 1200],
            [1000, 450], [1400, 450], [WORLD_W - 1000, 450], [WORLD_W - 1400, 450],
            [1000, 850], [1400, 850], [WORLD_W - 1000, 850], [WORLD_W - 1400, 850],
            [600, WORLD_H - 250], [1000, WORLD_H - 250], [WORLD_W - 600, WORLD_H - 250], [WORLD_W - 1000, WORLD_H - 250],
            [550, WORLD_H - 550], [WORLD_W - 550, WORLD_H - 550]
        ];
        benches.forEach(([bx, by]) => this.add.image(bx, by, 'bench').setDepth(2));

        const lamps = [
            // Center Plaza
            [WORLD_W / 2 - 190, WORLD_H / 2 - 190], [WORLD_W / 2 + 190, WORLD_H / 2 - 190],
            [WORLD_W / 2 - 190, WORLD_H / 2 + 190], [WORLD_W / 2 + 190, WORLD_H / 2 + 190],
            // Main Paths
            [450, WORLD_H / 2 - 80], [450, WORLD_H / 2 + 80], [WORLD_W - 450, WORLD_H / 2 - 80], [WORLD_W - 450, WORLD_H / 2 + 80],
            [WORLD_W / 2 - 80, 450], [WORLD_W / 2 + 80, 450], [WORLD_W / 2 - 80, WORLD_H - 450], [WORLD_W / 2 + 80, WORLD_H - 450],
            // New Buildings
            [400, WORLD_H - 1040], [WORLD_W - 400, WORLD_H - 1040], // Jubilees
            [470, WORLD_H - 350], [WORLD_W - 470, WORLD_H - 350], // Canteens
            [WORLD_W / 2 - 100, WORLD_H - 1050], [WORLD_W / 2 + 100, WORLD_H - 1050], // Virgin Tree
            // --- NEW: Near Stage ---
            [410, 560], [790, 560], [410, 710], [790, 710],
            // --- NEW: Extensive road lighting ---
            [230, 450], [230, 850], [230, 1250], [WORLD_W - 230, 450], [WORLD_W - 230, 850], [WORLD_W - 230, 1250],
            [800, 430], [1200, 430], [1600, 430], [WORLD_W - 800, 430], [WORLD_W - 1200, 430], [WORLD_W - 1600, 430],
            [800, 830], [1200, 830], [1600, 830], [WORLD_W - 800, 830], [WORLD_W - 1200, 830], [WORLD_W - 1600, 830],
            [230, WORLD_H - 850], [230, WORLD_H - 1250], [WORLD_W - 230, WORLD_H - 850], [WORLD_W - 230, WORLD_H - 1250],
            [800, WORLD_H - 270], [1200, WORLD_H - 270], [1600, WORLD_H - 270], [WORLD_W - 800, WORLD_H - 270], [WORLD_W - 1200, WORLD_H - 270], [WORLD_W - 1600, WORLD_H - 270]
        ];
        lamps.forEach(([lx, ly]) => this.add.image(lx, ly, 'lamp').setDepth(2));

        const flowers = [
            // Center Plaza
            [WORLD_W / 2 - 100, WORLD_H / 2 - 180], [WORLD_W / 2 + 68, WORLD_H / 2 - 180],
            [WORLD_W / 2 - 100, WORLD_H / 2 + 155], [WORLD_W / 2 + 68, WORLD_H / 2 + 155],
            // Jubilees
            [300, WORLD_H - 1040], [WORLD_W - 300, WORLD_H - 1040],
            [500, WORLD_H - 1040], [WORLD_W - 500, WORLD_H - 1040],
            // HQ / Sir MV Hall (top)
            [WORLD_W / 2 - 150, WORLD_H / 2 - 250], [WORLD_W / 2 + 100, WORLD_H / 2 - 250]
        ];
        flowers.forEach(([fx, fy]) => this.add.image(fx, fy, 'flower').setDepth(1));

        // Parked vehicles in parking lot (bottom-right)
        const parkedVehicles = [
            { x: WORLD_W / 2 + 170, y: WORLD_H - 400, key: 'scooty_sprite', scale: 0.2, rotation: Math.PI / 2 },
            { x: WORLD_W / 2 + 230, y: WORLD_H - 400, key: 'bike_sprite', scale: 0.2, rotation: Math.PI / 2 },
            { x: WORLD_W / 2 + 290, y: WORLD_H - 400, key: 'scooty_sprite', scale: 0.2, rotation: Math.PI / 2 },
            { x: WORLD_W / 2 + 350, y: WORLD_H - 400, key: 'bike_sprite', scale: 0.2, rotation: Math.PI / 2 },
            { x: WORLD_W / 2 + 470, y: WORLD_H - 200, key: 'scooty_sprite', scale: 0.2, rotation: -Math.PI / 2 },
            { x: WORLD_W / 2 + 530, y: WORLD_H - 200, key: 'bike_sprite', scale: 0.2, rotation: -Math.PI / 2 },
            { x: WORLD_W / 2 + 590, y: WORLD_H - 200, key: 'scooty_sprite', scale: 0.2, rotation: -Math.PI / 2 },
            { x: WORLD_W / 2 + 650, y: WORLD_H - 200, key: 'bike_sprite', scale: 0.2, rotation: -Math.PI / 2 },
            { x: WORLD_W / 2 + 390, y: WORLD_H - 300, key: 'bus_sprite', scale: 0.32, rotation: 0 },
        ];

        parkedVehicles.forEach(v => {
            this.add.image(v.x, v.y, v.key)
                .setScale(v.scale)
                .setRotation(v.rotation)
                .setDepth(2.7 + v.y * 0.0005);
        });
    }

    drawBuildings() {
        const g = this.add.graphics().setDepth(3);
        const imageKeys = ['golden_jubilee', 'diamond_jubilee', 'virgin_tree', 'red_canteen', 'chai_shop'];

        BUILDINGS.forEach(b => {
            if (imageKeys.includes(b.id) || (b.isImage && b.texture)) {
                // Draw custom sprite
                this.add.image(b.x + b.w / 2, b.y + b.h / 2, b.texture || b.id)
                    .setDisplaySize(b.w, b.h)
                    .setDepth(3);
            } else {
                // Draw default rectangle building
                drawBuilding(g, b);
            }
        });
    }

    refreshHQOverlay() {
        if (!this.hqLockOverlay) return;
        this.hqLockOverlay.clear();

        // 1. HQ Lock (requires 1200 XP)
        const hq = BUILDINGS.find(b => b.id === 'hq');
        if (hq && this.playerXP < HQ_XP_REQUIRED) {
            this.hqLockOverlay.fillStyle(0x000000, 0.55);
            this.hqLockOverlay.fillRect(hq.x, hq.y, hq.w, hq.h);
            this.hqLockOverlay.lineStyle(3, 0xff2244, 1);
            this.hqLockOverlay.strokeRect(hq.x, hq.y, hq.w, hq.h);
            // Lock icon drawn as a simple shape
            const cx = hq.x + hq.w / 2, cy = hq.y + hq.h / 2;
            this.hqLockOverlay.fillStyle(0xff2244, 0.8);
            this.hqLockOverlay.fillRect(cx - 20, cy - 5, 40, 30);
            this.hqLockOverlay.lineStyle(6, 0xff2244, 1);
            this.hqLockOverlay.beginPath();
            this.hqLockOverlay.arc(cx, cy - 10, 18, Math.PI, 2 * Math.PI);
            this.hqLockOverlay.strokePath();
            this.hqLockOverlay.fillStyle(0x111827);
            this.hqLockOverlay.fillCircle(cx, cy + 8, 5);
        }

        // 2. Industry Visit Lock (requires 300 XP)
        const ind = BUILDINGS.find(b => b.id === 'industry');
        if (ind && this.playerXP < 300) {
            this.hqLockOverlay.fillStyle(0x000000, 0.55);
            this.hqLockOverlay.fillRect(ind.x, ind.y, ind.w, ind.h);
            this.hqLockOverlay.lineStyle(3, 0xff2244, 1);
            this.hqLockOverlay.strokeRect(ind.x, ind.y, ind.w, ind.h);
            // Lock icon drawn as a simple shape
            const cx = ind.x + ind.w / 2, cy = ind.y + ind.h / 2;
            this.hqLockOverlay.fillStyle(0xff2244, 0.8);
            this.hqLockOverlay.fillRect(cx - 20, cy - 5, 40, 30);
            this.hqLockOverlay.lineStyle(6, 0xff2244, 1);
            this.hqLockOverlay.beginPath();
            this.hqLockOverlay.arc(cx, cy - 10, 18, Math.PI, 2 * Math.PI);
            this.hqLockOverlay.strokePath();
            this.hqLockOverlay.fillStyle(0x111827);
            this.hqLockOverlay.fillCircle(cx, cy + 8, 5);
        }
    }

    createPlayer() {
        const sx = WORLD_W / 2 - 40, sy = WORLD_H / 2 + 150;
        this.playerShadow = this.add.ellipse(sx, sy + 24, 28, 8, 0x000000, 0.28).setDepth(4);

        this.player = this.physics.add.sprite(sx, sy, 'p_down_0');
        this.player.setDepth(10).setCollideWorldBounds(true);
        this.player.body.setSize(22, 22).setOffset(9, 36);
        this.player.setScale(1.1); // slightly bigger for hero feel

        // Sparkle trail
        this.add.particles(0, 0, 'spark', {
            follow: this.player, followOffset: { x: 0, y: 20 },
            speedX: { min: -10, max: 10 }, speedY: { min: 5, max: 18 },
            scale: { start: 0.28, end: 0 }, alpha: { start: 0.5, end: 0 },
            tint: [0xfbbf24, 0x60a5fa, 0x34d399],
            lifespan: 320, frequency: 100, quantity: 1,
        }).setDepth(9);

        this.levelAura = this.add.graphics().setDepth(9);
        this.physics.add.collider(this.player, this.staticGroup);
    }

    createNPCs() {
        this.walkingNPCs = [];
        this.bannerNPCs = [];

        // ── Patrol-walking NPCs ─────────────────────────────────────────────
        const patrolDefs = [
            {
                key: 'npc_Aashish', name: 'Aashish',
                waypoints: [
                    { x: WORLD_W / 2 + 80, y: WORLD_H / 2 - 150 },
                    { x: WORLD_W / 2 + 200, y: WORLD_H / 2 - 150 },
                    { x: WORLD_W / 2 + 200, y: WORLD_H / 2 - 40 },
                    { x: WORLD_W / 2 + 80, y: WORLD_H / 2 - 40 },
                ],
                speed: 55, nameColor: '#fca5a5',
            },
            {
                key: 'npc_Sagar', name: 'Sagar',
                waypoints: [
                    { x: WORLD_W / 2 - 180, y: WORLD_H / 2 + 60 },
                    { x: WORLD_W / 2 - 60, y: WORLD_H / 2 + 60 },
                    { x: WORLD_W / 2 - 60, y: WORLD_H / 2 + 160 },
                    { x: WORLD_W / 2 - 180, y: WORLD_H / 2 + 160 },
                ],
                speed: 48, nameColor: '#c4b5fd',
            },
            {
                key: 'npc_Yogesh', name: 'Yogesh',
                waypoints: [
                    { x: WORLD_W / 2 + 240, y: WORLD_H / 2 + 130 },
                    { x: WORLD_W / 2 + 340, y: WORLD_H / 2 + 130 },
                ],
                speed: 60, nameColor: '#6ee7b7',
            },
            {
                key: 'npc_banner2', name: 'Student', // Recycling texture since we only made a few unique keys
                waypoints: [
                    { x: WORLD_W - 550, y: WORLD_H - 300 }, // Near Chai Shop
                    { x: WORLD_W - 350, y: WORLD_H - 350 },
                    { x: WORLD_W - 450, y: WORLD_H - 200 },
                ],
                speed: 40, nameColor: '#93c5fd',
            },
            {
                key: 'npc_banner1', name: 'Student',
                waypoints: [
                    { x: 450, y: WORLD_H - 1000 }, // Near Golden Jubilee
                    { x: 450, y: WORLD_H - 850 },
                    { x: 350, y: WORLD_H - 850 },
                    { x: 350, y: WORLD_H - 1000 },
                ],
                speed: 50, nameColor: '#fef08a',
            },
            {
                key: 'npc_Aashish', name: 'Student',
                waypoints: [
                    { x: WORLD_W / 2 - 100, y: WORLD_H - 800 }, // Under Virgin Tree
                    { x: WORLD_W / 2 + 100, y: WORLD_H - 800 },
                ],
                speed: 30, nameColor: '#86efac',
            }
        ];

        patrolDefs.forEach(def => {
            const start = def.waypoints[0];
            const spr = this.physics.add.sprite(start.x, start.y, `${def.key}_down_0`);
            spr.setDepth(8).setCollideWorldBounds(true);
            const label = this.add.text(start.x, start.y - 28, def.name, {
                fontSize: '11px', fontFamily: 'Arial',
                color: def.nameColor, stroke: '#000', strokeThickness: 3,
            }).setOrigin(0.5).setDepth(9);

            this.walkingNPCs.push({
                sprite: spr, label,
                key: def.key, waypoints: def.waypoints,
                wpIdx: 0, speed: def.speed,
                walkFrame: 0, walkTimer: 0, lastDir: 'right',
            });
        });

        // ── IEEE Banner Holders ─────────────────────────────────────────────
        // Banner holders march back and forth near HQ
        const hq = BUILDINGS[4];
        const bannerDefs = [
            {
                key: 'npc_banner1', name: 'IEEE Banner',
                x: hq.x - 80, y: hq.y + hq.h + 40,
                patrolX: [hq.x - 80, hq.x + 200], speed: 38,
            },
            {
                key: 'npc_banner2', name: 'IEEE Banner',
                x: hq.x + hq.w + 80, y: hq.y + hq.h + 40,
                patrolX: [hq.x + 100, hq.x + hq.w + 80], speed: 38,
            },
        ];

        bannerDefs.forEach((def, i) => {
            const spr = this.physics.add.sprite(def.x, def.y, `${def.key}_right_0`);
            spr.setDepth(8);
            // Attach banner image above/beside them
            const banner = this.add.image(def.x, def.y - 42, 'banner').setDepth(7).setScale(0.7);
            this.bannerNPCs.push({
                sprite: spr, banner,
                key: def.key, patrolX: def.patrolX,
                dir: 1, speed: def.speed,
                walkFrame: 0, walkTimer: 0, lastDir: 'right',
            });
        });

        // ── Stationary NPCs ─────────────────────────────────────────────────
        const stillDefs = [
            // Stage Audience / Stage
            { x: 450, y: 780, key: 'npc_Aashish_up_0', name: 'Student', nameColor: '#cbd5e1' },
            { x: 500, y: 790, key: 'npc_Sagar_up_0', name: 'Student', nameColor: '#cbd5e1' },
            { x: 550, y: 780, key: 'npc_Yogesh_up_0', name: 'Student', nameColor: '#cbd5e1' },
            { x: 600, y: 795, key: 'npc_banner1_up_0', name: 'Student', nameColor: '#cbd5e1' },
            { x: 650, y: 785, key: 'npc_banner2_up_0', name: 'Student', nameColor: '#cbd5e1' },
            { x: 700, y: 780, key: 'npc_Aashish_up_0', name: 'Student', nameColor: '#cbd5e1' },
            { x: 600, y: 650, key: 'npc_Sagar_down_0', name: 'Performer', nameColor: '#38bdf8' },

            // Teachers at Academic Blocks
            { x: 300, y: WORLD_H - 1280, key: 'npc_Aashish_down_0', name: 'Professor', nameColor: '#fbbf24', scale: 1.1 },
            { x: WORLD_W - 500, y: WORLD_H - 1280, key: 'npc_Sagar_down_0', name: 'Professor', nameColor: '#fbbf24', scale: 1.1 },

            // Security Guards
            { x: WORLD_W / 2 + 60, y: 150, key: 'npc_Yogesh_down_0', name: 'Security', nameColor: '#ef4444', scale: 1.05 },
            { x: WORLD_W - 150, y: 250, key: 'npc_banner1_left_0', name: 'Security', nameColor: '#ef4444', scale: 1.05 }, // By Yuvika

            // Chilling at Canteens
            { x: 400, y: WORLD_H - 350, key: 'npc_Yogesh_down_0', name: 'Hungry Student', nameColor: '#cbd5e1' },
            { x: 450, y: WORLD_H - 320, key: 'npc_banner1_right_0', name: 'Student', nameColor: '#cbd5e1' },
            { x: WORLD_W - 400, y: WORLD_H - 350, key: 'npc_Aashish_left_0', name: 'Student', nameColor: '#cbd5e1' },
            { x: WORLD_W - 450, y: WORLD_H - 380, key: 'npc_banner2_down_0', name: 'Student', nameColor: '#cbd5e1' },

            // Near Virgin Tree
            { x: WORLD_W / 2 - 80, y: WORLD_H - 950, key: 'npc_Sagar_right_0', name: 'Chill Student', nameColor: '#cbd5e1' },
            { x: WORLD_W / 2 + 80, y: WORLD_H - 920, key: 'npc_Yogesh_left_0', name: 'Chill Student', nameColor: '#cbd5e1' },

            // Along the paths
            { x: 250, y: 900, key: 'npc_banner1_down_0', name: 'Student', nameColor: '#cbd5e1' },
            { x: WORLD_W - 250, y: 900, key: 'npc_Aashish_up_0', name: 'Student', nameColor: '#cbd5e1' }
        ];

        this.stationaryNPCs = [];
        stillDefs.forEach(def => {
            const spr = this.physics.add.sprite(def.x, def.y, def.key);
            spr.setDepth(10 + def.y * 0.0005).setImmovable(true);
            if (def.scale) spr.setScale(def.scale);
            this.physics.add.collider(this.player, spr);

            const label = this.add.text(def.x, def.y - 30, def.name, {
                fontSize: '10px', fontFamily: 'Arial', color: def.nameColor || '#fff', stroke: '#000', strokeThickness: 3
            }).setOrigin(0.5).setDepth(11);

            this.stationaryNPCs.push({ sprite: spr, label: label, name: def.name });
        });

        // ── Vehicles (Traffic) ──────────────────────────────────────────────
        this.vehicles = [];
        const createVehicle = ({ x, y, texture = 'scooty_sprite', scale = 0.22, rotation = 0, flipX = false, speedX = 0, speedY = 0, bounds, bodyW = 62, bodyH = 28 }) => {
            const spr = this.physics.add.sprite(x, y, texture);
            spr.setScale(scale);
            spr.setRotation(rotation);
            spr.setFlipX(flipX);
            spr.body.setSize(bodyW, bodyH, true);
            spr.setDepth(10 + y * 0.0005).setImmovable(true);
            this.physics.add.collider(this.player, spr);

            const vehicle = {
                sprite: spr,
                sx: speedX,
                sy: speedY,
                bounds,
                collisionCooldown: 0,
                pauseUntil: 0,
            };

            this.physics.add.collider(spr, this.staticGroup, () => {
                if (vehicle.collisionCooldown > 0) return;
                vehicle.collisionCooldown = 260;
                vehicle.pauseUntil = this.time.now + 220;
                vehicle.sx = -vehicle.sx;
                vehicle.sy = -vehicle.sy;
            });

            this.vehicles.push(vehicle);
        };

        // Cars on Main Ave (Horizontal)
        createVehicle({ x: 100, y: WORLD_H / 2 - 24, speedX: 180, rotation: Math.PI, bounds: { minX: -100, maxX: WORLD_W + 100, minY: 0, maxY: 0 }, bodyW: 78, bodyH: 36 });
        createVehicle({ x: WORLD_W - 100, y: WORLD_H / 2 + 24, speedX: -160, rotation: Math.PI, flipX: true, bounds: { minX: -100, maxX: WORLD_W + 100, minY: 0, maxY: 0 }, bodyW: 78, bodyH: 36 });
        createVehicle({ x: WORLD_W * 0.25, y: WORLD_H / 2 - 56, texture: 'bike_sprite', scale: 0.22, speedX: 220, bounds: { minX: -120, maxX: WORLD_W + 120, minY: 0, maxY: 0 }, bodyW: 62, bodyH: 28 });
        createVehicle({ x: WORLD_W * 0.75, y: WORLD_H / 2 + 56, texture: 'scooty_sprite', scale: 0.22, speedX: -190, flipX: true, bounds: { minX: -120, maxX: WORLD_W + 120, minY: 0, maxY: 0 }, bodyW: 62, bodyH: 28 });
        // Cars on Main St (Vertical)
        createVehicle({ x: WORLD_W / 2 - 24, y: 100, speedY: 150, rotation: Math.PI / 2, bounds: { minX: 0, maxX: 0, minY: -100, maxY: WORLD_H + 100 }, bodyW: 36, bodyH: 78 });
        createVehicle({ x: WORLD_W / 2 + 24, y: WORLD_H - 100, speedY: -170, rotation: -Math.PI / 2, bounds: { minX: 0, maxX: 0, minY: -100, maxY: WORLD_H + 100 }, bodyW: 36, bodyH: 78 });
        createVehicle({ x: WORLD_W / 2 - 56, y: WORLD_H * 0.25, texture: 'bike_sprite', scale: 0.22, speedY: 175, rotation: Math.PI / 2, bounds: { minX: 0, maxX: 0, minY: -120, maxY: WORLD_H + 120 }, bodyW: 28, bodyH: 62 });
        createVehicle({ x: WORLD_W / 2 + 56, y: WORLD_H * 0.8, texture: 'scooty_sprite', scale: 0.22, speedY: -165, rotation: -Math.PI / 2, bounds: { minX: 0, maxX: 0, minY: -120, maxY: WORLD_H + 120 }, bodyW: 28, bodyH: 62 });
        // Speech Bubble Group
        this.speechBubble = this.add.container(0, 0).setDepth(200).setAlpha(0);
        const bBg = this.add.rectangle(0, -20, 160, 50, 0xffffff).setStrokeStyle(2, 0x000000);
        const bTail = this.add.triangle(0, 5, 0, -10, -10, -20, 10, -20, 0xffffff);
        this.speechText = this.add.text(0, -20, '', {
            fontSize: '12px', fontFamily: 'Arial', color: '#000', align: 'center', wordWrap: { width: 140 }
        }).setOrigin(0.5);
        this.speechBubble.add([bBg, bTail, this.speechText]);
        this.speechTimer = null;
    }

    showSpeechBubble(x, y, text) {
        this.speechBubble.setPosition(x, y - 40);
        this.speechText.setText(text);
        this.tweens.killTweensOf(this.speechBubble);
        this.speechBubble.setAlpha(1);
        if (this.speechTimer) clearTimeout(this.speechTimer);
        this.speechTimer = setTimeout(() => {
            if (this.speechBubble) {
                this.tweens.add({ targets: this.speechBubble, alpha: 0, duration: 300 });
            }
        }, 3000);
    }

    tickDayCycle() {
        this.timeOfDay = (this.timeOfDay + 0.00025) % 1;
        if (!this.dayOverlay) return;
        this.dayOverlay.clear();
        let color, alpha = 0;
        if (this.timeOfDay < 0.07) {
            color = 0xff6b00; alpha = 0.18 * (1 - this.timeOfDay / 0.07);
        } else if (this.timeOfDay > 0.72 && this.timeOfDay < 0.87) {
            color = 0x6d28d9; alpha = 0.18 * ((this.timeOfDay - 0.72) / 0.15);
        } else if (this.timeOfDay >= 0.87) {
            color = 0x0f172a; alpha = 0.35 * ((this.timeOfDay - 0.87) / 0.13);
        }
        if (alpha > 0) {
            this.dayOverlay.fillStyle(color, alpha);
            this.dayOverlay.fillRect(0, 0, CAM_W, CAM_H);
        }
    }

    update(time, delta) {
        if (!this.player) return;

        // Movement
        const up = this.cursors.up.isDown || this.wasd.up.isDown || this.joystickDir.y < -0.25;
        const down = this.cursors.down.isDown || this.wasd.down.isDown || this.joystickDir.y > 0.25;
        const left = this.cursors.left.isDown || this.wasd.left.isDown || this.joystickDir.x < -0.25;
        const right = this.cursors.right.isDown || this.wasd.right.isDown || this.joystickDir.x > 0.25;

        let vx = 0, vy = 0;
        if (left) vx -= SPEED;
        if (right) vx += SPEED;
        if (up) vy -= SPEED;
        if (down) vy += SPEED;
        if (vx && vy) { vx *= 0.707; vy *= 0.707; }
        this.player.setVelocity(vx, vy);

        // Direction + frame
        const moving = vx !== 0 || vy !== 0;
        let dir = this.lastDir;
        if (Math.abs(vx) >= Math.abs(vy)) { if (vx > 0) dir = 'right'; else if (vx < 0) dir = 'left'; }
        else { if (vy > 0) dir = 'down'; else if (vy < 0) dir = 'up'; }

        if (moving) {
            this.lastDir = dir;
            this.walkTimer += delta;
            if (this.walkTimer >= 110) { this.walkTimer = 0; this.walkFrame = (this.walkFrame + 1) % 4; }
            this.player.setTexture(`p_${dir}_${this.walkFrame}`);
        } else {
            this.walkTimer = 0;
            this.player.setTexture(`p_${this.lastDir}_0`);
        }

        this.player.setDepth(10 + this.player.y * 0.0005);
        this.playerShadow.setPosition(this.player.x, this.player.y + 26);

        // Level aura (level 3+)
        this.levelAura.clear();
        if (this.playerLevel >= 3) {
            const auraColors = { 3: 0x818cf8, 4: 0x34d399, 5: 0xfbbf24 };
            const ac = auraColors[Math.min(this.playerLevel, 5)];
            const pulse = 0.12 + 0.05 * Math.sin(time * 0.004);
            this.levelAura.lineStyle(2.5, ac, pulse * 3);
            this.levelAura.strokeCircle(this.player.x, this.player.y, 32 + 3 * Math.sin(time * 0.003));
            this.levelAura.fillStyle(ac, pulse);
            this.levelAura.fillCircle(this.player.x, this.player.y, 32);
        }

        // ── Walking NPC patrol update ──────────────────────────────────────
        this.walkingNPCs.forEach(n => {
            const target = n.waypoints[n.wpIdx];
            const dx = target.x - n.sprite.x;
            const dy = target.y - n.sprite.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 4) {
                // Reached waypoint — move to next
                n.sprite.setVelocity(0, 0);
                n.wpIdx = (n.wpIdx + 1) % n.waypoints.length;
            } else {
                const nx = (dx / dist) * n.speed;
                const ny = (dy / dist) * n.speed;
                n.sprite.setVelocity(nx, ny);

                // Direction
                let nDir;
                if (Math.abs(nx) >= Math.abs(ny)) nDir = nx > 0 ? 'right' : 'left';
                else nDir = ny > 0 ? 'down' : 'up';
                n.lastDir = nDir;

                // Animate
                n.walkTimer += delta;
                if (n.walkTimer >= 130) { n.walkTimer = 0; n.walkFrame = (n.walkFrame + 1) % 4; }
                n.sprite.setTexture(`${n.key}_${nDir}_${n.walkFrame}`);
            }

            // Keep label above sprite
            n.label.setPosition(n.sprite.x, n.sprite.y - 32);
            n.sprite.setDepth(8 + n.sprite.y * 0.0005);
        });

        // ── Banner NPC patrol update ───────────────────────────────────────
        this.bannerNPCs.forEach(b => {
            const [minX, maxX] = b.patrolX;
            b.sprite.setVelocityX(b.dir * b.speed);
            b.sprite.setVelocityY(0);

            if (b.sprite.x >= maxX) b.dir = -1;
            if (b.sprite.x <= minX) b.dir = 1;

            const bDir = b.dir > 0 ? 'right' : 'left';
            b.lastDir = bDir;
            b.walkTimer += delta;
            if (b.walkTimer >= 140) { b.walkTimer = 0; b.walkFrame = (b.walkFrame + 1) % 4; }
            b.sprite.setTexture(`${b.key}_${bDir}_${b.walkFrame}`);

            // Banner floats above & slightly ahead
            b.banner.setPosition(b.sprite.x + b.dir * 10, b.sprite.y - 44);
        });

        // ── Vehicle Update ─────────────────────────────────────────────────
        this.vehicles.forEach(v => {
            v.collisionCooldown = Math.max(0, v.collisionCooldown - delta);
            if (this.time.now < v.pauseUntil) {
                v.sprite.setVelocity(0, 0);
                return;
            }
            v.sprite.setVelocity(v.sx, v.sy);
            v.sprite.setDepth(10 + v.sprite.y * 0.0005);

            // Loop screen
            if (v.sx > 0 && v.sprite.x > v.bounds.maxX) v.sprite.x = v.bounds.minX;
            if (v.sx < 0 && v.sprite.x < v.bounds.minX) v.sprite.x = v.bounds.maxX;
            if (v.sy > 0 && v.sprite.y > v.bounds.maxY) v.sprite.y = v.bounds.minY;
            if (v.sy < 0 && v.sprite.y < v.bounds.minY) v.sprite.y = v.bounds.maxY;
        });

        // Building proximity
        this.nearBuilding = null;
        this.interactZones.forEach(zone => {
            if (Phaser.Geom.Rectangle.Overlaps(this.player.getBounds(), zone.getBounds())) {
                this.nearBuilding = zone.buildingData;
            }
        });

        // NPC proximity
        this.nearNPC = null;
        this.stationaryNPCs.forEach(npc => {
            const dx = npc.sprite.x - this.player.x;
            const dy = npc.sprite.y - this.player.y;
            if (Math.sqrt(dx * dx + dy * dy) < 50) {
                this.nearNPC = npc;
            }
        });

        // Prompt
        if (this.nearBuilding) {
            const b = this.nearBuilding;
            let lockedMsg = null;
            if (b.id === 'hq' && this.playerXP < HQ_XP_REQUIRED) lockedMsg = `🔒 IEEE HQ locked — need ${HQ_XP_REQUIRED - this.playerXP} more XP`;
            else if (b.id === 'industry' && this.playerXP < 300) lockedMsg = `🔒 Industry Visit locked — need ${300 - this.playerXP} more XP`;

            const msg = lockedMsg || `[E] Enter ${b.label}`;
            this.promptText.setText(msg);
            if (this.promptText.alpha < 1) this.tweens.add({ targets: this.promptText, alpha: 1, duration: 180 });
        } else if (this.nearNPC) {
            this.promptText.setText(`[E] Talk to ${this.nearNPC.name}`);
            if (this.promptText.alpha < 1) this.tweens.add({ targets: this.promptText, alpha: 1, duration: 180 });
        } else {
            if (this.promptText.alpha > 0) this.tweens.add({ targets: this.promptText, alpha: 0, duration: 180 });
        }

        this.refreshHQOverlay();

        // Interact
        const doInteract = Phaser.Input.Keyboard.JustDown(this.interactKey) || this.mobileInteract;
        this.mobileInteract = false;

        if (doInteract) {
            if (this.nearBuilding) {
                const b = this.nearBuilding;
                let isLocked = false;
                if (b.id === 'hq' && this.playerXP < HQ_XP_REQUIRED) isLocked = true;
                if (b.id === 'industry' && this.playerXP < 300) isLocked = true;

                if (isLocked) {
                    audio.playError();
                    this.cameras.main.shake(180, 0.007);
                } else {
                    audio.playBoink();
                    EventBus.emit('open-modal', b.id);
                }
            } else if (this.nearNPC) {
                audio.playBoink();
                const quotes = [
                    "Hey! When are you joining IEEE?",
                    "Have you checked out the new Canteen?",
                    "IEEE Memberships are open now!",
                    "Did you see the performance on stage?",
                    "I need more XP to enter the HQ...",
                    "The campus looks great today!"
                ];
                const q = quotes[Math.floor(Math.random() * quotes.length)];
                this.showSpeechBubble(this.nearNPC.sprite.x, this.nearNPC.sprite.y, q);
            }
        }
    }

    showXPGain(amount) {
        audio.playCoin();
        const text = this.add.text(this.player.x, this.player.y - 40, `+${amount} XP ✨`, {
            fontSize: '20px', fontFamily: 'Arial', fontStyle: 'bold',
            color: '#fbbf24', stroke: '#000000', strokeThickness: 4,
        }).setDepth(300);
        this.tweens.add({ targets: text, y: text.y - 75, alpha: 0, duration: 1600, ease: 'Power2', onComplete: () => text.destroy() });

        this.add.particles(this.player.x, this.player.y - 20, 'spark', {
            speed: { min: 50, max: 140 }, scale: { start: 0.9, end: 0 },
            alpha: { start: 1, end: 0 }, lifespan: 800, quantity: 10, emitting: false,
        }).explode(10);
    }

    destroy() {
        if (this.bgMusic) {
            this.bgMusic.stop();
            this.bgMusic.destroy();
            this.bgMusic = null;
        }
        if (this.bgMusicElement) {
            this.bgMusicElement.pause();
            this.bgMusicElement.currentTime = 0;
            this.bgMusicElement = null;
        }
        EventBus.removeAllListeners('xp-update');
        EventBus.removeAllListeners('mobile-interact');
        EventBus.removeAllListeners('joystick-move');
        EventBus.removeAllListeners('toggle-music');
    }
}
