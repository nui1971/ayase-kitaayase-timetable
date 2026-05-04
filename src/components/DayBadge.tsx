import type { DayType } from '../data/timetable'

interface DayBadgeProps {
    dayType: DayType
}

const LABELS: Record<DayType, string> = {
    weekday: '平日',
    holiday: '土・休日',
}

export const DayBadge = ({ dayType }: DayBadgeProps) => (
    <div className="px-4 pt-[10px] pb-[10px]">
        <span className="text-[12px] font-medium px-3 py-1 rounded-[6px] bg-[#006400] text-white cursor-default">
            {LABELS[dayType]}
        </span>
    </div>
)
