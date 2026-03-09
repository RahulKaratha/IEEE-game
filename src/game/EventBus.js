// Lightweight browser-compatible event bus (no Node.js deps)
class BrowserEventEmitter {
    constructor() {
        this._listeners = {};
    }
    on(event, fn) {
        if (!this._listeners[event]) this._listeners[event] = [];
        this._listeners[event].push(fn);
        return this;
    }
    off(event, fn) {
        if (!this._listeners[event]) return this;
        this._listeners[event] = this._listeners[event].filter(f => f !== fn);
        return this;
    }
    emit(event, ...args) {
        (this._listeners[event] || []).forEach(fn => fn(...args));
        return this;
    }
    removeAllListeners(event) {
        if (event) delete this._listeners[event];
        else this._listeners = {};
        return this;
    }
}

// Singleton EventBus for Phaser <-> React communication
const EventBus = new BrowserEventEmitter();
export default EventBus;
