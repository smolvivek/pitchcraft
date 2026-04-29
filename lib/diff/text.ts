// Word-level diff using Myers diff algorithm (LCS-based).
// Moth's note: capped at MAX_WORDS per field — beyond that, performance degrades.
// For pitches this is never an issue in practice (synopses rarely exceed 500 words).

const MAX_WORDS = 800

export type DiffToken =
  | { type: 'equal'; text: string }
  | { type: 'add'; text: string }
  | { type: 'remove'; text: string }

// Tokenise into words + whitespace runs, preserving spaces so rejoining is lossless.
function tokenise(text: string): string[] {
  return text.split(/(\s+)/).filter((t) => t.length > 0)
}

// Standard LCS-based diff (O(n*m) — fine for MAX_WORDS).
function lcs(a: string[], b: string[]): number[][] {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }
  return dp
}

function backtrack(dp: number[][], a: string[], b: string[], i: number, j: number): DiffToken[] {
  if (i === 0 && j === 0) return []
  if (i === 0) return [...backtrack(dp, a, b, 0, j - 1), { type: 'add', text: b[j - 1] }]
  if (j === 0) return [...backtrack(dp, a, b, i - 1, 0), { type: 'remove', text: a[i - 1] }]
  if (a[i - 1] === b[j - 1]) return [...backtrack(dp, a, b, i - 1, j - 1), { type: 'equal', text: a[i - 1] }]
  if (dp[i - 1][j] >= dp[i][j - 1]) return [...backtrack(dp, a, b, i - 1, j), { type: 'remove', text: a[i - 1] }]
  return [...backtrack(dp, a, b, i, j - 1), { type: 'add', text: b[j - 1] }]
}

export function diffText(before: string, after: string): DiffToken[] {
  const a = tokenise(before).slice(0, MAX_WORDS)
  const b = tokenise(after).slice(0, MAX_WORDS)
  if (a.length === 0 && b.length === 0) return []
  if (a.length === 0) return b.map((t) => ({ type: 'add', text: t }))
  if (b.length === 0) return a.map((t) => ({ type: 'remove', text: t }))
  const dp = lcs(a, b)
  return backtrack(dp, a, b, a.length, b.length)
}

export function hasChanges(tokens: DiffToken[]): boolean {
  return tokens.some((t) => t.type !== 'equal')
}
