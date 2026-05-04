import type { DayType } from '../data/timetable'

interface DayBadgeProps {
    dayType: DayType
    onChange: (d: DayType) => void
}

export const DayBadge = ({ dayType, onChange }: DayBadgeProps) => {
    return (
        <div className="flex gap-[6px] px-4 pt-[10px] pb-[10px]">
            <button
                type="button"
                onClick={() => onChange('weekday')}
                className={`text-[12px] font-medium px-3 py-1 rounded-[6px] cursor-pointer border-none ${
                    dayType === 'weekday'
                        ? 'bg-[#006400] text-white'
                        : 'bg-white/7 text-[#8a9bb5]'
                }`}
            >
                平日
            </button>
            <button
                type="button"
                onClick={() => onChange('holiday')}
                className={`text-[12px] font-medium px-3 py-1 rounded-[6px] cursor-pointer border-none ${
                    dayType === 'holiday'
                        ? 'bg-[#006400] text-white'
                        : 'bg-white/7 text-[#8a9bb5]'
                }`}
            >
                土・休日
            </button>
        </div>
    )
}
