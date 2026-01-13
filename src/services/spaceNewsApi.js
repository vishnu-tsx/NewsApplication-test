const API_BASE_URL = 'https://api.spaceflightnewsapi.net/v4/articles/'

/**
 * Fetches articles from the Spaceflight News API
 * @returns {Promise<Array<{id: number, title: string, url: string, news_site: string}>>} Array of article objects, or empty array on error
 */
export const fetchSpaceNewsArticles = async () => {
  try {
    const response = await globalThis.fetch(API_BASE_URL)

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`)
      return []
    }

    const data = await response.json()

    if (!data || typeof data !== 'object' || !Array.isArray(data.results)) {
      return []
    }

    return data.results
  } catch (error) {
    console.error('Error fetching space news articles:', error)
    return []
  }
}
