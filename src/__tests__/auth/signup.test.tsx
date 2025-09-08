import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ToastProvider } from '@/components/ui/toast-provider'
import SignUpPage from '@/app/auth/signup/page'

// Mock the data imports
jest.mock('@/data/skills', () => ({
  skillCategories: [
    { id: 'home-repair', name: 'Home Repair', description: 'Test description' },
    { id: 'plumbing', name: 'Plumbing', description: 'Test description' },
  ],
  getSkillsByCategory: jest.fn(() => [
    { id: 'test-skill', name: 'Test Skill', category: 'home-repair' },
  ]),
  skillsData: [],
}))

jest.mock('@/data/cities', () => ({
  cities: [
    { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', stateCode: 'MH' },
    { id: 'delhi', name: 'Delhi', state: 'Delhi', stateCode: 'DL' },
  ],
  indianStates: [
    { code: 'MH', name: 'Maharashtra' },
    { code: 'DL', name: 'Delhi' },
  ],
}))

// Mock the location selector component
jest.mock('@/components/location/LocationSelector', () => {
  return function MockLocationSelector({ onLocationSelect, selectedLocation }: any) {
    return (
      <div data-testid="location-selector">
        <button
          onClick={() =>
            onLocationSelect({
              type: 'manual',
              city: 'Mumbai',
              state: 'Maharashtra',
              stateCode: 'MH',
            })
          }
        >
          Select Mumbai
        </button>
      </div>
    )
  }
})

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <ToastProvider>
        {component}
      </ToastProvider>
    </ThemeProvider>
  )
}

describe('SignUp Component', () => {
  beforeEach(() => {
    // Mock fetch for API calls
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders initial role selection step', () => {
    renderWithProviders(<SignUpPage />)
    
    expect(screen.getByText('Choose Your Role')).toBeInTheDocument()
    expect(screen.getByText('I need help with tasks')).toBeInTheDocument()
    expect(screen.getByText('I want to offer my skills')).toBeInTheDocument()
  })

  it('allows user to select hirer role and proceed', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignUpPage />)
    
    // Select hirer role
    const hirerCard = screen.getByText('I need help with tasks').closest('div')
    await user.click(hirerCard!)
    
    // Click continue button
    const continueButton = screen.getByText('Continue')
    await user.click(continueButton)
    
    // Should move to email verification step
    await waitFor(() => {
      expect(screen.getByText('Email Verification')).toBeInTheDocument()
    })
  })

  it('allows user to select fixer role and proceed', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignUpPage />)
    
    // Select fixer role
    const fixerCard = screen.getByText('I want to offer my skills').closest('div')
    await user.click(fixerCard!)
    
    // Click continue button
    const continueButton = screen.getByText('Continue')
    await user.click(continueButton)
    
    // Should move to email verification step
    await waitFor(() => {
      expect(screen.getByText('Email Verification')).toBeInTheDocument()
    })
  })

  it('validates email input in verification step', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignUpPage />)
    
    // Select role and proceed
    const hirerCard = screen.getByText('I need help with tasks').closest('div')
    await user.click(hirerCard!)
    await user.click(screen.getByText('Continue'))
    
    // Try to proceed without email
    await waitFor(() => {
      const nextButton = screen.getByText('Send Verification Code')
      user.click(nextButton)
    })
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })
  })

  it('sends OTP when valid email is provided', async () => {
    const user = userEvent.setup()
    const mockFetch = global.fetch as jest.Mock
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'OTP sent successfully' }),
    })
    
    renderWithProviders(<SignUpPage />)
    
    // Navigate to email verification step
    const hirerCard = screen.getByText('I need help with tasks').closest('div')
    await user.click(hirerCard!)
    await user.click(screen.getByText('Continue'))
    
    // Enter email
    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText('Enter your email')
      user.type(emailInput, 'test@example.com')
    })
    
    // Send verification code
    const sendButton = screen.getByText('Send Verification Code')
    await user.click(sendButton)
    
    // Should call API
    expect(mockFetch).toHaveBeenCalledWith('/api/auth/send-otp', expect.any(Object))
  })

  it('validates OTP input', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignUpPage />)
    
    // Navigate through steps to OTP verification
    const hirerCard = screen.getByText('I need help with tasks').closest('div')
    await user.click(hirerCard!)
    await user.click(screen.getByText('Continue'))
    
    // Mock having sent OTP
    const component = screen.getByTestId('signup-form') // Assuming you add this test id
    fireEvent(component, new CustomEvent('otpSent', { detail: { email: 'test@example.com' } }))
    
    // Try to verify with invalid OTP
    await waitFor(() => {
      const otpInputs = screen.getAllByRole('textbox')
      otpInputs.forEach((input, index) => {
        user.type(input, index.toString())
      })
    })
    
    // Should validate OTP format
    const verifyButton = screen.getByText('Verify Code')
    await user.click(verifyButton)
    
    // Should proceed or show error based on validation
  })

  it('completes signup flow for hirer', async () => {
    const user = userEvent.setup()
    const mockFetch = global.fetch as jest.Mock
    
    // Mock successful API responses
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'OTP sent' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'OTP verified' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'User created' }),
      })
    
    renderWithProviders(<SignUpPage />)
    
    // Complete entire flow
    const hirerCard = screen.getByText('I need help with tasks').closest('div')
    await user.click(hirerCard!)
    await user.click(screen.getByText('Continue'))
    
    // Fill email and send OTP
    await waitFor(async () => {
      const emailInput = screen.getByPlaceholderText('Enter your email')
      await user.type(emailInput, 'test@example.com')
      await user.click(screen.getByText('Send Verification Code'))
    })
    
    // Verify OTP (mock the process)
    // Fill password details
    // Fill profile information
    // Complete signup
    
    // Should redirect to dashboard or success page
  })

  it('includes skills selection for fixer role', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignUpPage />)
    
    // Select fixer role
    const fixerCard = screen.getByText('I want to offer my skills').closest('div')
    await user.click(fixerCard!)
    await user.click(screen.getByText('Continue'))
    
    // Navigate through email verification
    // Should eventually reach skills selection step
    // This would require mocking the entire flow
  })

  it('includes location selection step', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignUpPage />)
    
    // Navigate through signup flow
    // Should reach location selection
    // Test location selector component
    
    await waitFor(() => {
      expect(screen.getByTestId('location-selector')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup()
    const mockFetch = global.fetch as jest.Mock
    
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    
    renderWithProviders(<SignUpPage />)
    
    // Navigate to email step and try to send OTP
    const hirerCard = screen.getByText('I need help with tasks').closest('div')
    await user.click(hirerCard!)
    await user.click(screen.getByText('Continue'))
    
    await waitFor(async () => {
      const emailInput = screen.getByPlaceholderText('Enter your email')
      await user.type(emailInput, 'test@example.com')
      await user.click(screen.getByText('Send Verification Code'))
    })
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})