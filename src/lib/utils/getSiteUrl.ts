/**
 * Returns the absolute base site URL for the current environment.
 * In browser: uses current window.location.origin (always matches current deployment/domain).
 * On server: checks NEXT_PUBLIC_SITE_URL, VERCEL_URL, or falls back to http://localhost:3000.
 */
export function getSiteUrl(): string {
    // 1. In browser, window.location.origin is the exact active domain
    if (typeof window !== "undefined" && window.location && window.location.origin) {
        return window.location.origin.replace(/\/$/, "");
    }

    // 2. Explicit NEXT_PUBLIC_SITE_URL
    const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (envSiteUrl && envSiteUrl.trim() !== "") {
        let clean = envSiteUrl.trim();
        if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
            clean = `https://${clean}`;
        }
        return clean.replace(/\/$/, "");
    }

    // 3. Vercel deployment URL
    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
    if (vercelUrl && vercelUrl.trim() !== "") {
        return `https://${vercelUrl.replace(/\/$/, "")}`;
    }

    // 4. Default local development fallback
    return "http://localhost:3000";
}
