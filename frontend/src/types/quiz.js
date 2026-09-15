/**
 * @typedef {'mcq' | 'boolean'} QuestionType
 * @typedef {'easy' | 'medium' | 'hard'} Difficulty
 *
 * @typedef {Object} QuizConfig
 * @property {string} topic
 * @property {QuestionType} question_type
 * @property {Difficulty} difficulty
 * @property {number} num_questions
 *
 * @typedef {Object} Question
 * @property {number | string} id
 * @property {string} question
 * @property {string[]} options
 * @property {string} correct_answer
 * @property {string} explanation
 *
 * @typedef {Object} QuizResponse
 * @property {string} quiz_id
 * @property {string} topic
 * @property {Question[]} questions
 */

export {}
