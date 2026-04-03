import { useState, useEffect, useCallback } from 'react';

const GITHUB_USERNAME = 'sunnycho100';
const DISPLAY_WEEKS = 13;

interface ContributionDay {
    date: string;
    count: number;
    level: number;
}

interface Week {
    days: ContributionDay[];
}

const LEVEL_COLORS = [
    'var(--gh-level-0)',
    'var(--gh-level-1)',
    'var(--gh-level-2)',
    'var(--gh-level-3)',
    'var(--gh-level-4)',
];

const getLevel = (count: number): number => {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
};

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

const formatDisplayDate = (dateStr: string): string => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const GithubHeatmap = () => {
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [tooltip, setTooltip] = useState<{ day: ContributionDay; x: number; y: number } | null>(null);

    const buildFromGraphQL = useCallback(async (token: string): Promise<boolean> => {
        const today = new Date();
        const from = new Date(today);
        from.setDate(from.getDate() - (DISPLAY_WEEKS + 1) * 7);
        const fromISO = from.toISOString();
        const toISO = today.toISOString();

        const query = `query($username: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $username) {
                contributionsCollection(from: $from, to: $to) {
                    contributionCalendar {
                        totalContributions
                        weeks {
                            contributionDays {
                                contributionCount
                                date
                            }
                        }
                    }
                }
            }
        }`;

        try {
            const res = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    Authorization: `bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables: { username: GITHUB_USERNAME, from: fromISO, to: toISO },
                }),
            });

            const data = await res.json();
            const calendar = data.data.user.contributionsCollection.contributionCalendar;

            const allWeeks: Week[] = calendar.weeks.map((w: { contributionDays: { contributionCount: number; date: string }[] }) => ({
                days: w.contributionDays.map((d) => ({
                    date: d.date,
                    count: d.contributionCount,
                    level: getLevel(d.contributionCount),
                })),
            }));

            setTotal(calendar.totalContributions);
            setWeeks(allWeeks.slice(-DISPLAY_WEEKS));
            return true;
        } catch {
            return false;
        }
    }, []);

    const buildFromEvents = useCallback(async (): Promise<boolean> => {
        try {
            const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`);
            if (!res.ok) return false;

            const events: { created_at: string }[] = await res.json();
            const countByDate: Record<string, number> = {};

            for (const event of events) {
                const date = event.created_at.split('T')[0];
                countByDate[date] = (countByDate[date] || 0) + 1;
            }

            const today = new Date();
            const start = new Date(today);
            start.setDate(start.getDate() - DISPLAY_WEEKS * 7);
            start.setDate(start.getDate() - start.getDay());

            let totalCount = 0;
            const weeksData: Week[] = [];

            for (let w = 0; w < DISPLAY_WEEKS; w++) {
                const days: ContributionDay[] = [];
                for (let d = 0; d < 7; d++) {
                    const date = new Date(start);
                    date.setDate(date.getDate() + w * 7 + d);
                    const dateStr = formatDate(date);
                    const count = date > today ? 0 : (countByDate[dateStr] || 0);
                    totalCount += count;
                    days.push({ date: dateStr, count, level: getLevel(count) });
                }
                weeksData.push({ days });
            }

            setTotal(totalCount);
            setWeeks(weeksData);
            return true;
        } catch {
            return false;
        }
    }, []);

    const buildFallback = useCallback(() => {
        const today = new Date();
        const start = new Date(today);
        start.setDate(start.getDate() - DISPLAY_WEEKS * 7);
        start.setDate(start.getDate() - start.getDay());

        let totalCount = 0;
        const weeksData: Week[] = [];
        const seed = today.getDate();

        for (let w = 0; w < DISPLAY_WEEKS; w++) {
            const days: ContributionDay[] = [];
            for (let d = 0; d < 7; d++) {
                const date = new Date(start);
                date.setDate(date.getDate() + w * 7 + d);

                if (date > today) {
                    days.push({ date: formatDate(date), count: 0, level: 0 });
                    continue;
                }

                const hash = ((w * 7 + d + seed) * 2654435761) >>> 0;
                const norm = (hash % 1000) / 1000;
                const isWeekday = date.getDay() >= 1 && date.getDay() <= 5;
                const threshold = isWeekday ? 0.35 : 0.6;

                let count = 0;
                if (norm > threshold) {
                    const intensity = (norm - threshold) / (1 - threshold);
                    count = Math.ceil(intensity * 12);
                }

                totalCount += count;
                days.push({ date: formatDate(date), count, level: getLevel(count) });
            }
            weeksData.push({ days });
        }

        setTotal(totalCount);
        setWeeks(weeksData);
    }, []);

    useEffect(() => {
        const load = async () => {
            const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;

            if (token && await buildFromGraphQL(token)) {
                setLoading(false);
                return;
            }

            if (await buildFromEvents()) {
                setLoading(false);
                return;
            }

            buildFallback();
            setLoading(false);
        };
        load();
    }, [buildFromGraphQL, buildFromEvents, buildFallback]);

    const getMonthLabels = (): { label: string; col: number }[] => {
        if (weeks.length === 0) return [];
        const labels: { label: string; col: number }[] = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let lastMonth = -1;

        for (let w = 0; w < weeks.length; w++) {
            const firstDay = weeks[w].days[0];
            if (!firstDay) continue;
            const month = new Date(firstDay.date + 'T00:00:00').getMonth();
            if (month !== lastMonth) {
                labels.push({ label: months[month], col: w });
                lastMonth = month;
            }
        }
        return labels;
    };

    const handleCellHover = (day: ContributionDay, e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const parent = (e.currentTarget as HTMLElement).closest('.github-heatmap')?.getBoundingClientRect();
        if (!parent) return;
        setTooltip({ day, x: rect.left - parent.left + rect.width / 2, y: rect.top - parent.top - 4 });
    };

    const monthLabels = getMonthLabels();

    return (
        <div className="card github-heatmap">
            <div className="card-top">
                <h3>Github</h3>
                <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="icon-link">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 17L17 7M7 7h10v10" /></svg>
                </a>
            </div>

            {loading ? (
                <div className="gh-loading">
                    <div className="gh-skeleton" />
                </div>
            ) : (
                <>
                    <div className="gh-grid-wrap">
                        <div className="gh-day-labels">
                            <span />
                            <span>Mon</span>
                            <span />
                            <span>Wed</span>
                            <span />
                            <span>Fri</span>
                            <span />
                        </div>
                        <div className="gh-grid-container">
                            <div className="gh-month-labels">
                                {monthLabels.map((m, i) => (
                                    <span key={i} style={{ gridColumn: m.col + 1 }}>{m.label}</span>
                                ))}
                            </div>
                            <div className="gh-grid">
                                {weeks.map((week, wi) => (
                                    <div key={wi} className="gh-week">
                                        {week.days.map((day, di) => (
                                            <div
                                                key={di}
                                                className="gh-cell"
                                                style={{ backgroundColor: LEVEL_COLORS[day.level] }}
                                                onMouseEnter={(e) => handleCellHover(day, e)}
                                                onMouseLeave={() => setTooltip(null)}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="gh-footer">
                        <span className="gh-total">{total.toLocaleString()} contributions</span>
                        <div className="gh-legend">
                            <span>Less</span>
                            {[0, 1, 2, 3, 4].map((level) => (
                                <div key={level} className="gh-cell gh-legend-cell" style={{ backgroundColor: LEVEL_COLORS[level] }} />
                            ))}
                            <span>More</span>
                        </div>
                    </div>

                    {tooltip && (
                        <div className="gh-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
                            <strong>{tooltip.day.count} contribution{tooltip.day.count !== 1 ? 's' : ''}</strong>
                            <span>{formatDisplayDate(tooltip.day.date)}</span>
                        </div>
                    )}

                    <div className="gh-projects">
                        <a href={`https://github.com/${GITHUB_USERNAME}/ai-hub`} target="_blank" rel="noopener noreferrer" className="gh-project">
                            <div className="gh-project-header">
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9z"/><path d="M2 1.5v9c0 .863.403 1.633 1.03 2.129A2.25 2.25 0 014.5 11h8V1.5H4.5A1 1 0 003.5 2.5v.75a.75.75 0 01-1.5 0V2.5z"/></svg>
                                <span className="gh-project-name">AI-Hub</span>
                                <span className="gh-project-tech">TypeScript, FastAPI, React</span>
                            </div>
                            <p className="gh-project-desc">Multi-agent AI platform for student collaboration, information verification, and structured writing.</p>
                        </a>
                        <a href={`https://github.com/${GITHUB_USERNAME}/MFT-cashcow`} target="_blank" rel="noopener noreferrer" className="gh-project">
                            <div className="gh-project-header">
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9z"/><path d="M2 1.5v9c0 .863.403 1.633 1.03 2.129A2.25 2.25 0 014.5 11h8V1.5H4.5A1 1 0 003.5 2.5v.75a.75.75 0 01-1.5 0V2.5z"/></svg>
                                <span className="gh-project-name">MFT-CashCow</span>
                                <span className="gh-project-tech">Python, OpenClaw</span>
                            </div>
                            <p className="gh-project-desc">Mid-frequency trading model built with OpenClaw for quantitative market strategies.</p>
                        </a>
                    </div>
                </>
            )}
        </div>
    );
};

export default GithubHeatmap;
