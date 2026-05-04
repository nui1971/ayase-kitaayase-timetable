import { describe, it, expect } from 'vitest'
import { pad2, formatTime, formatRemain } from '../utils/formatTime'

describe('pad2', () => {
    it('1桁の数値を0埋め2桁にする', () => {
        expect(pad2(5)).toBe('05')
    })

    it('2桁の数値はそのまま返す', () => {
        expect(pad2(12)).toBe('12')
    })
})

describe('formatTime', () => {
    it('時・分をHH:MM形式にする', () => {
        expect(formatTime(8, 5)).toBe('08:05')
    })

    it('23:59 を正しくフォーマットする', () => {
        expect(formatTime(23, 59)).toBe('23:59')
    })
})

describe('formatRemain', () => {
    it('0分は "0分" を返す', () => {
        expect(formatRemain(0)).toBe('0分')
    })

    it('6分は "6分" を返す', () => {
        expect(formatRemain(6)).toBe('6分')
    })

    it('59分は "59分" を返す', () => {
        expect(formatRemain(59)).toBe('59分')
    })

    it('60分は "1時間" を返す', () => {
        expect(formatRemain(60)).toBe('1時間')
    })

    it('61分は "1時間1分" を返す', () => {
        expect(formatRemain(61)).toBe('1時間1分')
    })

    it('90分は "1時間30分" を返す', () => {
        expect(formatRemain(90)).toBe('1時間30分')
    })

    it('120分は "2時間" を返す', () => {
        expect(formatRemain(120)).toBe('2時間')
    })
})
