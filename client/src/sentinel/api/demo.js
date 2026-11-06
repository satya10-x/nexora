import { parseAcceptanceCriteria } from '../utils/criteriaParser.js'

const KEYS = {
  projects: 'sentinelqa_demo_projects_v1',
  tickets: 'sentinelqa_demo_tickets_v1',
  user: 'sentinelqa_demo_user_v1',
  session: 'sentinelqa_demo_session_v1',
}

const memory = new Map()

const readRaw = (key) => {
  try {
    const value = window.localStorage.getItem(key)
    return value
  } catch {
    return memory.get(key) ?? null
  }
}

const writeRaw = (key, value) => {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    memory.set(key, value)
  }
}

const removeRaw = (key) => {
  try {
    window.localStorage.removeItem(key)
  } catch {
    memory.delete(key)
  }
}

const readJson = (key, fallback) => {
  const raw = readRaw(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

const writeJson = (key, value) => writeRaw(key, JSON.stringify(value))

const uid = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`

const iso = (value) => new Date(value).toISOString()

const daysAgo = (days) => iso(Date.now() - days * 24 * 60 * 60 * 1000)

const seedProjects = [
  {
    _id: 'prj_shopease',
    name: 'ShopEase Storefront',
    targetUrl: 'http://localhost:4000',
    description:
      'Core authentication, cart and checkout journeys for the ShopEase demo commerce application.',
    status: 'active',
    createdAt: daysAgo(24),
    updatedAt: daysAgo(2),
  },
  {
    _id: 'prj_nexora',
    name: 'Nexora Control Plane',
    targetUrl: 'https://app.nexora.dev',
    description: 'Smoke and regression coverage for the autonomous delivery console.',
    status: 'active',
    createdAt: daysAgo(17),
    updatedAt: daysAgo(1),
  },
  {
    _id: 'prj_atlas',
    name: 'Atlas Admin Portal',
    targetUrl: 'https://admin.atlas.io',
    description: 'Role-based access, audit logging and permission boundaries for internal admins.',
    status: 'active',
    createdAt: daysAgo(11),
    updatedAt: daysAgo(4),
  },
]

const seedTicketInputs = [
  {
    _id: 'tkt_auth_101',
    title: 'AUTH-101 · Standard user login flow',
    project: 'prj_shopease',
    severity: 'critical',
    priority: 'high',
    status: 'open',
    acceptanceCriteria: `Scenario: Valid credentials sign in
Given user navigates to "/login"
And user enters valid demo credentials
When user clicks "#login-btn"
Then user is redirected to "/dashboard"
And session cookie "session_id" is set`,
    expectedResult: 'User lands on the dashboard with an authenticated session cookie.',
    actualResult: '',
    reproductionSteps: ['Open http://localhost:4000/login', 'Enter demo credentials', 'Click the Sign in button'],
    createdAt: daysAgo(9),
    updatedAt: daysAgo(9),
  },
  {
    _id: 'tkt_checkout_204',
    title: 'CHK-204 · Guest checkout with saved card',
    project: 'prj_shopease',
    severity: 'high',
    priority: 'high',
    status: 'in_progress',
    acceptanceCriteria: `Scenario: Guest completes checkout
Given user has one item in the cart
And user is not signed in
When user checks out with a saved card
Then order confirmation is shown
And cart is emptied`,
    expectedResult: 'Checkout completes and the cart count returns to zero.',
    actualResult: 'Cart badge occasionally remains at one after order confirmation.',
    reproductionSteps: ['Add an item to cart', 'Proceed as guest', 'Pay with saved card'],
    createdAt: daysAgo(7),
    updatedAt: daysAgo(1),
  },
  {
    _id: 'tkt_session_118',
    title: 'SET-118 · SSO session refresh',
    project: 'prj_shopease',
    severity: 'medium',
    priority: 'medium',
    status: 'resolved',
    acceptanceCriteria: `Given the user has an active SSO session
When the access token expires
Then the session refreshes silently
And the user remains on the current page`,
    expectedResult: 'Session refresh completes without interrupting the user.',
    actualResult: '',
    reproductionSteps: ['Sign in with SSO', 'Wait for token expiry', 'Navigate to billing'],
    createdAt: daysAgo(15),
    updatedAt: daysAgo(6),
  },
  {
    _id: 'tkt_audit_309',
    title: 'ADM-309 · Audit log export permissions',
    project: 'prj_atlas',
    severity: 'critical',
    priority: 'high',
    status: 'open',
    acceptanceCriteria: `Scenario: Auditor exports the audit log
Given the user has the "auditor" role
When the user exports the last 30 days of audit events
Then a CSV download starts
And the export is recorded in the audit trail`,
    expectedResult: 'Auditor receives a CSV and the export is logged.',
    actualResult: '',
    reproductionSteps: ['Sign in as auditor', 'Open Audit Log', 'Choose Export CSV'],
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    _id: 'tkt_role_312',
    title: 'ADM-312 · Deny viewer role mutations',
    project: 'prj_atlas',
    severity: 'high',
    priority: 'medium',
    status: 'in_progress',
    acceptanceCriteria: `Given the user has the "viewer" role
When the user submits a role change request
Then the request is rejected with 403
And no audit mutation is committed`,
    expectedResult: 'Viewer cannot mutate roles or permissions.',
    actualResult: '',
    reproductionSteps: ['Sign in as viewer', 'Open Members', 'Attempt to promote a teammate'],
    createdAt: daysAgo(3),
    updatedAt: daysAgo(2),
  },
  {
    _id: 'tkt_agent_402',
    title: 'NEX-402 · Agent run rollback',
    project: 'prj_nexora',
    severity: 'low',
    priority: 'low',
    status: 'closed',
    acceptanceCriteria: `Given an agent run completed successfully
When the operator requests a rollback
Then the deployment returns to the previous revision
And a rollback event is emitted`,
    expectedResult: 'Rollback completes and the previous revision is live.',
    actualResult: '',
    reproductionSteps: ['Open a completed run', 'Select Rollback', 'Confirm'],
    createdAt: daysAgo(12),
    updatedAt: daysAgo(8),
  },
  {
    _id: 'tkt_run_406',
    title: 'NEX-406 · Parallel run isolation',
    project: 'prj_nexora',
    severity: 'medium',
    priority: 'medium',
    status: 'resolved',
    acceptanceCriteria: `Given two agent runs are executing
When both write to the same workspace
Then each run keeps an isolated sandbox
And artifacts never collide`,
    expectedResult: 'Parallel runs remain isolated with unique artifact paths.',
    actualResult: '',
    reproductionSteps: ['Start two runs', 'Inspect artifact paths', 'Compare workspace snapshots'],
    createdAt: daysAgo(10),
    updatedAt: daysAgo(3),
  },
]

const seed = () => {
  const existingProjects = readJson(KEYS.projects, null)
  if (existingProjects === null) writeJson(KEYS.projects, seedProjects)

  const existingTickets = readJson(KEYS.tickets, null)
  if (existingTickets === null) {
    const tickets = seedTicketInputs.map((ticket) => {
      const parsed = parseAcceptanceCriteria(ticket.acceptanceCriteria)
      return {
        ...ticket,
        parsedCriteria: parsed.scenarios || [],
        createdBy: 'usr_demo',
      }
    })
    writeJson(KEYS.tickets, tickets)
  }
}

const projects = () => {
  seed()
  return readJson(KEYS.projects, [])
}

const tickets = () => {
  seed()
  return readJson(KEYS.tickets, [])
}

const saveProjects = (value) => writeJson(KEYS.projects, value)
const saveTickets = (value) => writeJson(KEYS.tickets, value)

const fail = (status, message) => {
  const error = new Error(message)
  error.response = { status, data: { success: false, message } }
  throw error
}

const requireSession = () => {
  if (readRaw(KEYS.session) !== '1') {
    fail(401, 'Authentication required. Please sign in to continue.')
  }
}

const currentUser = () => readJson(KEYS.user, null)

const projectView = (project, allTickets = tickets()) => {
  const scoped = allTickets.filter((ticket) => ticket.project === project._id)
  return {
    ...project,
    id: project._id,
    ticketCount: scoped.length,
    openTicketsCount: scoped.filter((ticket) => ['open', 'in_progress'].includes(ticket.status)).length,
    resolvedTicketsCount: scoped.filter((ticket) => ['resolved', 'closed'].includes(ticket.status)).length,
  }
}

const projectBrief = (id) => {
  const project = projects().find((item) => item._id === id)
  if (!project) return id
  return {
    _id: project._id,
    id: project._id,
    name: project.name,
    targetUrl: project.targetUrl,
    status: project.status,
    owner: 'usr_demo',
  }
}

const ticketView = (ticket) => ({
  ...ticket,
  id: ticket._id,
  project: projectBrief(ticket.project),
})

const matches = (value, query) => String(value || '').toLowerCase().includes(String(query || '').toLowerCase())

const paginate = (list, params = {}) => {
  const page = Math.max(1, Number.parseInt(params.page, 10) || 1)
  const limit = Math.max(1, Math.min(100, Number.parseInt(params.limit, 10) || 10))
  const total = list.length
  const totalPages = Math.ceil(total / limit) || 1
  const slice = list.slice((page - 1) * limit, page * limit)
  return { page, total, totalPages, items: slice }
}

const filterTickets = (list, params = {}) => {
  let result = [...list]

  if (params.projectId && params.projectId !== 'all') {
    result = result.filter((ticket) => ticket.project === params.projectId)
  }
  if (params.status && params.status !== 'all') {
    result = result.filter((ticket) => ticket.status === params.status)
  }
  if (params.severity && params.severity !== 'all') {
    result = result.filter((ticket) => ticket.severity === params.severity)
  }
  if (params.priority && params.priority !== 'all') {
    result = result.filter((ticket) => ticket.priority === params.priority)
  }
  if (params.search) {
    result = result.filter(
      (ticket) => matches(ticket.title, params.search) || matches(ticket.description, params.search),
    )
  }

  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

const metricsFor = (projectId) => {
  const scoped = tickets().filter((ticket) => ticket.project === projectId)
  return {
    total: scoped.length,
    open: scoped.filter((ticket) => ticket.status === 'open').length,
    in_progress: scoped.filter((ticket) => ticket.status === 'in_progress').length,
    resolved: scoped.filter((ticket) => ticket.status === 'resolved').length,
    closed: scoped.filter((ticket) => ticket.status === 'closed').length,
    critical: scoped.filter((ticket) => ticket.severity === 'critical').length,
    high: scoped.filter((ticket) => ticket.severity === 'high').length,
  }
}

const health = () => ({
  success: true,
  service: 'SentinelQA Demo Runtime',
  uptime: 18240,
  timestamp: new Date().toISOString(),
  db: 'demo',
  mode: 'demo',
  integrations: { groq: false, jira: false },
})

const handle = (method, url, config = {}) => {
  const path = String(url || '').split('?')[0]
  const params = config.params || {}
  const body = config.data || {}

  if (path === '/health' && method === 'get') {
    return health()
  }

  if (path === '/auth/me' && method === 'get') {
    requireSession()
    const user = currentUser()
    if (!user) fail(401, 'Authentication required. Please sign in to continue.')
    return { success: true, user }
  }

  if (path === '/auth/login' && method === 'post') {
    if (!body.email || !body.password) fail(400, 'Email and password are required.')
    const email = String(body.email).toLowerCase().trim()
    const user = {
      id: 'usr_demo',
      name: email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) || 'Demo Engineer',
      email,
    }
    writeJson(KEYS.user, user)
    writeRaw(KEYS.session, '1')
    return { success: true, message: 'Signed in successfully', user }
  }

  if (path === '/auth/register' && method === 'post') {
    if (!body.name || body.name.trim().length < 2) fail(400, 'Name is required and must be at least 2 characters.')
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) fail(400, 'A valid email address is required.')
    if (!body.password || body.password.length < 6) fail(400, 'Password must be at least 6 characters long.')
    const user = { id: 'usr_demo', name: body.name.trim(), email: body.email.toLowerCase().trim() }
    writeJson(KEYS.user, user)
    writeRaw(KEYS.session, '1')
    return { success: true, message: 'Account created successfully', user }
  }

  if (path === '/auth/logout' && method === 'post') {
    removeRaw(KEYS.user)
    removeRaw(KEYS.session)
    return { success: true, message: 'Signed out successfully' }
  }

  if (path === '/tickets/parse-criteria' && method === 'post') {
    const result = parseAcceptanceCriteria(typeof body.criteria === 'string' ? body.criteria : '')
    return { success: true, ...result }
  }

  requireSession()

  if (path === '/projects' && method === 'get') {
    let list = projects()
    if (params.status && params.status !== 'all') list = list.filter((project) => project.status === params.status)
    if (params.search) list = list.filter((project) => matches(project.name, params.search))
    list = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    const allTickets = tickets()
    return {
      success: true,
      count: list.length,
      projects: list.map((project) => projectView(project, allTickets)),
    }
  }

  if (path === '/projects' && method === 'post') {
    if (!body.name || body.name.trim().length < 2) fail(400, 'Project name is required and must be at least 2 characters.')
    if (!body.targetUrl) fail(400, 'A valid target URL is required.')
    const project = {
      _id: uid('prj'),
      name: body.name.trim(),
      description: body.description ? body.description.trim() : '',
      targetUrl: body.targetUrl.trim(),
      status: body.status === 'archived' ? 'archived' : 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    saveProjects([...projects(), project])
    return { success: true, message: 'Project created successfully', project: projectView(project) }
  }

  const projectTicketsMatch = path.match(/^\/projects\/([^/]+)\/tickets$/)
  if (projectTicketsMatch) {
    const projectId = projectTicketsMatch[1]
    const project = projects().find((item) => item._id === projectId)
    if (!project) fail(404, 'Project not found or access denied.')

    if (method === 'post') {
      if (!body.title || body.title.trim().length < 3) fail(400, 'Ticket title is required and must be at least 3 characters.')
      const parsed = parseAcceptanceCriteria(body.acceptanceCriteria || '')
      const ticket = {
        _id: uid('tkt'),
        title: body.title.trim(),
        description: body.description || '',
        project: projectId,
        acceptanceCriteria: body.acceptanceCriteria || '',
        parsedCriteria: parsed.scenarios || [],
        severity: ['critical', 'high', 'medium', 'low'].includes(body.severity) ? body.severity : 'medium',
        priority: ['high', 'medium', 'low'].includes(body.priority) ? body.priority : 'medium',
        status: ['open', 'in_progress', 'resolved', 'closed'].includes(body.status) ? body.status : 'open',
        expectedResult: body.expectedResult || '',
        actualResult: body.actualResult || '',
        reproductionSteps: Array.isArray(body.reproductionSteps)
          ? body.reproductionSteps
          : String(body.reproductionSteps || '')
              .split('\n')
              .map((step) => step.trim())
              .filter(Boolean),
        createdBy: 'usr_demo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      saveTickets([...tickets(), ticket])
      return { success: true, message: 'Ticket created successfully', ticket: ticketView(ticket) }
    }

    if (method === 'get') {
      const filtered = filterTickets(tickets().filter((ticket) => ticket.project === projectId), params)
      const page = paginate(filtered, params)
      return {
        success: true,
        count: page.items.length,
        total: page.total,
        page: page.page,
        totalPages: page.totalPages,
        tickets: page.items.map(ticketView),
      }
    }
  }

  const projectMatch = path.match(/^\/projects\/([^/]+)$/)
  if (projectMatch) {
    const projectId = projectMatch[1]
    const list = projects()
    const project = list.find((item) => item._id === projectId)
    if (!project) fail(404, 'Project not found or access denied.')

    if (method === 'get') {
      return { success: true, project: projectView(project), metrics: metricsFor(projectId) }
    }

    if (method === 'patch') {
      const updated = {
        ...project,
        name: body.name !== undefined ? String(body.name).trim() : project.name,
        description: body.description !== undefined ? String(body.description).trim() : project.description,
        targetUrl: body.targetUrl !== undefined ? String(body.targetUrl).trim() : project.targetUrl,
        status: ['active', 'archived'].includes(body.status) ? body.status : project.status,
        updatedAt: new Date().toISOString(),
      }
      saveProjects(list.map((item) => (item._id === projectId ? updated : item)))
      return { success: true, message: 'Project updated successfully', project: projectView(updated) }
    }

    if (method === 'delete') {
      saveProjects(list.filter((item) => item._id !== projectId))
      saveTickets(tickets().filter((ticket) => ticket.project !== projectId))
      return { success: true, message: 'Project and all associated tickets deleted successfully.', deletedProjectId: projectId }
    }
  }

  if (path === '/tickets' && method === 'get') {
    const filtered = filterTickets(tickets(), params)
    const page = paginate(filtered, params)
    return {
      success: true,
      count: page.items.length,
      total: page.total,
      page: page.page,
      totalPages: page.totalPages,
      tickets: page.items.map(ticketView),
    }
  }

  const ticketMatch = path.match(/^\/tickets\/([^/]+)$/)
  if (ticketMatch) {
    const ticketId = ticketMatch[1]
    const list = tickets()
    const ticket = list.find((item) => item._id === ticketId)
    if (!ticket) fail(404, 'Ticket not found or access denied.')

    if (method === 'get') {
      return { success: true, ticket: ticketView(ticket) }
    }

    if (method === 'patch') {
      const parsed =
        body.acceptanceCriteria !== undefined
          ? parseAcceptanceCriteria(body.acceptanceCriteria)
          : null
      const updated = {
        ...ticket,
        title: body.title !== undefined ? String(body.title).trim() : ticket.title,
        description: body.description !== undefined ? String(body.description).trim() : ticket.description,
        acceptanceCriteria:
          body.acceptanceCriteria !== undefined ? String(body.acceptanceCriteria).trim() : ticket.acceptanceCriteria,
        parsedCriteria: parsed ? parsed.scenarios || [] : ticket.parsedCriteria,
        severity: ['critical', 'high', 'medium', 'low'].includes(body.severity) ? body.severity : ticket.severity,
        priority: ['high', 'medium', 'low'].includes(body.priority) ? body.priority : ticket.priority,
        status: ['open', 'in_progress', 'resolved', 'closed'].includes(body.status) ? body.status : ticket.status,
        expectedResult: body.expectedResult !== undefined ? String(body.expectedResult).trim() : ticket.expectedResult,
        actualResult: body.actualResult !== undefined ? String(body.actualResult).trim() : ticket.actualResult,
        reproductionSteps:
          body.reproductionSteps !== undefined
            ? Array.isArray(body.reproductionSteps)
              ? body.reproductionSteps
              : String(body.reproductionSteps)
                  .split('\n')
                  .map((step) => step.trim())
                  .filter(Boolean)
            : ticket.reproductionSteps,
        updatedAt: new Date().toISOString(),
      }
      saveTickets(list.map((item) => (item._id === ticketId ? updated : item)))
      return { success: true, message: 'Ticket updated successfully', ticket: ticketView(updated) }
    }

    if (method === 'delete') {
      saveTickets(list.filter((item) => item._id !== ticketId))
      return { success: true, message: 'Ticket deleted successfully', deletedTicketId: ticketId }
    }
  }

  fail(404, `No demo handler for ${method.toUpperCase()} ${path}`)
}

export const isDemoSession = () => readRaw(KEYS.session) === '1'

export const enableDemoSession = () => {
  writeRaw(KEYS.session, '1')
}

export const demoRequest = (method, url, config) => {
  const payload = handle(String(method).toLowerCase(), url, config)
  return Promise.resolve({ data: payload, status: 200, statusText: 'OK', headers: {}, config })
}

export const demoHealth = () => health()
