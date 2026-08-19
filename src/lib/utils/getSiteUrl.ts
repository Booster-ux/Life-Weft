/**
 * Returns the absolute base site URL for the current environment.
 * Prioritizes NEXT_PUBLIC_SITE_URL in production, window.location.origin in the browser,
 * VERCEL_URL on Vercel preview environments, and http://localhost:3000 locally.
 */
export function getSiteUrl(): string {
    // 1. Explicit NEXT_PUBLIC_SITE_URL
    const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (envSiteUrl && envSiteUrl.trim() !== "") {
        let clean = envSiteUrl.trim();
        if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
            clean = `https://${clean}`;
        }
        return clean.replace(/\/$/, "");
    }

    // 2. In browser, use current window origin
    if (typeof window !== "undefined" && window.location && window.location.origin) {
        return window.location.origin;
    }

    // 3. Vercel environment URL
    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
    if (vercelUrl && vercelUrl.trim() !== "") {
        return `https://${vercelUrl.replace(/\/$/, "")}`;
    }

    // 4. Default local development fallback
    return "http://localhost:3000";
}
