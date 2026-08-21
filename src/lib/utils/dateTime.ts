/**
 * Lifeweft — Device Date & Timezone Utilities
 * Provides timezone auto-detection, calendar-safe date-only calculations,
 * and localized display formatting without timezone shift errors.
 */

export interface TimezoneOption {
    value: string;
    label: string;
    region: string;
    offset: string;
}

/**
 * Common curated list of IANA Timezones spanning all major regions
 */
export const TIMEZONE_OPTIONS: TimezoneOption[] = [
    // Africa
    { value: "Africa/Lagos", label: "West Africa Time (Lagos, Abuja)", region: "Africa", offset: "UTC+1" },
    { value: "Africa/Cairo", label: "Eastern European Time (Cairo)", region: "Africa", offset: "UTC+2" },
    { value: "Africa/Johannesburg", label: "South Africa Standard Time (Johannesburg)", region: "Africa", offset: "UTC+2" },
    { value: "Africa/Nairobi", label: "East Africa Time (Nairobi)", region: "Africa", offset: "UTC+3" },
    { value: "Africa/Casablanca", label: "Western European Time (Casablanca)", region: "Africa", offset: "UTC+1" },
    { value: "Africa/Accra", label: "Greenwich Mean Time (Accra)", region: "Africa", offset: "UTC+0" },

    // Americas
    { value: "America/New_York", label: "Eastern Time (New York, Miami)", region: "Americas", offset: "UTC-5 / UTC-4" },
    { value: "America/Chicago", label: "Central Time (Chicago, Dallas)", region: "Americas", offset: "UTC-6 / UTC-5" },
    { value: "America/Denver", label: "Mountain Time (Denver, Phoenix)", region: "Americas", offset: "UTC-7 / UTC-6" },
    { value: "America/Los_Angeles", label: "Pacific Time (Los Angeles, Seattle)", region: "Americas", offset: "UTC-8 / UTC-7" },
    { value: "America/Toronto", label: "Eastern Time (Toronto, Montreal)", region: "Americas", offset: "UTC-5 / UTC-4" },
    { value: "America/Vancouver", label: "Pacific Time (Vancouver)", region: "Americas", offset: "UTC-8 / UTC-7" },
    { value: "America/Sao_Paulo", label: "Brasilia Time (São Paulo)", region: "Americas", offset: "UTC-3" },
    { value: "America/Argentina/Buenos_Aires", label: "Argentina Time (Buenos Aires)", region: "Americas", offset: "UTC-3" },
    { value: "America/Mexico_City", label: "Central Standard Time (Mexico City)", region: "Americas", offset: "UTC-6" },

    // Europe
    { value: "Europe/London", label: "Greenwich Mean / BST (London, Dublin)", region: "Europe", offset: "UTC+0 / UTC+1" },
    { value: "Europe/Paris", label: "Central European Time (Paris, Berlin, Rome)", region: "Europe", offset: "UTC+1 / UTC+2" },
    { value: "Europe/Amsterdam", label: "Central European Time (Amsterdam)", region: "Europe", offset: "UTC+1 / UTC+2" },
    { value: "Europe/Madrid", label: "Central European Time (Madrid, Barcelona)", region: "Europe", offset: "UTC+1 / UTC+2" },
    { value: "Europe/Athens", label: "Eastern European Time (Athens, Bucharest)", region: "Europe", offset: "UTC+2 / UTC+3" },
    { value: "Europe/Istanbul", label: "Turkey Time (Istanbul)", region: "Europe", offset: "UTC+3" },
    { value: "Europe/Moscow", label: "Moscow Standard Time (Moscow)", region: "Europe", offset: "UTC+3" },

    // Asia & Middle East
    { value: "Asia/Dubai", label: "Gulf Standard Time (Dubai, Abu Dhabi)", region: "Asia", offset: "UTC+4" },
    { value: "Asia/Kolkata", label: "India Standard Time (Mumbai, Delhi)", region: "Asia", offset: "UTC+5:30" },
    { value: "Asia/Bangkok", label: "Indochina Time (Bangkok, Jakarta)", region: "Asia", offset: "UTC+7" },
    { value: "Asia/Singapore", label: "Singapore Standard Time (Singapore)", region: "Asia", offset: "UTC+8" },
    { value: "Asia/Hong_Kong", label: "Hong Kong Time (Hong Kong)", region: "Asia", offset: "UTC+8" },
    { value: "Asia/Shanghai", label: "China Standard Time (Beijing, Shanghai)", region: "Asia", offset: "UTC+8" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (Tokyo)", region: "Asia", offset: "UTC+9" },
    { value: "Asia/Seoul", label: "Korea Standard Time (Seoul)", region: "Asia", offset: "UTC+9" },
    { value: "Asia/Riyadh", label: "Arabia Standard Time (Riyadh)", region: "Asia", offset: "UTC+3" },

    // Oceania & Pacific
    { value: "Australia/Sydney", label: "Australian Eastern Time (Sydney, Melbourne)", region: "Oceania", offset: "UTC+10 / UTC+11" },
    { value: "Australia/Perth", label: "Australian Western Time (Perth)", region: "Oceania", offset: "UTC+8" },
    { value: "Pacific/Auckland", label: "New Zealand Time (Auckland)", region: "Oceania", offset: "UTC+12 / UTC+13" },

    // UTC Universal
    { value: "UTC", label: "Coordinated Universal Time (UTC)", region: "Universal", offset: "UTC+0" },
];

/**
 * Detects the user's local device/browser timezone using Intl API
 */
export function getDeviceTimezone(): string {
    if (typeof window === "undefined") return "UTC";
    try {
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return detected || "UTC";
    } catch {
        return "UTC";
    }
}

/**
 * Returns YYYY-MM-DD date string in the specified timezone (or user device timezone)
 */
export function getLocalDateString(date: Date = new Date(), timezone?: string): string {
    const tz = timezone || getDeviceTimezone();
    try {
        const formatter = new Intl.DateTimeFormat("en-CA", {
            timeZone: tz,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
        return formatter.format(date);
    } catch {
        // Fallback to basic ISO date if timezone string is unrecognized
        return date.toISOString().split("T")[0];
    }
}

/**
 * Formats a date string (YYYY-MM-DD or ISO) for human display in user's timezone
 */
export function formatLocalDate(
    dateInput?: string | Date | null,
    timezone?: string,
    options?: Intl.DateTimeFormatOptions
): string {
    if (!dateInput) return "";
    const tz = timezone || getDeviceTimezone();

    try {
        let dateObj: Date;
        if (typeof dateInput === "string") {
            // For date-only strings (YYYY-MM-DD), parse parts to avoid timezone shifting
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput.trim())) {
                const [year, month, day] = dateInput.trim().split("-").map(Number);
                dateObj = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
            } else {
                dateObj = new Date(dateInput);
            }
        } else {
            dateObj = dateInput;
        }

        if (isNaN(dateObj.getTime())) return String(dateInput);

        const defaultOptions: Intl.DateTimeFormatOptions = options || {
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: tz,
        };

        return new Intl.DateTimeFormat("en-US", defaultOptions).format(dateObj);
    } catch {
        return String(dateInput);
    }
}

/**
 * Formats a time string or timestamp into local time (e.g. "09:30 AM" or "14:00")
 */
export function formatLocalTime(
    timeInput?: string | Date | null,
    timezone?: string,
    use24Hour: boolean = false
): string {
    if (!timeInput) return "";
    const tz = timezone || getDeviceTimezone();

    try {
        let dateObj: Date;
        if (typeof timeInput === "string") {
            if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeInput.trim())) {
                // Already a simple time string like "09:00"
                return timeInput.trim().substring(0, 5);
            }
            dateObj = new Date(timeInput);
        } else {
            dateObj = timeInput;
        }

        if (isNaN(dateObj.getTime())) return String(timeInput);

        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: !use24Hour,
            timeZone: tz,
        }).format(dateObj);
    } catch {
        return String(timeInput);
    }
}

