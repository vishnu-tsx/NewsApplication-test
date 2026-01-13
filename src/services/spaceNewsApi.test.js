import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetchSpaceNewsArticles } from './spaceNewsApi'

describe('spaceNewsApi', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('fetchSpaceNewsArticles', () => {
    it('should fetch and return articles successfully', async () => {
      const mockArticles = [
        {
          id: 1,
          title: 'SpaceX Launch',
          url: 'https://example.com/article1',
          news_site: 'Space.com',
        },
        {
          id: 2,
          title: 'NASA Discovery',
          url: 'https://example.com/article2',
          news_site: 'NASA.gov',
        },
      ]

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ results: mockArticles }),
        })
      )

      const articles = await fetchSpaceNewsArticles()

      expect(fetch).toHaveBeenCalledWith(
        'https://api.spaceflightnewsapi.net/v4/articles/'
      )
      expect(articles).toEqual(mockArticles)
      expect(articles).toHaveLength(2)
    })

    it('should return empty array when API response is not ok', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        })
      )

      const articles = await fetchSpaceNewsArticles()

      expect(articles).toEqual([])
      expect(console.error).toHaveBeenCalledWith('HTTP error! status: 404')
    })

    it('should return empty array on network errors', async () => {
      globalThis.fetch = vi.fn(() => Promise.reject(new Error('Network error')))

      const articles = await fetchSpaceNewsArticles()

      expect(articles).toEqual([])
      expect(console.error).toHaveBeenCalled()
    })

    it('should return empty array when results is undefined', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        })
      )

      const articles = await fetchSpaceNewsArticles()

      expect(articles).toEqual([])
    })

    it('should return empty array when results is not an array', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ results: 'not an array' }),
        })
      )

      const articles = await fetchSpaceNewsArticles()

      expect(articles).toEqual([])
    })
  })
})
