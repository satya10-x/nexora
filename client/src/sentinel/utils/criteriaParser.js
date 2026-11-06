/**
 * Deterministic, rule-based Acceptance Criteria Parser for SentinelQA.
 * Converts human-written requirements into structured Given/When/Then scenarios
 * preserving clause-bound And associations (givenAnd, whenAnd, thenAnd).
 *
 * NOTE: Non-LLM, rule-based lexer designed to provide predictable structural output
 * without hallucinating missing conditions.
 */

// Clause regex patterns
const GIVEN_REGEX = /^\s*given[:\s]+(.*)$/i;
const WHEN_REGEX = /^\s*when[:\s]+(.*)$/i;
const THEN_REGEX = /^\s*then[:\s]+(.*)$/i;
const AND_REGEX = /^\s*and[:\s]+(.*)$/i;
const SCENARIO_REGEX = /^\s*(?:scenario|criteria|rule|test case)?\s*(?:\d+[\.\):]|\:)?\s*(.*)$/i;

/**
 * Parses an inline single-sentence criteria (e.g. "Given X, when Y, then Z").
 * @param {string} text
 * @returns {object|null}
 */
const parseInlineCriteria = (text, scenarioId = 'crit-1') => {
  const inlinePattern = /given\s+([^,;]+?)(?:,\s*|\s+)?(?:and\s+([^,;]+?)(?:,\s*|\s+)?)?when\s+([^,;]+?)(?:,\s*|\s+)?(?:and\s+([^,;]+?)(?:,\s*|\s+)?)?then\s+([^.;\n]+?)(?:,\s*|\s+)?(?:and\s+([^.;\n]+?))?[.;]?$/i;
  const match = text.match(inlinePattern);

  if (match) {
    const given = match[1]?.trim() || null;
    const givenAnd = match[2] ? [match[2].trim()] : [];
    const when = match[3]?.trim() || null;
    const whenAnd = match[4] ? [match[4].trim()] : [];
    const then = match[5]?.trim() || null;
    const thenAnd = match[6] ? [match[6].trim()] : [];

    return {
      scenarioId,
      title: 'Inline Criteria Scenario',
      given,
      givenAnd,
      when,
      whenAnd,
      then,
      thenAnd,
      raw: text.trim(),
      parsingStatus: 'parsed',
      confidence: 1.0,
    };
  }

  // Check for relaxed inline presence of Given, When, Then
  const lower = text.toLowerCase();
  const givenIdx = lower.indexOf('given ');
  const whenIdx = lower.indexOf('when ');
  const thenIdx = lower.indexOf('then ');

  if (givenIdx !== -1 && whenIdx !== -1 && thenIdx !== -1 && givenIdx < whenIdx && whenIdx < thenIdx) {
    const givenPart = text.substring(givenIdx + 6, whenIdx).replace(/[,;]\s*$/, '').trim();
    const whenPart = text.substring(whenIdx + 5, thenIdx).replace(/[,;]\s*$/, '').trim();
    const thenPart = text.substring(thenIdx + 5).replace(/[\.;]\s*$/, '').trim();

    return {
      scenarioId,
      title: 'Structured Scenario',
      given: givenPart || null,
      givenAnd: [],
      when: whenPart || null,
      whenAnd: [],
      then: thenPart || null,
      thenAnd: [],
      raw: text.trim(),
      parsingStatus: givenPart && whenPart && thenPart ? 'parsed' : 'partial',
      confidence: givenPart && whenPart && thenPart ? 0.95 : 0.6,
    };
  }

  return null;
};

/**
 * Splits multiline criteria into logical scenario blocks.
 * @param {string} rawText
 * @returns {string[][]} Array of line blocks
 */
const splitIntoBlocks = (rawText) => {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return [];

  const blocks = [];
  let currentBlock = [];

  for (const line of lines) {
    const isScenarioStart =
      /^(?:scenario|criteria|case)\s*(?:\d+)?\s*:/i.test(line) ||
      /^#+\s*(?:scenario|criteria)/i.test(line) ||
      /^\d+[\.\)]\s+given/i.test(line);

    if (isScenarioStart && currentBlock.length > 0) {
      blocks.push(currentBlock);
      currentBlock = [];
    }
    currentBlock.push(line);
  }

  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  return blocks;
};

/**
 * Parses a single block of lines into a structured scenario object.
 * @param {string[]} lines
 * @param {number} index
 * @returns {object}
 */