/**
 * Calculates calendar days between today's local date and a target due date string (YYYY-MM-DD)
 * Positive = future, 0 = today, Negative = overdue
 */
export function calculateDaysLeft(dueDateStr?: string | null, timezone?: string): number {
    if (!dueDateStr) return 0;
    const cleanDue = dueDateStr.split("T")[0].trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDue)) return 0;

    const todayStr = getLocalDateString(new Date(), timezone);
    const [tYear, tMonth, tDay] = todayStr.split("-").map(Number);
    const [dYear, dMonth, dDay] = cleanDue.split("-").map(Number);

    if (isNaN(tYear) || isNaN(dYear)) return 0;

    const todayUtc = Date.UTC(tYear, tMonth - 1, tDay);
    const targetUtc = Date.UTC(dYear, dMonth - 1, dDay);

    const diffMs = targetUtc - todayUtc;
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Returns dynamic week dates (Monday through Sunday) around a given week offset
 */
export function getCurrentWeekDays(weekOffset: number = 0, timezone?: string) {
    const todayStr = getLocalDateString(new Date(), timezone);
    const [year, month, day] = todayStr.split("-").map(Number);

    // Create anchor at local noon
    const anchor = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    const dayOfWeek = anchor.getUTCDay(); // 0 is Sunday, 1 is Monday, ...

    // Monday-based offset
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const mondayUtc = new Date(anchor);
    mondayUtc.setUTCDate(anchor.getUTCDate() - distanceToMonday + weekOffset * 7);

    const DAYS = [
        { key: "Monday", short: "Mon", dayIndex: 0 },
        { key: "Tuesday", short: "Tue", dayIndex: 1 },
        { key: "Wednesday", short: "Wed", dayIndex: 2 },
        { key: "Thursday", short: "Thu", dayIndex: 3 },
        { key: "Friday", short: "Fri", dayIndex: 4 },
        { key: "Saturday", short: "Sat", dayIndex: 5 },
        { key: "Sunday", short: "Sun", dayIndex: 6 },
    ];

    return DAYS.map((d) => {
        const current = new Date(mondayUtc);
        current.setUTCDate(mondayUtc.getUTCDate() + d.dayIndex);
        const isoDate = current.toISOString().split("T")[0];
        return {
            ...d,
            dateString: isoDate,
            dayNumber: current.getUTCDate(),
            isToday: isoDate === todayStr,
        };
    });
}
