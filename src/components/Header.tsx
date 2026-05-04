interface HeaderProps {
    time: string
    date: string
    nextDate: string
    isNextDay: boolean
    hours: number
}

export const Header = ({ time, date, nextDate, isNextDay, hours }: HeaderProps) => {
    const dateDisplay = isNextDay && hours >= 5 ? `${date} → 翌 ${nextDate}` : date

    return (
        <header className="px-4 pt-[14px] pb-[10px] border-b-[0.5px] border-b-white/8">
            <div className="flex justify-between items-start">
                <div>
                    <div className="inline-block bg-[#006400] text-white text-[11px] font-medium px-[7px] py-[2px] rounded mb-1 tracking-[0.03em]">
                        C19
                    </div>
                    <div className="text-white text-2xl font-bold leading-[1.15]">綾瀬</div>
                    <div className="text-[#8a9bb5] text-[11px] mt-0.5">Ayase → Kita-Ayase</div>
                </div>
                <div className="text-right">
                    <time className="block text-white text-[32px] font-light leading-none mb-0.5">
                        {time}
                    </time>
                    <div className="text-[#8a9bb5] text-[11px]">{dateDisplay}</div>
                </div>
            </div>
        </header>
    )
}