const parseBlock = (lines, index) => {
  const scenarioId = `crit-${index + 1}`;
  const raw = lines.join('\n');

  let title = `Scenario ${index + 1}`;
  let given = null;
  const givenAnd = [];
  let when = null;
  const whenAnd = [];
  let then = null;
  const thenAnd = [];

  let currentTarget = null; // 'given', 'when', or 'then'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for explicit scenario title
    const scenarioMatch = line.match(/^(?:scenario|criteria|case)\s*(?:\d+)?\s*:\s*(.*)$/i);
    if (scenarioMatch) {
      title = scenarioMatch[1].trim() || title;
      continue;
    }

    // Check for Given
    const givenMatch = line.match(GIVEN_REGEX);
    if (givenMatch) {
      given = givenMatch[1].trim();
      currentTarget = 'given';
      continue;
    }

    // Check for When
    const whenMatch = line.match(WHEN_REGEX);
    if (whenMatch) {
      when = whenMatch[1].trim();
      currentTarget = 'when';
      continue;
    }

    // Check for Then
    const thenMatch = line.match(THEN_REGEX);
    if (thenMatch) {
      then = thenMatch[1].trim();
      currentTarget = 'then';
      continue;
    }

    // Check for And clauses attached to current target
    const andMatch = line.match(AND_REGEX);
    if (andMatch) {
      const andContent = andMatch[1].trim();
      if (currentTarget === 'given') {
        givenAnd.push(andContent);
      } else if (currentTarget === 'when') {
        whenAnd.push(andContent);
      } else if (currentTarget === 'then') {
        thenAnd.push(andContent);
      }
      continue;
    }

    // Check for single line inline criteria inside the block
    if (i === 0 && lines.length === 1) {
      const inlineResult = parseInlineCriteria(line, scenarioId);
      if (inlineResult) {
        return inlineResult;
      }
    }
  }

  // Determine status and confidence score
  const hasGiven = Boolean(given);
  const hasWhen = Boolean(when);
  const hasThen = Boolean(then);

  let parsingStatus = 'unrecognized';
  let confidence = 0.0;

  if (hasGiven && hasWhen && hasThen) {
    parsingStatus = 'parsed';
    confidence = 1.0;
  } else if ((hasGiven && hasWhen) || (hasWhen && hasThen) || (hasGiven && hasThen)) {
    parsingStatus = 'partial';
    confidence = 0.65;
  } else if (hasGiven || hasWhen || hasThen) {
    parsingStatus = 'partial';
    confidence = 0.35;
  } else {
    // Graceful fallback for unstructured human notes without inventing missing conditions
    parsingStatus = 'unrecognized';
    confidence = 0.0;
  }

  return {
    scenarioId,
    title,
    given,
    givenAnd,
    when,
    whenAnd,
    then,
    thenAnd,
    raw,
    parsingStatus,
    confidence,
  };
};

/**
 * Main Criteria Parser entrypoint.
 * Converts raw human text into structured scenarios.
 *
 * @param {string} rawCriteriaText - Raw input text from ticket or criteria editor
 * @returns {{ success: boolean, rawText: string, totalScenarios: number, scenarios: Array }}
 */
export const parseAcceptanceCriteria = (rawCriteriaText = '') => {
  if (!rawCriteriaText || typeof rawCriteriaText !== 'string' || !rawCriteriaText.trim()) {
    return {
      success: true,
      rawText: '',
      totalScenarios: 0,
      parsingStatus: 'empty',
      confidenceScore: 0,
      scenarios: [],
    };
  }

  const raw = rawCriteriaText.trim();

  // First, check if entire input is a single-sentence inline criteria
  const singleLineInline = parseInlineCriteria(raw);
  if (singleLineInline && !raw.includes('\n')) {
    return {
      success: true,
      rawText: raw,
      totalScenarios: 1,
      parsingStatus: singleLineInline.parsingStatus === 'parsed' ? 'complete' : 'partial',
      confidenceScore: Math.round((singleLineInline.confidence || 0) * 100),
      scenarios: [singleLineInline],
    };
  }

  // Otherwise, split into multiline blocks
  const blocks = splitIntoBlocks(raw);
  if (blocks.length === 0) {
    return {
      success: true,
      rawText: raw,
      totalScenarios: 0,
      parsingStatus: 'empty',
      confidenceScore: 0,
      scenarios: [],
    };
  }

  const scenarios = blocks.map((blockLines, index) => parseBlock(blockLines, index));

  const allParsed = scenarios.length > 0 && scenarios.every((s) => s.parsingStatus === 'parsed');
  const anyParsed = scenarios.some((s) => s.parsingStatus === 'parsed' || s.parsingStatus === 'partial');
  const avgConfidence = scenarios.length > 0
    ? scenarios.reduce((acc, s) => acc + (s.confidence || 0), 0) / scenarios.length
    : 0;

  const parsingStatus = scenarios.length === 0 ? 'empty' : allParsed ? 'complete' : anyParsed ? 'partial' : 'unrecognized';
  const confidenceScore = Math.round(avgConfidence * 100);

  return {
    success: true,
    rawText: raw,
    totalScenarios: scenarios.length,
    parsingStatus,
    confidenceScore,
    scenarios,
  };
};

export default {
  parseAcceptanceCriteria,
};
