import type { TrackData } from './components/FlipCard'

export const TRACKS: TrackData[] = [
  {
    id: 'neon',
    nameKey: 'tracks.t1.name',
    typeKey: 'tracks.t1.type',
    descKey: 'tracks.t1.desc',
    img: '/images/track-indoor.jpg',
    length: '520 м',
    turns: 11,
  },
  {
    id: 'ring',
    nameKey: 'tracks.t2.name',
    typeKey: 'tracks.t2.type',
    descKey: 'tracks.t2.desc',
    img: '/images/track-outdoor.jpg',
    length: '1100 м',
    turns: 14,
  },
  {
    id: 'drift',
    nameKey: 'tracks.t3.name',
    typeKey: 'tracks.t3.type',
    descKey: 'tracks.t3.desc',
    img: '/images/track-drift.jpg',
    length: '640 м',
    turns: 9,
  },
]

export const IMAGES = {
  hero: '/images/hero.jpg',
  kart: '/images/kart.jpg',
  neonDriver: '/images/real-neon-driver.jpg',
  aerialNight: '/images/real-aerial-night.jpg',
  indoorAction: '/images/real-indoor-action.jpg',
  helmet: '/images/real-helmet.jpg',
}
