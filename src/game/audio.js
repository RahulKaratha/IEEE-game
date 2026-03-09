// Simple Web Audio API Synthesizer for Retro Sound Effects
// No external dependencies or audio files required!

class AudioEngine {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.2; // Master volume
        this.masterGain.connect(this.ctx.destination);
    }

    init() {
        // Resume AudioContext on first user interaction
        const resumeAudio = () => {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            document.removeEventListener('click', resumeAudio);
            document.removeEventListener('keydown', resumeAudio);
        };
        document.addEventListener('click', resumeAudio, { once: true });
        document.addEventListener('keydown', resumeAudio, { once: true });
    }

    _playTone(freq, type, duration, vol = 1) {
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playBoink() {
        // A bouncy/jumpy sound
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }

    playCoin() {
        // High pitched double ding
        this._playTone(987.77, 'sine', 0.1, 0.3); // B5
        setTimeout(() => this._playTone(1318.51, 'sine', 0.3, 0.3), 100); // E6
    }

    playLevelUp() {
        // A rising arpeggio
        const notes = [261.63, 329.63, 392.00, 523.25]; // C E G C
        notes.forEach((freq, i) => {
            setTimeout(() => this._playTone(freq, 'square', 0.3, 0.1), i * 100);
        });
    }

    playError() {
        // Low buzz
        this._playTone(150, 'sawtooth', 0.3, 0.4);
    }
}

// Export a singleton instance
export const audio = new AudioEngine();
