/**
 * Lightweight, privacy-respecting client device security tracker.
 * Identifies genuinely new device sign-ins without invasive fingerprinting.
 */

export function checkAndNotifyNewDevice(userId: string) {
    if (typeof window === "undefined" || !userId) return;

    try {
        const storageKey = `lw_known_device_${userId}`;
        const existingDevice = localStorage.getItem(storageKey);

        if (!existingDevice) {
            // Generate a random client device UUID
            const newDeviceId = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            localStorage.setItem(storageKey, newDeviceId);

            // Notify backend securely
            fetch("/api/auth/new-device-alert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    deviceId: newDeviceId,
                    userAgent: navigator.userAgent,
                    clientTime: new Date().toLocaleString(),
                }),
            }).catch(() => {
                // Non-blocking background notification
            });
        }
    } catch {
        // Storage access may fail in private browsing mode; fail gracefully
    }
}
