import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArticleCard } from './ArticleCard'

describe('ArticleCard', () => {
  const mockArticle = {
    title: 'SpaceX Launches New Satellite',
    source: 'Space.com',
    url: 'https://example.com/article',
  }

  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render article title', () => {
    render(<ArticleCard {...mockArticle} />)

    const title = screen.getByText('SpaceX Launches New Satellite')
    expect(title).toBeInTheDocument()
  })

  it('should render article source', () => {
    render(<ArticleCard {...mockArticle} />)

    const source = screen.getByText(/Space\.com/)
    expect(source).toBeInTheDocument()
  })

  it('should render link with correct href', () => {
    render(<ArticleCard {...mockArticle} />)

    const link = screen.getByRole('link', { name: /read full article/i })
    expect(link).toHaveAttribute('href', 'https://example.com/article')
  })

  it('should open link in new tab', () => {
    render(<ArticleCard {...mockArticle} />)

    const link = screen.getByRole('link', { name: /read full article/i })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should have proper accessibility attributes on link', () => {
    render(<ArticleCard {...mockArticle} />)

    const link = screen.getByLabelText(
      'Read full article: SpaceX Launches New Satellite'
    )
    expect(link).toBeInTheDocument()
  })

  it('should render as an article element', () => {
    render(<ArticleCard {...mockArticle} />)

    const article = screen.getByRole('article')
    expect(article).toBeInTheDocument()
  })

  it('should handle long titles', () => {
    const longTitleArticle = {
      ...mockArticle,
      title:
        'This is a very long article title that should be truncated properly when displayed in the card component',
    }

    render(<ArticleCard {...longTitleArticle} />)

    const title = screen.getByText(longTitleArticle.title)
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('line-clamp-2')
  })

  it('should display source label', () => {
    render(<ArticleCard {...mockArticle} />)

    const sourceLabel = screen.getByText('Source:')
    expect(sourceLabel).toBeInTheDocument()
  })

  // Edge case tests for invalid/missing props
  it('should handle missing title gracefully', () => {
    const invalidArticle = { ...mockArticle, title: '' }
    const { container } = render(<ArticleCard {...invalidArticle} />)
    expect(container.firstChild).toBeNull()
  })

  it('should handle missing source gracefully', () => {
    const invalidArticle = { ...mockArticle, source: '' }
    const { container } = render(<ArticleCard {...invalidArticle} />)
    expect(container.firstChild).toBeNull()
  })

  it('should handle missing url gracefully', () => {
    const invalidArticle = { ...mockArticle, url: '' }
    const { container } = render(<ArticleCard {...invalidArticle} />)
    expect(container.firstChild).toBeNull()
  })

  it('should handle undefined props gracefully', () => {
    const invalidArticle = {
      title: undefined,
      source: undefined,
      url: undefined,
    }
    const { container } = render(<ArticleCard {...invalidArticle} />)
    expect(container.firstChild).toBeNull()
  })

  it('should handle invalid URL gracefully', () => {
    const invalidArticle = { ...mockArticle, url: 'not-a-url' }
    const { container } = render(<ArticleCard {...invalidArticle} />)
    expect(container.firstChild).toBeNull()
  })

  it('should handle malformed URL gracefully', () => {
    const invalidArticle = { ...mockArticle, url: 'javascript:alert(1)' }
    const { container } = render(<ArticleCard {...invalidArticle} />)
    // javascript: URLs are technically valid URLs but the component should still render
    expect(container.firstChild).toBeInTheDocument()
  })
})
