import { timetable } from './data/timetable'
import { Header } from './components/Header'
import { DayBadge } from './components/DayBadge'
import { TrackCard } from './components/TrackCard'
import { TrainList } from './components/TrainList'
import { Footer } from './components/Footer'
import { useCurrentTime } from './hooks/useCurrentTime'
import { useDayType } from './hooks/useDayType'
import { useTrains } from './hooks/useTrains'
import { pad2 } from './utils/formatTime'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

function App() {
    const now = useCurrentTime()
    const { dayType } = useDayType(now)

    const { nextP0, nextP34, upcomingList, isNextDay, nextDayType } = useTrains(timetable, dayType, now)
    const displayDayType = isNextDay ? nextDayType : dayType

    const hours = now.getHours()
    const nowMin = hours * 60 + now.getMinutes()
    const time = `${pad2(hours)}:${pad2(now.getMinutes())}`
    const date = `${now.getFullYear()}/${pad2(now.getMonth() + 1)}/${pad2(now.getDate())} (${WEEKDAYS[now.getDay()]})`

    const nextDayRaw = new Date(now)
    nextDayRaw.setDate(nextDayRaw.getDate() + 1)
    const nextDate = `${pad2(nextDayRaw.getMonth() + 1)}/${pad2(nextDayRaw.getDate())} (${WEEKDAYS[nextDayRaw.getDay()]})`

    const calcRemainMin = (train: typeof nextP0) => {
        if (train === null) return null
        const trainMin = train.hour * 60 + train.minute
        return isNextDay ? 1440 - nowMin + trainMin : trainMin - nowMin
    }

    return (
        <div
            className="flex flex-col min-h-dvh w-full max-w-[390px] mx-auto bg-[#0d1526]"
            style={{ fontFamily: 'sans-serif' }}
        >
            <Header time={time} date={date} nextDate={nextDate} isNextDay={isNextDay} hours={hours} />
            <DayBadge dayType={displayDayType} />

            <div className="px-3 pt-[10px] flex-1">
                <div className="text-[10px] font-medium text-[#4a6580] tracking-[0.06em] mt-2 mb-[6px]">
                    ホーム別 次の列車
                </div>
                <TrackCard platform={0} train={nextP0} remainMin={calcRemainMin(nextP0)} />
                <TrackCard platform={3} train={nextP34} remainMin={calcRemainMin(nextP34)} />
                <TrainList trains={upcomingList} nowMin={nowMin} />
            </div>

            <Footer />
        </div>
    )
}

export default App
