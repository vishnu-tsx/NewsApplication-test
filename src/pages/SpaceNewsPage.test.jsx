import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SpaceNewsPage } from './SpaceNewsPage'
import * as spaceNewsApi from '../services/spaceNewsApi'

vi.mock('../services/spaceNewsApi')

describe('SpaceNewsPage', () => {
  const mockArticles = [
    {
      id: 1,
      title: 'SpaceX Launches Starship',
      news_site: 'Space.com',
      url: 'https://example.com/spacex',
    },
    {
      id: 2,
      title: 'NASA Mars Rover Discovery',
      news_site: 'NASA.gov',
      url: 'https://example.com/nasa',
    },
    {
      id: 3,
      title: 'SpaceX Dragon Returns to Earth',
      news_site: 'SpaceNews',
      url: 'https://example.com/dragon',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render page title and description', () => {
    render(<SpaceNewsPage />)

    expect(
      screen.getByText('🚀 Spaceflight News Dashboard')
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Discover the latest news from space exploration and science'
      )
    ).toBeInTheDocument()
  })

  it('should show empty state before loading articles', () => {
    render(<SpaceNewsPage />)

    expect(screen.getByText('No Articles Loaded')).toBeInTheDocument()
    expect(
      screen.getByText('Click "Load Articles" to fetch the latest space news')
    ).toBeInTheDocument()
  })

  it('should display load articles button', () => {
    render(<SpaceNewsPage />)

    const loadButton = screen.getByRole('button', { name: /load articles/i })
    expect(loadButton).toBeInTheDocument()
  })

  it('should fetch and display articles when load button is clicked', async () => {
    const user = userEvent.setup()
    spaceNewsApi.fetchSpaceNewsArticles.mockResolvedValue(mockArticles)

    render(<SpaceNewsPage />)

    const loadButton = screen.getByRole('button', { name: /load articles/i })
    await user.click(loadButton)

    await waitFor(() => {
      expect(screen.getByText('SpaceX Launches Starship')).toBeInTheDocument()
      expect(screen.getByText('NASA Mars Rover Discovery')).toBeInTheDocument()
      expect(
        screen.getByText('SpaceX Dragon Returns to Earth')
      ).toBeInTheDocument()
    })

    expect(spaceNewsApi.fetchSpaceNewsArticles).toHaveBeenCalledTimes(1)
  })

  it('should show loading state while fetching articles', async () => {
    const user = userEvent.setup()
    spaceNewsApi.fetchSpaceNewsArticles.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve(mockArticles), 100))
    )

    render(<SpaceNewsPage />)

    const loadButton = screen.getByRole('button', { name: /load articles/i })
    await user.click(loadButton)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(loadButton).toBeDisabled()

    await waitFor(() => {
      expect(screen.getByText('SpaceX Launches Starship')).toBeInTheDocument()
    })
  })

  it('should display error message when API call fails', async () => {
    const user = userEvent.setup()
    spaceNewsApi.fetchSpaceNewsArticles.mockRejectedValue(
      new Error('Network error')
    )

    render(<SpaceNewsPage />)

    const loadButton = screen.getByRole('button', { name: /load articles/i })
    await user.click(loadButton)

    await waitFor(() => {
      expect(
        screen.getByText('Failed to load articles. Please try again.')
      ).toBeInTheDocument()
    })
  })

  it('should show search input after articles are loaded', async () => {
    const user = userEvent.setup()
    spaceNewsApi.fetchSpaceNewsArticles.mockResolvedValue(mockArticles)

    render(<SpaceNewsPage />)

    expect(screen.queryByLabelText(/search/i)).not.toBeInTheDocument()

    const loadButton = screen.getByRole('button', { name: /load articles/i })
    await user.click(loadButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/search/i)).toBeInTheDocument()
    })
  })

  it('should filter articles based on search query', async () => {
    const user = userEvent.setup()
    spaceNewsApi.fetchSpaceNewsArticles.mockResolvedValue(mockArticles)

    render(<SpaceNewsPage />)

    const loadButton = screen.getByRole('button', { name: /load articles/i })
    await user.click(loadButton)

    await waitFor(() => {
      expect(screen.getByText('SpaceX Launches Starship')).toBeInTheDocument()
    })

    const searchInput = screen.getByLabelText(/search/i)
    await user.type(searchInput, 'SpaceX')

    expect(screen.getByText('SpaceX Launches Starship')).toBeInTheDocument()
    expect(
      screen.getByText('SpaceX Dragon Returns to Earth')
    ).toBeInTheDocument()
    expect(
      screen.queryByText('NASA Mars Rover Discovery')
    ).not.toBeInTheDocument()
  })

  it('should show no results state when search has no matches', async () => {
    const user = userEvent.setup()
    spaceNewsApi.fetchSpaceNewsArticles.mockResolvedValue(mockArticles)

    render(<SpaceNewsPage />)

    const loadButton = screen.getByRole('button', { name: /load articles/i })
    await user.click(loadButton)

    await waitFor(() => {
      expect(screen.getByText('SpaceX Launches Starship')).toBeInTheDocument()
    })

    const searchInput = screen.getByLabelText(/search/i)
    await user.type(searchInput, 'Pluto')

    expect(screen.getByText('No Results Found')).toBeInTheDocument()
    expect(
      screen.getByText(
        'No articles match "Pluto". Try a different search term.'
      )
    ).toBeInTheDocument()
  })

  it('should display correct article count', async () => {
    const user = userEvent.setup()
    spaceNewsApi.fetchSpaceNewsArticles.mockResolvedValue(mockArticles)

    render(<SpaceNewsPage />)

    const loadButton = screen.getByRole('button', { name: /load articles/i })
    await user.click(loadButton)

    await waitFor(() => {
      expect(screen.getByText('Showing 3 of 3 articles')).toBeInTheDocument()
    })
  })

  it('should update article count when filtering', async () => {
    const user = userEvent.setup()
    spaceNewsApi.fetchSpaceNewsArticles.mockResolvedValue(mockArticles)

    render(<SpaceNewsPage />)

    const loadButton = screen.getByRole('button', { name: /load articles/i })
    await user.click(loadButton)

    await waitFor(() => {
      expect(screen.getByText('Showing 3 of 3 articles')).toBeInTheDocument()
    })

    const searchInput = screen.getByLabelText(/search/i)
    await user.type(searchInput, 'NASA')

    expect(screen.getByText('Showing 1 of 3 articles')).toBeInTheDocument()
  })

  it('should perform case-insensitive search', async () => {
    const user = userEvent.setup()
    spaceNewsApi.fetchSpaceNewsArticles.mockResolvedValue(mockArticles)

    render(<SpaceNewsPage />)

    const loadButton = screen.getByRole('button', { name: /load articles/i })
    await user.click(loadButton)

    await waitFor(() => {
      expect(screen.getByText('SpaceX Launches Starship')).toBeInTheDocument()
    })

    const searchInput = screen.getByLabelText(/search/i)
    await user.type(searchInput, 'spacex')

    expect(screen.getByText('SpaceX Launches Starship')).toBeInTheDocument()
    expect(
      screen.getByText('SpaceX Dragon Returns to Earth')
    ).toBeInTheDocument()
  })

  // Edge case tests for malformed API responses
  it('should handle articles with missing title gracefully', async () => {
    const user = userEvent.setup()
    const malformedArticles = [
      { id: 1, news_site: 'Test', url: 'https://test.com' },
      ...mockArticles,
    ]
    spaceNewsApi.fetchSpaceNewsArticles.mockResolvedValue(malformedArticles)

    render(<SpaceNewsPage />)
    const loadButton = screen.getByRole('button', { name: /load articles/i })
    await user.click(loadButton)

    await waitFor(() => {
      // Valid articles should be shown
      expect(screen.getByText('SpaceX Launches Starship')).toBeInTheDocument()
    })

    // Should show only 3 valid articles, not 4
    expect(screen.getByText('Showing 3 of 3 articles')).toBeInTheDocument()
  })

  it('should handle articles with missing url gracefully', async () => {
    const user = userEvent.setup()
    const malformedArticles = [
      { id: 1, title: 'Missing URL Article', news_site: 'Test' },
      ...mockArticles,
    ]
    spaceNewsApi.fetchSpaceNewsArticles.mockResolvedValue(malformedArticles)

    render(<SpaceNewsPage />)
    const loadButton = screen.getByRole('button', { name: /load articles/i })
    await user.click(loadButton)

    await waitFor(() => {
      expect(screen.getByText('SpaceX Launches Starship')).toBeInTheDocument()
    })

    // Article without URL should be filtered out
    expect(screen.queryByText('Missing URL Article')).not.toBeInTheDocument()
  })

  it('should handle articles with missing news_site gracefully', async () => {
    const user = userEvent.setup()
    const malformedArticles = [
      { id: 1, title: 'Missing Source Article', url: 'https://test.com' },
      ...mockArticles,
    ]
    spaceNewsApi.fetchSpaceNewsArticles.mockResolvedValue(malformedArticles)

    render(<SpaceNewsPage />)
    const loadButton = screen.getByRole('button', { name: /load articles/i })
    await user.click(loadButton)

    await waitFor(() => {
      expect(screen.getByText('SpaceX Launches Starship')).toBeInTheDocument()
    })

    // Article without news_site should be filtered out
    expect(screen.queryByText('Missing Source Article')).not.toBeInTheDocument()
  })

  it('should handle empty API response', async () => {
    const user = userEvent.setup()
    spaceNewsApi.fetchSpaceNewsArticles.mockResolvedValue([])

    render(<SpaceNewsPage />)
    const loadButton = screen.getByRole('button', { name: /load articles/i })
    await user.click(loadButton)

    await waitFor(() => {
      expect(screen.getByText('No Articles Loaded')).toBeInTheDocument()
    })
  })

  it('should handle null values in article properties', async () => {
    const user = userEvent.setup()
    const malformedArticles = [
      { id: 1, title: null, news_site: 'Test', url: 'https://test.com' },
      ...mockArticles,
    ]
    spaceNewsApi.fetchSpaceNewsArticles.mockResolvedValue(malformedArticles)

    render(<SpaceNewsPage />)
    const loadButton = screen.getByRole('button', { name: /load articles/i })
    await user.click(loadButton)

    await waitFor(() => {
      expect(screen.getByText('SpaceX Launches Starship')).toBeInTheDocument()
    })

    // Should still show valid articles
    expect(screen.getByText('Showing 3 of 3 articles')).toBeInTheDocument()
  })

  it('should handle articles with undefined properties', async () => {
    const user = userEvent.setup()
    const malformedArticles = [
      {
        id: undefined,
        title: 'No ID Article',
        news_site: 'Test',
        url: 'https://test.com',
      },
      ...mockArticles,
    ]
    spaceNewsApi.fetchSpaceNewsArticles.mockResolvedValue(malformedArticles)

    render(<SpaceNewsPage />)
    const loadButton = screen.getByRole('button', { name: /load articles/i })
    await user.click(loadButton)

    await waitFor(() => {
      expect(screen.getByText('SpaceX Launches Starship')).toBeInTheDocument()
    })

    // Article without id should be filtered out
    expect(screen.queryByText('No ID Article')).not.toBeInTheDocument()
  })
})
