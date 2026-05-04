import { describe, it, expect } from 'vitest'
import { filterTrains, getServiceDay, getNextDayType } from '../hooks/useTrains'
import type { Train, Timetable } from '../data/timetable'

const makeDate = (hour: number, minute: number): Date => {
    const d = new Date()
    d.setHours(hour, minute, 0, 0)
    return d
}

// 曜日を固定した Date を作成（テストのフレーキネス防止）
const makeDateOn = (year: number, month: number, day: number, hour: number, minute: number): Date =>
    new Date(year, month - 1, day, hour, minute, 0, 0)

// 通常時テスト用（10:00〜12:00の列車）
const weekdayTrains: Train[] = [
    { hour: 10, minute: 0,  platform: 0, trainType: '普通' },
    { hour: 10, minute: 15, platform: 3, trainType: '普通' },
    { hour: 10, minute: 30, platform: 0, trainType: '普通' },
    { hour: 10, minute: 45, platform: 4, trainType: '普通' },
    { hour: 11, minute: 0,  platform: 3, trainType: '普通' },
    { hour: 11, minute: 30, platform: 0, trainType: '急行' },
    { hour: 12, minute: 0,  platform: 4, trainType: '普通' },
]

const holidayTrains: Train[] = [
    { hour: 5,  minute: 0,  platform: 0, trainType: '普通' },
    { hour: 5,  minute: 15, platform: 3, trainType: '普通' },
]

const baseTimetable: Timetable = { weekday: weekdayTrains, holiday: holidayTrains }

// 終電後切替テスト用（weekday=平日始発・holiday=休日始発で区別しやすくする）
const switchTimetable: Timetable = {
    weekday: [{ hour: 6, minute: 0, platform: 0, trainType: '普通' }],
    holiday: [{ hour: 8, minute: 0, platform: 0, trainType: '普通' }],
}

describe('filterTrains - 通常時', () => {
    it('現在時刻より後の列車のみ抽出されること', () => {
        const { upcomingList } = filterTrains(baseTimetable, 'weekday', makeDate(10, 10))
        // 10:10 より後 → 10:15, 10:30, 10:45, 11:00, 11:30（上位5本）
        expect(upcomingList.every(t => t.hour * 60 + t.minute > 610)).toBe(true)
    })

    it('nextP0: platform===0 の次の列車が返ること', () => {
        const { nextP0 } = filterTrains(baseTimetable, 'weekday', makeDate(10, 10))
        expect(nextP0).toMatchObject({ hour: 10, minute: 30, platform: 0 })
    })

    it('nextP34: platform===3 の次の列車が返ること', () => {
        const { nextP34 } = filterTrains(baseTimetable, 'weekday', makeDate(10, 10))
        expect(nextP34).toMatchObject({ hour: 10, minute: 15, platform: 3 })
    })

    it('nextP34: platform===4 の次の列車も返ること', () => {
        // 10:20 時点では 10:15(3番線) は過ぎているので 10:45(4番線) が次
        const { nextP34 } = filterTrains(baseTimetable, 'weekday', makeDate(10, 20))
        expect(nextP34).toMatchObject({ hour: 10, minute: 45, platform: 4 })
    })

    it('upcomingList: 上位5本が返ること', () => {
        const { upcomingList } = filterTrains(baseTimetable, 'weekday', makeDate(9, 0))
        expect(upcomingList).toHaveLength(5)
    })

    it('通常時: isNextDay === false が返ること', () => {
        const { isNextDay } = filterTrains(baseTimetable, 'weekday', makeDate(10, 10))
        expect(isNextDay).toBe(false)
    })
})

describe('filterTrains - 終電後（翌日ダイヤ切替）', () => {
    it('終電後（平日→平日）: 翌日平日ダイヤが適用されること', () => {
        // 2026-05-12（火）23:50 → 翌日（水）= 平日 → weekday（6:00始発）
        const now = makeDateOn(2026, 5, 12, 23, 50)
        const { isNextDay, nextDayType, nextP0 } = filterTrains(switchTimetable, 'weekday', now)
        expect(isNextDay).toBe(true)
        expect(nextDayType).toBe('weekday')
        expect(nextP0).toMatchObject({ hour: 6, minute: 0 })
    })

    it('終電後（金曜）: 翌日土曜→土休日ダイヤが適用されること', () => {
        // 2026-05-15（金）23:50 → 翌日（土）= 休日 → holiday（8:00始発）
        const now = makeDateOn(2026, 5, 15, 23, 50)
        const { isNextDay, nextDayType, nextP0 } = filterTrains(switchTimetable, 'weekday', now)
        expect(isNextDay).toBe(true)
        expect(nextDayType).toBe('holiday')
        expect(nextP0).toMatchObject({ hour: 8, minute: 0 })
    })

    it('終電後（日曜）: 翌日月曜→平日ダイヤが適用されること', () => {
        // 2026-05-10（日）23:50 → 翌日（月）= 平日 → weekday（6:00始発）
        const now = makeDateOn(2026, 5, 10, 23, 50)
        const { isNextDay, nextDayType, nextP0 } = filterTrains(switchTimetable, 'holiday', now)
        expect(isNextDay).toBe(true)
        expect(nextDayType).toBe('weekday')
        expect(nextP0).toMatchObject({ hour: 6, minute: 0 })
    })

    it('終電後: isNextDay === true が返ること', () => {
        const now = makeDateOn(2026, 5, 15, 23, 50)
        const { isNextDay } = filterTrains(switchTimetable, 'weekday', now)
        expect(isNextDay).toBe(true)
    })

    it('当日・翌日とも列車なし: nextP0・nextP34 が null になること', () => {
        const emptyTimetable: Timetable = { weekday: [], holiday: [] }
        const { nextP0, nextP34 } = filterTrains(emptyTimetable, 'weekday', makeDate(12, 0))
        expect(nextP0).toBeNull()
        expect(nextP34).toBeNull()
    })
})

describe('filterTrains - 深夜（hours＜5）', () => {
    it('深夜0時（hours<5）: 0:45 の列車が残っていれば前日ダイヤが継続されること', () => {
        const nightTimetable: Timetable = {
            weekday: [{ hour: 0, minute: 45, platform: 0, trainType: '普通' }],
            holiday: [],
        }
        const { isNextDay, nextP0 } = filterTrains(nightTimetable, 'weekday', makeDate(0, 30))
        expect(isNextDay).toBe(false)
        expect(nextP0).toMatchObject({ hour: 0, minute: 45 })
    })
})

describe('getServiceDay', () => {
    it('5時以降は当日のまま返す', () => {
        // 金曜10:00 → 5（金）
        expect(getServiceDay(makeDateOn(2026, 5, 15, 10, 0))).toBe(5)
    })

    it('0〜4時台は前日を返す', () => {
        // 土曜00:30（日曜の0時台）→ 土曜（6）
        expect(getServiceDay(makeDateOn(2026, 5, 10, 0, 30))).toBe(6)  // 日→土
    })
})

describe('getNextDayType', () => {
    it('金曜（5）の翌日は土休日', () => {
        expect(getNextDayType(5)).toBe('holiday')
    })

    it('日曜（0）の翌日は平日', () => {
        expect(getNextDayType(0)).toBe('weekday')
    })

    it('土曜（6）の翌日は土休日', () => {
        // 土曜→日曜（0）= 休日
        expect(getNextDayType(6)).toBe('holiday')
    })

    it('火曜（2）の翌日は平日', () => {
        expect(getNextDayType(2)).toBe('weekday')
    })
})
