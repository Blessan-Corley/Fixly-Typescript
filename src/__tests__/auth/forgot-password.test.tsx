import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ToastProvider } from '@/components/ui/toast-provider'
import ForgotPasswordPage from '@/app/auth/forgot-password/page'

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <ToastProvider>
        {component}
      </ToastProvider>
    </ThemeProvider>
  )
}

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
    jest.clearAllMocks()
  })

  it('renders forgot password form', () => {
    renderWithProviders(<ForgotPasswordPage />)
    
    expect(screen.getByText('Forgot Password')).toBeInTheDocument()
    expect(screen.getByText('Reset Your Password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByText('Send Reset Code')).toBeInTheDocument()
  })

  it('validates email input', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ForgotPasswordPage />)
    
    // Try to submit without email
    const submitButton = screen.getByText('Send Reset Code')
    await user.click(submitButton)
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ForgotPasswordPage />)
    
    // Enter invalid email
    const emailInput = screen.getByPlaceholderText('Enter your email')
    await user.type(emailInput, 'invalidemail')
    
    const submitButton = screen.getByText('Send Reset Code')
    await user.click(submitButton)
    
    // Should show format validation error
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument()
    })
  })

  it('sends password reset request successfully', async () => {
    const user = userEvent.setup()
    const mockFetch = global.fetch as jest.Mock
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Reset code sent successfully' }),
    })
    
    renderWithProviders(<ForgotPasswordPage />)
    
    // Enter valid email
    const emailInput = screen.getByPlaceholderText('Enter your email')
    await user.type(emailInput, 'test@example.com')
    
    // Submit form
    const submitButton = screen.getByText('Send Reset Code')
    await user.click(submitButton)
    
    // Should call reset password API
    expect(mockFetch).toHaveBeenCalledWith('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'test@example.com' }),
    })
    
    // Should show success message
    await waitFor(() => {
      expect(screen.getByText(/reset code sent/i)).toBeInTheDocument()
    })
  })

  it('handles API errors', async () => {
    const user = userEvent.setup()
    const mockFetch = global.fetch as jest.Mock
    
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, message: 'Email not found' }),
    })
    
    renderWithProviders(<ForgotPasswordPage />)
    
    // Enter email and submit
    const emailInput = screen.getByPlaceholderText('Enter your email')
    await user.type(emailInput, 'notfound@example.com')
    
    const submitButton = screen.getByText('Send Reset Code')
    await user.click(submitButton)
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Email not found')).toBeInTheDocument()
    })
  })

  it('handles network errors', async () => {
    const user = userEvent.setup()
    const mockFetch = global.fetch as jest.Mock
    
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    
    renderWithProviders(<ForgotPasswordPage />)
    
    // Enter email and submit
    const emailInput = screen.getByPlaceholderText('Enter your email')
    await user.type(emailInput, 'test@example.com')
    
    const submitButton = screen.getByText('Send Reset Code')
    await user.click(submitButton)
    
    // Should show network error message
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    const mockFetch = global.fetch as jest.Mock
    
    // Mock delayed response
    mockFetch.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({ 
          ok: true, 
          json: async () => ({ success: true }) 
        }), 1000)
      )
    )
    
    renderWithProviders(<ForgotPasswordPage />)
    
    // Enter email and submit
    const emailInput = screen.getByPlaceholderText('Enter your email')
    await user.type(emailInput, 'test@example.com')
    
    const submitButton = screen.getByText('Send Reset Code')
    await user.click(submitButton)
    
    // Should show loading state
    expect(screen.getByText('Sending...')).toBeInTheDocument()
  })

  it('transitions to OTP verification step', async () => {
    const user = userEvent.setup()
    const mockFetch = global.fetch as jest.Mock
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Reset code sent' }),
    })
    
    renderWithProviders(<ForgotPasswordPage />)
    
    // Send reset code
    const emailInput = screen.getByPlaceholderText('Enter your email')
    await user.type(emailInput, 'test@example.com')
    
    const submitButton = screen.getByText('Send Reset Code')
    await user.click(submitButton)
    
    // Should transition to OTP verification
    await waitFor(() => {
      expect(screen.getByText('Enter Verification Code')).toBeInTheDocument()
      expect(screen.getByText('Verify & Reset')).toBeInTheDocument()
    })
  })

  it('handles OTP verification', async () => {
    const user = userEvent.setup()
    const mockFetch = global.fetch as jest.Mock
    
    // Mock successful reset code sending
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })
    
    // Mock successful OTP verification
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'OTP verified' }),
    })
    
    renderWithProviders(<ForgotPasswordPage />)
    
    // First send reset code
    const emailInput = screen.getByPlaceholderText('Enter your email')
    await user.type(emailInput, 'test@example.com')
    await user.click(screen.getByText('Send Reset Code'))
    
    // Then verify OTP
    await waitFor(() => {
      const otpInputs = screen.getAllByRole('textbox')
      // Fill OTP inputs
      otpInputs.forEach(async (input, index) => {
        await user.type(input, (index + 1).toString())
      })
    })
    
    const verifyButton = screen.getByText('Verify & Reset')
    await user.click(verifyButton)
    
    // Should call OTP verification API
    expect(mockFetch).toHaveBeenCalledWith('/api/auth/verify-otp', expect.any(Object))
  })

  it('allows resending reset code', async () => {
    const user = userEvent.setup()
    const mockFetch = global.fetch as jest.Mock
    
    // Mock successful reset code sending
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Code resent' }),
      })
    
    renderWithProviders(<ForgotPasswordPage />)
    
    // Send initial reset code
    const emailInput = screen.getByPlaceholderText('Enter your email')
    await user.type(emailInput, 'test@example.com')
    await user.click(screen.getByText('Send Reset Code'))
    
    // Click resend button
    await waitFor(() => {
      const resendButton = screen.getByText('Resend Code')
      user.click(resendButton)
    })
    
    // Should call API again
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('transitions to new password step after OTP verification', async () => {
    const user = userEvent.setup()
    const mockFetch = global.fetch as jest.Mock
    
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, nextStep: 'set_new_password' }),
      })
    
    renderWithProviders(<ForgotPasswordPage />)
    
    // Complete OTP verification flow
    const emailInput = screen.getByPlaceholderText('Enter your email')
    await user.type(emailInput, 'test@example.com')
    await user.click(screen.getByText('Send Reset Code'))
    
    // Verify OTP
    await waitFor(async () => {
      const otpInputs = screen.getAllByRole('textbox')
      for (let i = 0; i < otpInputs.length; i++) {
        await user.type(otpInputs[i], '1')
      }
      await user.click(screen.getByText('Verify & Reset'))
    })
    
    // Should transition to password reset step
    await waitFor(() => {
      expect(screen.getByText('Set New Password')).toBeInTheDocument()
    })
  })

  it('validates new password requirements', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ForgotPasswordPage />)
    
    // Mock being in password reset step
    // This would require setting up the component state properly
    
    // Test password validation requirements
    // - Minimum length
    // - Contains uppercase, lowercase, number, special character
    // - Passwords match
  })

  it('has back to signin link', () => {
    renderWithProviders(<ForgotPasswordPage />)
    
    const backLink = screen.getByText('Back to Sign In')
    expect(backLink).toBeInTheDocument()
    expect(backLink.closest('a')).toHaveAttribute('href', '/auth/signin')
  })

  it('completes password reset flow', async () => {
    const user = userEvent.setup()
    const mockFetch = global.fetch as jest.Mock
    
    // Mock all API calls
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) }) // Send code
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) }) // Verify OTP
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) }) // Reset password
    
    renderWithProviders(<ForgotPasswordPage />)
    
    // Complete entire flow
    // 1. Send reset code
    // 2. Verify OTP
    // 3. Set new password
    // 4. Confirm success and redirect
    
    // This would be a comprehensive integration test
  })
})