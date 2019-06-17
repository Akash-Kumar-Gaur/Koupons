
export default class ToastNotifications {
    _currentGlobalToast = null;
    static register(ref) {
        this._currentGlobalToast = ref;
    }
    static error({ ...args }) {
        if (this._currentGlobalToast) {
            this._currentGlobalToast.error({ ...args });
        }
    }

    static success({ ...args }) {
        if (this._currentGlobalToast) {
            this._currentGlobalToast.success({ ...args });
        }
    }

    static warn({ ...args }) {
        if (this._currentGlobalToast) {
            this._currentGlobalToast.warn({ ...args });
        }
    }

    static info({ ...args }) {
        if (this._currentGlobalToast) {
            this._currentGlobalToast.info({ ...args });
        }
    }
}

export function OfflineNotification() {
    ToastNotifications.warn({ title: 'No Internet! You seem to be offline.' });
}
