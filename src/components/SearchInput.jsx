import PropTypes from 'prop-types'
import clsx from 'clsx'

const containerClasses = 'w-full max-w-md'

const labelClasses = 'block text-sm font-medium text-gray-700 mb-2'

const inputClasses = clsx(
  'w-full px-4 py-2 border border-gray-300 rounded-lg',
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  'placeholder-gray-400 text-gray-900',
  'transition duration-200'
)

/**
 * Controlled search input component for filtering articles.
 * @param {Object} props - Component props
 * @param {string} props.value - Current search query value
 * @param {Function} props.onChange - Callback receiving new search value
 * @param {string} [props.placeholder='Search by title...'] - Input placeholder text
 * @returns {JSX.Element} Search input component
 */
export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search by title...',
}) => {
  const handleOnChangeSearchQuery = (event) => {
    onChange(event.target.value)
  }

  return (
    <div className={containerClasses}>
      <label htmlFor="search-articles" className={labelClasses}>
        Search Articles
      </label>
      <input
        id="search-articles"
        type="text"
        value={value}
        onChange={handleOnChangeSearchQuery}
        placeholder={placeholder}
        className={inputClasses}
      />
    </div>
  )
}

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
}
