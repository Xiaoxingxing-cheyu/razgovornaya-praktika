const punctuation = /[，,。！？；：、,.!?;:“”"'‘’（）()【】\[\]《》〈〉…·—\-\s]/gu;
export function normalizeAnswer(value='') {
  return String(value).normalize('NFKC').trim().replace(/[，,。！？；：、,.!?;:“”"'‘’（）()【】\[\]《》〈〉…·—\-]/gu,'').replace(/\s+/gu,'');
}
export function validateAnswer(answer, acceptedAnswers=[]) {
  const normalized = normalizeAnswer(answer);
  if (!normalized) return false;
  return acceptedAnswers.some(candidate => normalizeAnswer(candidate) === normalized);
}
