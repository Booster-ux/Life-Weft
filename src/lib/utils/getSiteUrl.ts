/**
 * Returns the absolute base site URL for the current environment.
 * Supports Localhost, Vercel Preview Deployments, and Custom Production Domains (https://lifeweft.com).
 */
export function getSiteUrl(): string {
    if (typeof window !== "undefined" && window.location.origin) {
        return window.location.origin;
    }

    let siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXT_PUBLIC_VERCEL_URL ||
        "http://localhost:3000";

    // Ensure protocol
    if (!siteUrl.startsWith("http://") && !siteUrl.startsWith("https://")) {
        siteUrl = `https://${siteUrl}`;
    }

    // Remove trailing slash
    return siteUrl.replace(/\/$/, "");
}
