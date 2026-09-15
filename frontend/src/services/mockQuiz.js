const questionBank = [
  {
    question: 'Which idea best captures the role of a wiki in a learning workflow?',
    options: [
      'A private notebook with no links',
      'A shared knowledge space that can evolve over time',
      'A one-time presentation deck',
      'A search engine for unrelated facts',
    ],
    correct_answer: 'A shared knowledge space that can evolve over time',
    explanation: 'Wikis are collaborative knowledge bases: their value comes from connected, editable information that improves over time.',
  },
  {
    question: 'What is the most useful first step when researching a new topic?',
    options: [
      'Collect every available fact',
      'Define the question you want to answer',
      'Avoid primary sources',
      'Write the conclusion first',
    ],
    correct_answer: 'Define the question you want to answer',
    explanation: 'A clear question gives research a boundary, making it easier to judge what is relevant and when the answer is strong enough.',
  },
  {
    question: 'True or false: A good explanation should make the reader do more work than necessary.',
    options: ['True', 'False'],
    correct_answer: 'False',
    explanation: 'Good explanations reduce unnecessary cognitive load while preserving the important nuance and evidence.',
  },
  {
    question: 'Which signal is strongest when evaluating a factual claim?',
    options: [
      'How often it appears in a feed',
      'Whether it agrees with your first impression',
      'A credible source with transparent evidence',
      'The length of the paragraph containing it',
    ],
    correct_answer: 'A credible source with transparent evidence',
    explanation: 'Source quality and inspectable evidence are more meaningful than popularity, intuition, or presentation length.',
  },
  {
    question: 'True or false: Linking related ideas can help reveal patterns in a body of knowledge.',
    options: ['True', 'False'],
    correct_answer: 'True',
    explanation: 'Connections between ideas make relationships visible, which helps learners compare, recall, and extend what they know.',
  },
]

/** @param {import('../types/quiz').QuizConfig} config */
export function createMockQuiz(config) {
  const questions = Array.from({ length: config.num_questions }, (_, index) => {
    const source = questionBank[index % questionBank.length]
    const options = config.question_type === 'boolean'
      ? ['True', 'False']
      : source.options

    return {
      id: `${config.topic.toLowerCase().replace(/\W+/g, '-')}-${index + 1}`,
      question: `${source.question}${index > questionBank.length - 1 ? ` (Part ${index + 1})` : ''}`,
      options,
      correct_answer: options.includes(source.correct_answer) ? source.correct_answer : options[0],
      explanation: source.explanation,
    }
  })

  return Promise.resolve({
    quiz_id: `mock-${Date.now()}`,
    topic: config.topic,
    questions,
  })
}
