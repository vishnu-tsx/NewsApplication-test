const API_BASE_URL = 'https://api.spaceflightnewsapi.net/v4/articles/'

/**
 * Fetches space news articles from Spaceflight News API.
 * @returns {Promise<Array<{id: number, title: string, url: string, news_site: string}>>} Array of article objects
 * @throws {Error} When API request fails or returns invalid data
 */
export const fetchSpaceNewsArticles = async () => {
  try {
    const response = await fetch(API_BASE_URL)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const newsData = await response.json()

    // Validate response structure
    if (!newsData || typeof newsData !== 'object') {
      throw new Error('Invalid API response: expected object')
    }

    if (!Array.isArray(newsData.results)) {
      throw new Error('Invalid API response: results must be an array')
    }

    return newsData.results
  } catch (error) {
    // TODO: Consider using a centralized logging service for production error tracking
    console.error('Error fetching space news articles:', error)
    throw error
  }
}
