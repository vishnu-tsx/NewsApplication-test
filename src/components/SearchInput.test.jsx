import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('should render search input with label', () => {
    const mockOnChange = vi.fn()
    render(<SearchInput value="" onChange={mockOnChange} />)

    const label = screen.getByText('Search Articles')
    const input = screen.getByLabelText('Search Articles')

    expect(label).toBeInTheDocument()
    expect(input).toBeInTheDocument()
  })

  it('should display the provided value', () => {
    const mockOnChange = vi.fn()
    render(<SearchInput value="SpaceX" onChange={mockOnChange} />)

    const input = screen.getByDisplayValue('SpaceX')
    expect(input).toBeInTheDocument()
  })

  it('should call onChange when user types', async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()
    render(<SearchInput value="" onChange={mockOnChange} />)

    const input = screen.getByLabelText('Search Articles')
    await user.type(input, 'N')

    expect(mockOnChange).toHaveBeenCalledWith('N')
    expect(mockOnChange).toHaveBeenCalledTimes(1)
  })

  it('should display custom placeholder when provided', () => {
    const mockOnChange = vi.fn()
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        placeholder="Find articles..."
      />
    )

    const input = screen.getByPlaceholderText('Find articles...')
    expect(input).toBeInTheDocument()
  })

  it('should display default placeholder when not provided', () => {
    const mockOnChange = vi.fn()
    render(<SearchInput value="" onChange={mockOnChange} />)

    const input = screen.getByPlaceholderText('Search by title...')
    expect(input).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    const mockOnChange = vi.fn()
    render(<SearchInput value="" onChange={mockOnChange} />)

    const input = screen.getByRole('textbox', {
      name: /search articles/i,
    })

    expect(input).toHaveAttribute('id', 'search-articles')
    expect(input).toBeInTheDocument()
  })

  it('should handle multiple rapid changes', async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()
    render(<SearchInput value="" onChange={mockOnChange} />)

    const input = screen.getByLabelText('Search Articles')

    await user.type(input, 'Spa')

    expect(mockOnChange).toHaveBeenCalledTimes(3)
    expect(mockOnChange).toHaveBeenNthCalledWith(1, 'S')
    expect(mockOnChange).toHaveBeenNthCalledWith(2, 'p')
    expect(mockOnChange).toHaveBeenNthCalledWith(3, 'a')
  })
})
