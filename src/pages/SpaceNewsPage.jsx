import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { ArticleCard } from '../components/ArticleCard'
import { SearchInput } from '../components/SearchInput'
import { fetchSpaceNewsArticles } from '../services/spaceNewsApi'

const pageContainerClasses =
  'min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'

const contentContainerClasses = 'container mx-auto px-4 py-8'

const headerContainerClasses = 'text-center mb-12'

const titleClasses = 'text-4xl md:text-5xl font-bold text-gray-900 mb-4'

const subtitleClasses = 'text-lg text-gray-600'

const controlsContainerClasses =
  'flex flex-col md:flex-row gap-4 items-center justify-center mb-8'

const getLoadButtonClasses = (isLoading) =>
  clsx(
    'px-6 py-3 rounded-lg font-semibold text-white',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    isLoading
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 active:scale-95'
  )

const errorContainerClasses =
  'max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-4 mb-8'

const errorTextClasses = 'text-red-800 text-center'

const articlesGridClasses =
  'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'

const resultsCountClasses = 'text-center text-gray-600 mt-8'

const emptyStateContainerClasses = 'text-center py-16'

const emptyStateIconClasses = 'text-6xl mb-4'

const emptyStateTitleClasses = 'text-2xl font-semibold text-gray-700 mb-2'

const emptyStateTextClasses = 'text-gray-500'

/**
 * Main dashboard page for browsing and searching spaceflight news articles.
 * Manages article loading, error states, and real-time search filtering.
 * @returns {JSX.Element} SpaceNewsPage component
 */
export const SpaceNewsPage = () => {
  const [articles, setArticles] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleClickLoadArticles = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const fetchedArticles = await fetchSpaceNewsArticles()

      // Validate response is an array
      if (!Array.isArray(fetchedArticles)) {
        throw new Error('Invalid API response: expected array')
      }

      // Filter out invalid articles
      const validArticles = fetchedArticles.filter(
        (article) =>
          article?.id && article?.title && article?.url && article?.news_site
      )

      setArticles(validArticles)
    } catch (error) {
      setErrorMessage('Failed to load articles. Please try again.')
      // TODO: Consider using a centralized logging service for production error tracking
      console.error('Error loading articles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOnChangeSearchQuery = (newSearchQuery) => {
    setSearchQuery(newSearchQuery)
  }

  const filteredArticles = useMemo(
    () =>
      articles.filter((article) => {
        // Defensive check for title existence
        const title = article?.title ?? ''
        return title.toLowerCase().includes(searchQuery.toLowerCase())
      }),
    [articles, searchQuery]
  )

  const shouldShowEmptyState =
    !isLoading && articles.length === 0 && !errorMessage
  const shouldShowNoResults =
    !isLoading && articles.length > 0 && filteredArticles.length === 0

  return (
    <div className={pageContainerClasses}>
      <div className={contentContainerClasses}>
        {/* Header */}
        <header className={headerContainerClasses}>
          <h1 className={titleClasses}>🚀 Spaceflight News Dashboard</h1>
          <p className={subtitleClasses}>
            Discover the latest news from space exploration and science
          </p>
        </header>

        {/* Controls */}
        <div className={controlsContainerClasses}>
          <button
            onClick={handleClickLoadArticles}
            disabled={isLoading}
            className={getLoadButtonClasses(isLoading)}
            aria-label={isLoading ? 'Loading articles' : 'Load articles'}
          >
            {isLoading ? 'Loading...' : 'Load Articles'}
          </button>

          {articles.length > 0 && (
            <SearchInput
              value={searchQuery}
              onChange={handleOnChangeSearchQuery}
              placeholder="Search by title..."
            />
          )}
        </div>

        {/* Error State */}
        {errorMessage && (
          <div className={errorContainerClasses} role="alert">
            <p className={errorTextClasses}>{errorMessage}</p>
          </div>
        )}

        {/* Empty State */}
        {shouldShowEmptyState && <EmptyState />}

        {/* No Results State */}
        {shouldShowNoResults && <NoResultsState searchQuery={searchQuery} />}

        {/* Articles Grid */}
        {!isLoading && filteredArticles.length > 0 && (
          <div className={articlesGridClasses}>
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                source={article.news_site}
                url={article.url}
              />
            ))}
          </div>
        )}

        {/* Results Count */}
        {!isLoading && filteredArticles.length > 0 && (
          <p className={resultsCountClasses}>
            Showing {filteredArticles.length} of {articles.length} articles
          </p>
        )}
      </div>
    </div>
  )
}

const EmptyState = () => (
  <div className={emptyStateContainerClasses}>
    <div className={emptyStateIconClasses}>📰</div>
    <h2 className={emptyStateTitleClasses}>No Articles Loaded</h2>
    <p className={emptyStateTextClasses}>
      Click "Load Articles" to fetch the latest space news
    </p>
  </div>
)

const NoResultsState = ({ searchQuery }) => (
  <div className={emptyStateContainerClasses}>
    <div className={emptyStateIconClasses}>🔍</div>
    <h2 className={emptyStateTitleClasses}>No Results Found</h2>
    <p className={emptyStateTextClasses}>
      No articles match "{searchQuery}". Try a different search term.
    </p>
  </div>
)

NoResultsState.propTypes = {
  searchQuery: PropTypes.string.isRequired,
}
