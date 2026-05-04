import { describe, it, expect } from 'vitest'
import { getDayType } from '../hooks/useDayType'

describe('getDayType', () => {
    // 2026-05-11（月）、2026-05-08（金）、2026-05-09（土）、2026-05-10（日）
    const holidays = new Set<string>(['2026-05-03', '2026-05-04', '2026-05-05'])

    it('月曜日は weekday を返す', () => {
        expect(getDayType(new Date(2026, 4, 11), new Set())).toBe('weekday')
    })

    it('金曜日は weekday を返す', () => {
        expect(getDayType(new Date(2026, 4, 8), new Set())).toBe('weekday')
    })

    it('土曜日は holiday を返す', () => {
        expect(getDayType(new Date(2026, 4, 9), new Set())).toBe('holiday')
    })

    it('日曜日は holiday を返す', () => {
        expect(getDayType(new Date(2026, 4, 10), new Set())).toBe('holiday')
    })

    it('祝日（holidays に含まれる平日）は holiday を返す', () => {
        // 2026-05-04（月）はみどりの日
        expect(getDayType(new Date(2026, 4, 4), holidays)).toBe('holiday')
    })

    it('平日（holidays に含まれない日）は weekday を返す', () => {
        // 2026-05-01（金）は平日
        expect(getDayType(new Date(2026, 4, 1), holidays)).toBe('weekday')
    })
})
