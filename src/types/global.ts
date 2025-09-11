// ========== CORE APPLICATION TYPES ==========

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  search?: string
}

export interface FilterParams {
  category?: string
  location?: string
  priceMin?: number
  priceMax?: number
  rating?: number
  verified?: boolean
  available?: boolean
}

// ========== USER & AUTHENTICATION ==========

export type UserRole = 'hirer' | 'fixer' | 'admin'
export type AccountStatus = 'active' | 'pending' | 'suspended' | 'banned'
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

export interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  fullName: string
  avatar?: string
  role: UserRole
  status: AccountStatus
  verificationStatus: VerificationStatus
  phone?: string
  dateOfBirth?: string
  location?: Location
  profile?: UserProfile
  preferences?: UserPreferences
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface UserProfile {
  bio?: string
  website?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    instagram?: string
  }
  skills?: string[]
  experience?: number
  languages?: string[]
  hourlyRate?: number
  availability?: 'available' | 'busy' | 'away'
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacy: {
    showProfile: boolean
    showLocation: boolean
    showContact: boolean
  }
  language: string
  currency: string
  timezone: string
}

export interface AuthSession {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt: string
}

// ========== LOCATION ==========

export interface Coordinates {
  lat: number
  lng: number
}

export interface Location {
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  coordinates: Coordinates
}

// ========== SERVICES & JOBS ==========

export type JobStatus = 'draft' | 'posted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
export type JobPriority = 'low' | 'medium' | 'high' | 'urgent'
export type JobType = 'fixed_price' | 'hourly' | 'negotiable'
export type QuoteStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'

export interface ServiceCategory {
  id: string
  name: string
  description: string
  icon: string
  slug: string
  parentId?: string
  isActive: boolean
  sortOrder: number
  skillsRequired?: string[]
  averagePrice?: {
    min: number
    max: number
    currency: string
  }
}

export interface Job {
  id: string
  title: string
  description: string
  category: ServiceCategory
  subcategory?: ServiceCategory
  location: Location
  budget: {
    type: JobType
    amount?: number
    hourlyRate?: number
    currency: string
  }
  priority: JobPriority
  status: JobStatus
  requirements?: string[]
  attachments?: FileAttachment[]
  timeline: {
    postedAt: string
    startsAt?: string
    endsAt?: string
    completedAt?: string
  }
  hirer: User
  assignedFixer?: User
  quotes?: Quote[]
  applicantCount: number
  viewCount: number
  isUrgent: boolean
  tags: string[]
  metadata?: Record<string, any>
}

export interface Quote {
  id: string
  jobId: string
  fixerId: string
  fixer: User
  amount: number
  currency: string
  estimatedHours?: number
  timeline: {
    startDate: string
    endDate: string
  }
  message: string
  status: QuoteStatus
  attachments?: FileAttachment[]
  createdAt: string
  updatedAt: string
}

// ========== MESSAGING ==========

export type MessageType = 'text' | 'image' | 'file' | 'system'
export type MessageStatus = 'sent' | 'delivered' | 'read'

