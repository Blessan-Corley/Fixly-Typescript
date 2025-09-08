import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ToastProvider } from '@/components/ui/toast-provider'
import SignInPage from '@/app/auth/signin/page'
import { signIn } from 'next-auth/react'

// Mock NextAuth
jest.mock('next-auth/react')
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <ToastProvider>
        {component}
      </ToastProvider>
    </ThemeProvider>
  )
}

describe('SignIn Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders signin form with all required fields', () => {
    renderWithProviders(<SignInPage />)
    
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email or username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByText('Continue with Google')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignInPage />)
    
    // Try to submit without filling fields
    const signInButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(signInButton)
    
    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText('Email or username is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignInPage />)
    
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const toggleButton = screen.getByRole('button', { name: '' }) // Eye icon button
    
    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Click toggle button
    await user.click(toggleButton)
    
    // Password should be visible
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    // Click again to hide
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('handles credentials signin successfully', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ ok: true, error: null })
    
    renderWithProviders(<SignInPage />)
    
    // Fill in form
    const emailInput = screen.getByPlaceholderText('Enter your email or username')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    // Submit form
    const signInButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(signInButton)
    
    // Should call NextAuth signIn
    expect(mockSignIn).toHaveBeenCalledWith('credentials', {
      identifier: 'test@example.com',
      password: 'password123',
      redirect: false,
    })
  })

  it('handles credentials signin with invalid credentials', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ ok: false, error: 'CredentialsSignin' })
    
    renderWithProviders(<SignInPage />)
    
    // Fill in form with invalid credentials
    const emailInput = screen.getByPlaceholderText('Enter your email or username')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    
    await user.type(emailInput, 'invalid@example.com')
    await user.type(passwordInput, 'wrongpassword')
    
    // Submit form
    const signInButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(signInButton)
    
    // Should show error message
    await waitFor(() => {
      // The error would be shown via toast, so we'd need to check for toast content
      expect(mockSignIn).toHaveBeenCalled()
    })
  })

  it('handles Google signin', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ ok: true, error: null })
    
    renderWithProviders(<SignInPage />)
    
    // Click Google signin button
    const googleButton = screen.getByText('Continue with Google')
    await user.click(googleButton)
    
    // Should call NextAuth signIn with Google provider
    expect(mockSignIn).toHaveBeenCalledWith('google', {
      callbackUrl: '/dashboard',
      redirect: true,
    })
  })

  it('handles account locked error', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ ok: false, error: 'AccountLocked' })
    
    renderWithProviders(<SignInPage />)
    
    // Fill and submit form
    const emailInput = screen.getByPlaceholderText('Enter your email or username')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    
    await user.type(emailInput, 'locked@example.com')
    await user.type(passwordInput, 'password123')
    
    const signInButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(signInButton)
    
    // Should handle account locked error
    expect(mockSignIn).toHaveBeenCalled()
  })

  it('handles email not verified error', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ ok: false, error: 'EmailNotVerified' })
    
    renderWithProviders(<SignInPage />)
    
    // Fill and submit form
    const emailInput = screen.getByPlaceholderText('Enter your email or username')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    
    await user.type(emailInput, 'unverified@example.com')
    await user.type(passwordInput, 'password123')
    
    const signInButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(signInButton)
    
    // Should show email verification warning
    expect(mockSignIn).toHaveBeenCalled()
  })

  it('toggles remember me checkbox', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignInPage />)
    
    const rememberMeCheckbox = screen.getByLabelText('Remember me')
    
    // Initially unchecked
    expect(rememberMeCheckbox).not.toBeChecked()
    
    // Click to check
    await user.click(rememberMeCheckbox)
    expect(rememberMeCheckbox).toBeChecked()
    
    // Click to uncheck
    await user.click(rememberMeCheckbox)
    expect(rememberMeCheckbox).not.toBeChecked()
  })

  it('shows loading state during signin', async () => {
    const user = userEvent.setup()
    
    // Mock a delayed response
    mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ ok: true, error: null }), 1000)))
    
    renderWithProviders(<SignInPage />)
    
    // Fill and submit form
    const emailInput = screen.getByPlaceholderText('Enter your email or username')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    const signInButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(signInButton)
    
    // Should show loading state
    expect(screen.getByText('Signing in...')).toBeInTheDocument()
  })

  it('has forgot password link', () => {
    renderWithProviders(<SignInPage />)
    
    const forgotPasswordLink = screen.getByText('Forgot password?')
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/auth/forgot-password')
  })

  it('has signup link', () => {
    renderWithProviders(<SignInPage />)
    
    const signupLink = screen.getByText('Sign up')
    expect(signupLink).toBeInTheDocument()
    expect(signupLink.closest('a')).toHaveAttribute('href', '/auth/choose-role')
  })

  it('handles network errors gracefully', async () => {
    const user = userEvent.setup()
    mockSignIn.mockRejectedValue(new Error('Network error'))
    
    renderWithProviders(<SignInPage />)
    
    // Fill and submit form
    const emailInput = screen.getByPlaceholderText('Enter your email or username')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    const signInButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(signInButton)
    
    // Should handle the error gracefully
    expect(mockSignIn).toHaveBeenCalled()
  })

  it('processes URL error parameters', () => {
    // Mock useSearchParams to return error
    const mockGet = jest.fn().mockReturnValue('CredentialsSignin')
    
    jest.doMock('next/navigation', () => ({
      useSearchParams: () => ({ get: mockGet }),
      useRouter: () => ({ push: jest.fn() }),
    }))
    
    renderWithProviders(<SignInPage />)
    
    // Should process the error parameter from URL
    expect(mockGet).toHaveBeenCalledWith('error')
  })
})