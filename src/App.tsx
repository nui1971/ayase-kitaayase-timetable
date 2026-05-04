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
    const { dayType, setDayType } = useDayType(now)

    const trains = timetable[dayType]
    const { nextP0, nextP34, upcomingList } = useTrains(trains, now)

    const nowMin = now.getHours() * 60 + now.getMinutes()
    const time = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`
    const date = `${now.getFullYear()}/${pad2(now.getMonth() + 1)}/${pad2(now.getDate())} (${WEEKDAYS[now.getDay()]})`

    const p0RemainMin  = nextP0  !== null ? nextP0.hour  * 60 + nextP0.minute  - nowMin : null
    const p34RemainMin = nextP34 !== null ? nextP34.hour * 60 + nextP34.minute - nowMin : null

    return (
        <div
            className="flex flex-col min-h-dvh w-full max-w-[390px] mx-auto bg-[#0d1526]"
            style={{ fontFamily: 'sans-serif' }}
        >
            <Header time={time} date={date} />
            <DayBadge dayType={dayType} onChange={setDayType} />

            <div className="px-3 pt-[10px] flex-1">
                <div className="text-[10px] font-medium text-[#4a6580] tracking-[0.06em] mt-2 mb-[6px]">
                    ホーム別 次の列車
                </div>
                <TrackCard platform={0} train={nextP0} remainMin={p0RemainMin} />
                <TrackCard platform={3} train={nextP34} remainMin={p34RemainMin} />
                <TrainList trains={upcomingList} nowMin={nowMin} />
            </div>

            <Footer />
        </div>
    )
}

export default App