export interface Message {
  id: string
  conversationId: string
  senderId: string
  sender: User
  content: string
  type: MessageType
  status: MessageStatus
  attachments?: FileAttachment[]
  replyTo?: string
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  id: string
  participants: User[]
  jobId?: string
  job?: Job
  lastMessage?: Message
  unreadCount: number
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

// ========== REVIEWS & RATINGS ==========

export interface Review {
  id: string
  jobId: string
  job: Job
  reviewerId: string
  reviewer: User
  revieweeId: string
  reviewee: User
  rating: number
  title?: string
  comment?: string
  pros?: string[]
  cons?: string[]
  isRecommended: boolean
  isVerified: boolean
  response?: {
    content: string
    createdAt: string
  }
  createdAt: string
  updatedAt: string
}

export interface Rating {
  average: number
  count: number
  distribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

// ========== PAYMENTS ==========

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
export type PaymentMethod = 'card' | 'bank_transfer' | 'wallet' | 'upi'

export interface Payment {
  id: string
  jobId: string
  payerId: string
  payer: User
  receiverId: string
  receiver: User
  amount: number
  currency: string
  method: PaymentMethod
  status: PaymentStatus
  fees: {
    platform: number
    payment: number
    total: number
  }
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface Wallet {
  id: string
  userId: string
  balance: number
  currency: string
  transactions: WalletTransaction[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WalletTransaction {
  id: string
  walletId: string
  type: 'credit' | 'debit'
  amount: number
  currency: string
  description: string
  reference?: string
  metadata?: Record<string, any>
  createdAt: string
}

// ========== NOTIFICATIONS ==========

export type NotificationType = 'job' | 'message' | 'payment' | 'review' | 'system'
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  icon?: string
  action?: {
    label: string
    url: string
  }
  isRead: boolean
  metadata?: Record<string, any>
  createdAt: string
  readAt?: string
}

// ========== FILES & MEDIA ==========

export interface FileAttachment {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  thumbnailUrl?: string
  metadata?: {
    width?: number
    height?: number
    duration?: number
  }
  uploadedBy: string
  createdAt: string
}

// ========== ANALYTICS ==========

export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  timestamp: string
  sessionId: string
}

export interface UserStats {
  totalJobs: number
  completedJobs: number
  avgRating: number
  totalEarnings: number
  responseTime: number
  completionRate: number
  joinedAt: string
}

// ========== FORM & VALIDATION ==========

export interface FormError {
  field: string
  message: string
  code?: string
}

export interface ValidationRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (_value: any) => boolean | string
}

export interface FormState<T> {
  data: T
  errors: Record<keyof T, string>
  isSubmitting: boolean
  isValid: boolean
  touched: Record<keyof T, boolean>
}

// ========== UI COMPONENTS ==========

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'link'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ToastType = 'success' | 'error' | 'warning' | 'info'
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ToastOptions {
  id?: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  size?: ModalSize
  title?: string
  children: React.ReactNode
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  className?: string
}

// ========== SEARCH ==========

export interface SearchFilters {
  query?: string
  category?: string
  location?: string
  priceRange?: [number, number]
  rating?: number
  availability?: string
  sortBy?: 'relevance' | 'price' | 'rating' | 'distance' | 'date'
  sortOrder?: 'asc' | 'desc'
}

export interface SearchResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
  filters: SearchFilters
}

// ========== CONFIGURATION ==========

export interface AppConfig {
  name: string
  version: string
  environment: 'development' | 'staging' | 'production'
  features: {
    [key: string]: boolean
  }
  limits: {
    maxFileSize: number
    maxFilesPerUpload: number
    messageLength: number
    jobDescriptionLength: number
  }
  payments: {
    currency: string
    platformFee: number
    paymentMethods: PaymentMethod[]
  }
  api: {
    baseUrl: string
    timeout: number
    retries: number
  }
}

// ========== UTILITY TYPES ==========

export type Nullable<T> = T | null
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// ========== HOOK TYPES ==========

export interface UseAsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  execute: (..._args: any[]) => Promise<void>
  reset: () => void
}

export interface UsePaginationState {
  page: number
  limit: number
  total: number
  hasMore: boolean
  loading: boolean
  setPage: (_page: number) => void
  setLimit: (_limit: number) => void
  nextPage: () => void
  prevPage: () => void
  reset: () => void
}

// ========== API ENDPOINTS ==========

export interface ApiEndpoints {
  auth: {
    login: string
    logout: string
    register: string
    refresh: string
    resetPassword: string
    verifyEmail: string
  }
  users: {
    profile: string
    update: string
    avatar: string
    preferences: string
  }
  jobs: {
    list: string
    create: string
    detail: string
    update: string
    delete: string
    quotes: string
  }
  messages: {
    conversations: string
    send: string
    history: string
    markRead: string
  }
  payments: {
    methods: string
    process: string
    history: string
    refund: string
  }
  files: {
    upload: string
    delete: string
    download: string
  }
}