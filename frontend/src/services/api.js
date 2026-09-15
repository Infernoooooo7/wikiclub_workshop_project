import { createMockQuiz } from './mockQuiz'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

/**
 * Requests a generated quiz from the backend, or the local deterministic fixture when mock mode is enabled.
 * @param {import('../types/quiz').QuizConfig} config
 * @returns {Promise<import('../types/quiz').QuizResponse>}
 */
export async function generateQuiz(config) {
  if (USE_MOCK) {
    return createMockQuiz(config)
  }

  const response = await fetch(`${API_BASE_URL}/api/generate-quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  })

  if (!response.ok) {
    let message = `Quiz generation failed (${response.status})`
    try {
      const payload = await response.json()
      message = payload.detail || message
    } catch {
      // Keep the status message when the server did not return JSON.
    }
    throw new Error(message)
  }

  return response.json()
}

export { API_BASE_URL, USE_MOCK }
