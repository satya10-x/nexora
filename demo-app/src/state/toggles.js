const DEFAULT_MUTATIONS = Object.freeze({
  idRename: false,
  labelChange: false,
  classChange: false,
  wrapperChange: false,
  positionSwap: false,
  removeTestIds: false,
});

const DEFAULT_BUGS = Object.freeze({
  bugNoErrorOnWrongPassword: false,
  bugNoEmailValidation: false,
  bugBrokenForgotLink: false,
  bugNoRedirectAfterLogin: false,
  bugWrongErrorText: false,
});

const KNOWN_MUTATION_KEYS = Object.keys(DEFAULT_MUTATIONS);
const KNOWN_BUG_KEYS = Object.keys(DEFAULT_BUGS);

// In-memory global state
const state = {
  mutations: { ...DEFAULT_MUTATIONS },
  bugs: { ...DEFAULT_BUGS },
  version: 1,
};

/**
 * Returns a clone of current toggle state.
 */
export const getState = () => ({
  mutations: { ...state.mutations },
  bugs: { ...state.bugs },
  version: state.version,
});

/**
 * Validates and merges mutation updates.
 * @param {Record<string, boolean>} updates
 * @returns {ReturnType<typeof getState>}
 */
export const updateMutations = (updates) => {
  if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
    throw new Error('Payload must be a JSON object with mutation keys');
  }

  const keys = Object.keys(updates);
  if (keys.length === 0) {
    throw new Error('Payload must contain at least one mutation key');
  }

  for (const key of keys) {
    if (!KNOWN_MUTATION_KEYS.includes(key)) {
      throw new Error(`Unknown mutation key: "${key}". Allowed keys: ${KNOWN_MUTATION_KEYS.join(', ')}`);
    }
    if (typeof updates[key] !== 'boolean') {
      throw new Error(`Value for "${key}" must be a boolean (true or false)`);
    }
  }

  for (const key of keys) {
    state.mutations[key] = updates[key];
  }

  state.version += 1;
  return getState();
};

/**
 * Validates and merges bug updates.
 * @param {Record<string, boolean>} updates
 * @returns {ReturnType<typeof getState>}
 */
export const updateBugs = (updates) => {
  if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
    throw new Error('Payload must be a JSON object with bug keys');
  }

  const keys = Object.keys(updates);
  if (keys.length === 0) {
    throw new Error('Payload must contain at least one bug key');
  }

  for (const key of keys) {
    if (!KNOWN_BUG_KEYS.includes(key)) {
      throw new Error(`Unknown bug key: "${key}". Allowed keys: ${KNOWN_BUG_KEYS.join(', ')}`);
    }
    if (typeof updates[key] !== 'boolean') {
      throw new Error(`Value for "${key}" must be a boolean (true or false)`);
    }
  }

  for (const key of keys) {
    state.bugs[key] = updates[key];
  }

  state.version += 1;
  return getState();
};

/**
 * Resets all mutations and bugs to false.
 * @returns {ReturnType<typeof getState>}
 */
export const resetToggles = () => {
  state.mutations = { ...DEFAULT_MUTATIONS };
  state.bugs = { ...DEFAULT_BUGS };
  state.version += 1;
  return getState();
};

/**
 * Resets mutations, applies random mutations (and optionally 1 bug), and returns applied set.
 * @param {{ count?: number, includeBugs?: boolean }} options
 * @returns {{ applied: { mutations: string[], bugs: string[] }, state: ReturnType<typeof getState> }}
 */
export const randomizeToggles = ({ count = 2, includeBugs = false } = {}) => {
  let parsedCount = Number.isInteger(count) ? count : 2;
  parsedCount = Math.max(1, Math.min(parsedCount, KNOWN_MUTATION_KEYS.length));

  // Reset mutations first
  state.mutations = { ...DEFAULT_MUTATIONS };

  // Shuffle and pick mutation keys
  const shuffledMutations = [...KNOWN_MUTATION_KEYS].sort(() => 0.5 - Math.random());
  const appliedMutations = shuffledMutations.slice(0, parsedCount);
  for (const key of appliedMutations) {
    state.mutations[key] = true;
  }

  // Handle bugs
  const appliedBugs = [];
  if (includeBugs) {
    state.bugs = { ...DEFAULT_BUGS };
    const shuffledBugs = [...KNOWN_BUG_KEYS].sort(() => 0.5 - Math.random());
    const randomBug = shuffledBugs[0];
    state.bugs[randomBug] = true;
    appliedBugs.push(randomBug);
  } else {
    state.bugs = { ...DEFAULT_BUGS };
  }

  state.version += 1;

  return {
    applied: {
      mutations: appliedMutations,
      bugs: appliedBugs,
    },
    state: getState(),
  };
};

export default {
  getState,
  updateMutations,
  updateBugs,
  resetToggles,
  randomizeToggles,
};

