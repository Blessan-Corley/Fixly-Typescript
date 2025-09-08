import '@testing-library/jest-dom'
import React from 'react'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/test-path',
}))

// Mock Next.js link
jest.mock('next/link', () => {
  return ({ children, href, ...props }) => {
    return React.createElement('a', { href, ...props }, children)
  }
})

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      const { whileHover, whileTap, initial, animate, transition, ...cleanProps } = props
      return React.createElement('div', cleanProps, children)
    },
    button: ({ children, ...props }) => {
      const { whileHover, whileTap, initial, animate, transition, ...cleanProps } = props
      return React.createElement('button', cleanProps, children)
    },
    form: ({ children, ...props }) => {
      const { whileHover, whileTap, initial, animate, transition, ...cleanProps } = props
      return React.createElement('form', cleanProps, children)
    },
    nav: ({ children, ...props }) => {
      const { whileHover, whileTap, initial, animate, transition, ...cleanProps } = props
      return React.createElement('nav', cleanProps, children)
    },
    section: ({ children, ...props }) => {
      const { whileHover, whileTap, initial, animate, transition, ...cleanProps } = props
      return React.createElement('section', cleanProps, children)
    },
    h1: ({ children, ...props }) => {
      const { whileHover, whileTap, initial, animate, transition, ...cleanProps } = props
      return React.createElement('h1', cleanProps, children)
    },
  },
  AnimatePresence: ({ children }) => children,
  useScroll: () => ({ scrollY: { onChange: jest.fn() } }),
  useTransform: () => 0,
}))

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
}))

// Mock environment variables
process.env = {
  ...process.env,
  NEXTAUTH_URL: 'http://localhost:3000',
  NEXTAUTH_SECRET: 'test-secret',
  MONGODB_URI: 'mongodb://localhost:27017/fixly-test',
  SMTP_HOST: 'localhost',
  SMTP_PORT: '587',
  SMTP_USER: 'test@example.com',
  SMTP_PASS: 'test-password',
}

// Global mocks for lib modules
jest.mock('@/lib/database/connection', () => jest.fn().mockResolvedValue(true))

jest.mock('@/lib/database/schemas/user', () => ({
  findOne: jest.fn(),
  findByEmailOrUsername: jest.fn(),
  deleteOne: jest.fn(),
  mockImplementation: jest.fn(),
}))

jest.mock('@/lib/auth/otp', () => ({
  generateOTP: jest.fn(),
  createOTPToken: jest.fn(),
  verifyOTPToken: jest.fn(),
}))

jest.mock('@/lib/auth/jwt', () => ({
  createTokens: jest.fn(),
  verifyToken: jest.fn(),
}))

jest.mock('@/lib/services/email', () => ({
  sendOTPEmail: jest.fn(),
  sendWelcomeEmail: jest.fn(),
}))

jest.mock('@/lib/utils/rateLimit', () => ({
  rateLimit: jest.fn(),
  createRateLimiter: jest.fn(),
}))

jest.mock('@/lib/utils/validation', () => ({
  validateEmail: jest.fn(),
  validatePassword: jest.fn(),
  validateUsername: jest.fn(),
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

// Global test utilities
global.fetch = jest.fn()

// Mock window.matchMedia (only in jsdom environment)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks()
})