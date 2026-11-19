export function attemptGuidance(wrongCount) {
  if (wrongCount <= 1) return { kind: 'retry' };
  if (wrongCount <= 4) return { kind: 'hint', level: wrongCount - 1 };
  return { kind: 'pending', hintsUsed: 3 };
}
