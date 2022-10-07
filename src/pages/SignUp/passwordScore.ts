export function getPasswordScore(password: string) {
  let score = 0
  if (!password) return score

  // Award every unique letter until 5 repetitions.
  const letters: {
    [key: string]: number
  } = {}
  for (let i = 0; i < password.length; i++) {
    letters[password[i]] = (letters[password[i]] || 0) + 1
    score += 5.0 / letters[password[i]]
  }

  // Bonus points for mixing it up.
  const variations = [
    /\d/.test(password), // digits
    /[a-z]/.test(password), // lower
    /[A-Z]/.test(password), // upper
    /\W/.test(password), // nonWords
  ]

  let variationCount = 0
  for (const variation of variations) {
    variationCount += variation ? 1 : 0
  }
  score += (variationCount - 1) * 10

  return Math.floor(score)
}

export function getPasswordRating(password: string) {
  const score = getPasswordScore(password)
  if (score > 80) return 'strong'
  if (score > 60) return 'good'
  if (score > 30) return 'weak'
  return 'poop'
}
