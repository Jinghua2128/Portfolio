/* Date-aware ordering shared by both sites; missing dates are never invented. */
(() => {
    function calendar(year, month, day) {
        if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day) || year < 1000) return 0;
        const stamp = Date.UTC(year, month - 1, day), date = new Date(stamp);
        return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? stamp : 0;
    }
    function timestamp(value) {
        if (!value) return 0;
        try {
            if (typeof value.toMillis === 'function') return Number(value.toMillis()) || 0;
            if (typeof value.toDate === 'function') return Number(value.toDate()) || 0;
            if (value instanceof Date) return Number(value) || 0;
            if (typeof value === 'object' && Number.isFinite(value.seconds)) return value.seconds * 1000;
            if (typeof value === 'number') return Number.isFinite(value) && value > 100000000000 ? value : 0;
            const text = String(value).trim();
            const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/);
            if (iso) {
                const day = calendar(Number(iso[1]), Number(iso[2]), Number(iso[3]));
                if (!day) return 0;
                return text.includes('T') ? Date.parse(text) || 0 : day;
            }
        } catch { /* Malformed legacy dates remain undated. */ }
        return 0;
    }
    function legacyDate(item) {
        const match = String(item.month || '').trim().match(/^([A-Za-z]+)\s+(\d{4})$/);
        if (!match || !/^\d{1,2}$/.test(String(item.day))) return 0;
        const month = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(match[1].slice(0,3).toLowerCase()) + 1;
        return month ? calendar(Number(match[2]), month, Number(item.day)) : 0;
    }
    const date = (item, kind) => timestamp(item.date) || (kind === 'post' ? legacyDate(item) : 0) || timestamp(item.publishedAt) || timestamp(item.createdAt) || timestamp(Number(item.sortOrder));
    const newest = (items, kind) => [...items].sort((a, b) => date(b, kind) - date(a, kind));
    const inProgress = item => /^(in[-_ ]progress|ongoing|wip)$/i.test(String(item.status || '').trim());
    window.PortfolioContentOrder = Object.freeze({ date, newest, inProgress });
})();
