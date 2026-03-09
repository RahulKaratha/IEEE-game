import { create } from 'zustand';

const LEVELS = [
    { level: 1, title: 'Freshman', xpRequired: 0, description: 'Your journey begins…', emoji: '🎒' },
    { level: 2, title: 'Tech Enthusiast', xpRequired: 200, description: 'Backpack loaded, ideas flowing!', emoji: '💻' },
    { level: 3, title: 'Active Member', xpRequired: 450, description: 'Rocking that IEEE lanyard!', emoji: '🏅' },
    { level: 4, title: 'Project Lead', xpRequired: 700, description: 'Leading workshops and teams!', emoji: '👥' },
    { level: 5, title: 'Professional', xpRequired: 900, description: 'Suited up and IEEE-ready!', emoji: '💼' },
];

const getLevelFromXP = (xp) => {
    let current = LEVELS[0];
    for (const lvl of LEVELS) {
        if (xp >= lvl.xpRequired) current = lvl;
    }
    return current;
};

const useGameStore = create((set, get) => ({
    xp: 0,
    levelData: LEVELS[0],
    completedBuildings: new Set(),
    activityLog: [],
    activeModal: null,
    showFinalScreen: false,
    levelUpToast: null,
    LEVELS,

    gainXP: (amount, buildingName) => {
        const { xp, levelData, completedBuildings, activityLog } = get();
        const newXP = xp + amount;
        const newLevelData = getLevelFromXP(newXP);
        const newCompleted = new Set(completedBuildings);
        newCompleted.add(buildingName);
        const newLog = [...activityLog, { building: buildingName, xp: amount, time: new Date().toLocaleTimeString() }];
        const toast = newLevelData.level > levelData.level ? newLevelData : null;
        set({ xp: newXP, levelData: newLevelData, completedBuildings: newCompleted, activityLog: newLog, levelUpToast: toast });
    },

    openModal: (name) => set({ activeModal: name }),
    closeModal: () => set({ activeModal: null }),
    triggerFinalScreen: () => set({ showFinalScreen: true }),
    dismissToast: () => set({ levelUpToast: null }),

    getNextLevel: () => {
        const lvl = get().levelData.level;
        return LEVELS.find(l => l.level === lvl + 1) || null;
    },

    getXPProgress: () => {
        const { xp, levelData } = get();
        const next = LEVELS.find(l => l.level === levelData.level + 1);
        if (!next) return 100;
        return Math.min(100, ((xp - levelData.xpRequired) / (next.xpRequired - levelData.xpRequired)) * 100);
    },
}));

export default useGameStore;
