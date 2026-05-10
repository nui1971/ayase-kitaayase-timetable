import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TrackCard } from '../components/TrackCard'
import type { Train } from '../data/timetable'

const train0: Train = { hour: 10, minute: 0,  platform: 0, trainType: '普通' }
const train3: Train = { hour: 10, minute: 15, platform: 3, trainType: '普通' }
const train4: Train = { hour: 10, minute: 30, platform: 4, trainType: '普通' }

describe('TrackCard - 次の列車ラベル', () => {
    it('platform 0: 「次の列車」（番線なし）が表示されること', () => {
        render(<TrackCard platform={0} train={train0} remainMin={5} />)
        expect(screen.getByText('次の列車')).toBeInTheDocument()
        expect(screen.queryByText('次の列車（3・4番線）')).toBeNull()
    })

    it('platform 3: 「次の列車（3・4番線）」が表示されること', () => {
        render(<TrackCard platform={3} train={train3} remainMin={20} />)
        expect(screen.getByText('次の列車（3・4番線）')).toBeInTheDocument()
    })

    it('platform 4: 「次の列車（3・4番線）」が表示されること', () => {
        render(<TrackCard platform={4} train={train4} remainMin={35} />)
        expect(screen.getByText('次の列車（3・4番線）')).toBeInTheDocument()
    })

    it('train=null: 「次の列車」（番線なし）が表示されること', () => {
        render(<TrackCard platform={3} train={null} remainMin={null} />)
        expect(screen.getByText('次の列車')).toBeInTheDocument()
        expect(screen.queryByText('次の列車（3・4番線）')).toBeNull()
    })
})

describe('TrackCard - 終電済み表示', () => {
    it('train=null: 「終電済」が表示されること', () => {
        render(<TrackCard platform={0} train={null} remainMin={null} />)
        expect(screen.getByText('終電済')).toBeInTheDocument()
    })
})
