import { describe, it, expect } from 'vitest'
import { filterTrains } from '../hooks/useTrains'
import type { Train } from '../data/timetable'

const makeDate = (hour: number, minute: number): Date => {
    const d = new Date()
    d.setHours(hour, minute, 0, 0)
    return d
}

const trains: Train[] = [
    { hour: 10, minute: 0,  platform: 0, trainType: '普通' },
    { hour: 10, minute: 15, platform: 3, trainType: '普通' },
    { hour: 10, minute: 30, platform: 0, trainType: '普通' },
    { hour: 10, minute: 45, platform: 4, trainType: '普通' },
    { hour: 11, minute: 0,  platform: 3, trainType: '普通' },
    { hour: 11, minute: 30, platform: 0, trainType: '急行' },
    { hour: 12, minute: 0,  platform: 4, trainType: '普通' },
]

describe('filterTrains', () => {
    it('現在時刻より後の列車のみ抽出されること', () => {
        const { upcomingList } = filterTrains(trains, makeDate(10, 10))
        // 10:10 より後 → 10:15, 10:30, 10:45, 11:00, 11:30（上位5本）
        expect(upcomingList.every(t => t.hour * 60 + t.minute > 610)).toBe(true)
    })

    it('nextP0: platform===0 の次の列車が返ること', () => {
        const { nextP0 } = filterTrains(trains, makeDate(10, 10))
        expect(nextP0).toMatchObject({ hour: 10, minute: 30, platform: 0 })
    })

    it('nextP34: platform===3 の次の列車が返ること', () => {
        const { nextP34 } = filterTrains(trains, makeDate(10, 10))
        expect(nextP34).toMatchObject({ hour: 10, minute: 15, platform: 3 })
    })

    it('nextP34: platform===4 の次の列車も返ること', () => {
        // 10:20 時点では 10:15(3番線) は過ぎているので 10:45(4番線) が次
        const { nextP34 } = filterTrains(trains, makeDate(10, 20))
        expect(nextP34).toMatchObject({ hour: 10, minute: 45, platform: 4 })
    })

    it('upcomingList: 上位5本が返ること', () => {
        const { upcomingList } = filterTrains(trains, makeDate(9, 0))
        expect(upcomingList).toHaveLength(5)
    })

    it('終電後（残り0本）: nextP0・nextP34 が null になること', () => {
        const { nextP0, nextP34, upcomingList } = filterTrains(trains, makeDate(23, 0))
        expect(nextP0).toBeNull()
        expect(nextP34).toBeNull()
        expect(upcomingList).toHaveLength(0)
    })
})
