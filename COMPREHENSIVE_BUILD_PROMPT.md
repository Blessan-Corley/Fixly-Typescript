# FIXLY - Comprehensive Build Prompt

## Project Overview
Build a comprehensive local services marketplace platform called "Fixly" - a modern, scalable platform connecting hirers with skilled fixers for various services like home repairs, maintenance, installations, and professional services.

## Core Architecture Requirements

### Technology Stack
- **Frontend Framework**: Next.js 14+ (App Router) with TypeScript 5.0+
- **Backend**: Node.js 18+ with Next.js API routes in TypeScript
- **Database**: MongoDB 6.0+ with Mongoose ODM and TypeScript schemas
- **Authentication**: NextAuth.js v4 with JWT + Google OAuth (TypeScript)
- **Real-time**: Server-Sent Events (SSE) + Socket.io WebSockets fallback
- **Caching**: upstash Redis 7.0+ for sessions, rate limiting, and performance
- **Search**: MongoDB Atlas Search / Elasticsearch for advanced search, nearby job search with location
- **Payments**: Razorpay integration for Indian market (TypeScript SDK)
- **File Storage**: Cloudinary for images and documents (TypeScript)
- **Email Service**: Nodemailer with SMTP (TypeScript)
- **SMS Service**: Firebase/Twilio for OTP verification (TypeScript)
- **Push Notifications**: Firebase Cloud Messaging (FCM) with TypeScript
- **Styling**: Tailwind CSS 3.0+ with  UI components
- **State Management**: Zustand + React Query v4 for server state (TypeScript)
- **Validation**: Zod for runtime validation and type inference
- **Type Safety**: Full TypeScript implementation with strict mode
- **Testing**: Vitest + React Testing Library + Playwright E2E
- **Code Quality**: ESLint, Prettier, Husky git hooks
- **Deployment**: Vercel with MongoDB Atlas and Redis Cloud

### Why MongoDB is Perfect for Fixly:
1. **Flexible Schema**: Job requirements and user profiles vary significantly
2. **Geospatial Queries**: Built-in location-based search with 2dsphere indexes
3. **Document Structure**: Natural fit for nested job applications, portfolios, messages
4. **JSON-like Data**: Perfect match with TypeScript interfaces and Next.js
5. **Horizontal Scaling**: Easy sharding as the platform grows
6. **Atlas Search**: Built-in full-text search capabilities
7. **Aggregation Pipeline**: Complex queries for analytics and recommendations

## Feature Implementation Requirements

### 1. Authentication System
- **Role Selection**: Hirer vs Fixer distinction
- **Email/Password Registration**: Complete email verification flow
- **Google OAuth**: Seamless social login
- **Phone Verification**: OTP-based verification
- **Password Reset**: Secure token-based reset
- **Session Management**: JWT with Redis caching
- **Rate Limiting**: Prevent abuse and spam

### 2. User Profile Management
- **Profile Completion**: Step-by-step onboarding
- **Location Services**: Address autocomplete, geolocation
- **Portfolio Management**: For fixers to showcase skills
- **Skill Management**: Add/remove skills 

### 3. Job Management System
- **Job Posting**: Rich text editor, image upload, location with auto complete or map pointing 
- **Job Browsing**: Advanced search, filters, sorting
- **Job Applications**: Detailed proposals with pricing
- **Application Management**: Accept/reject with notifications
- **Job Tracking**: Status updates, progress tracking
- **Job Flow**: Posted(hirer) -> Applied(Fixer) -> Accepted(Hirer) (Hide from other fixer) -> assigned -> Inprogress (after both hirer and fixer meets) -> Completed(Once when both side marked the job as completed)

### 4. Real-time Communication
- **Messaging System**: In-app chat with file sharing only when hirer accepts it like when job goes to assigned state onlly then the messging window opens between them nad after the job is completed no more messaging betwenn them
- **Realtime with caching** - Raltime chating pub/sub thing 
- **Auto message** - Auto message sent from the fixer for one message like "iam your assigned fixer" 
- **Typing Indicators**: Real-time typing status
- **Online Presence**: User online/offline status
- **Notifications**: Real-time job updates

### 5. Payment Integration
- **Razorpay Integration**: Secure payment processing
- **Subscription Management**: Pro plans for fixers
- **Credit System**: Free job limits 3 job limit (once the job has been accepted that the job went to assigned state reduce the credit from the free fixer)
- **Payment History**: Transaction tracking
- **Refund System**: Dispute handling

### 6. Review & Rating System
- **Bidirectional Reviews**: Both hirers and fixers can review with star rating and descriptio nif they like to 
- **Review Moderation**: Spam and abuse prevention
- **Rating Aggregation**: Overall user ratings

### 7. Search & Discovery
- **Location-based Search**: Find nearby fixers
- **Skill-based Filtering**: Filter by expertise
- **Price Range Filtering**: Budget-based search
- **Availability Filtering**: Time-based matching
- **Featured Jobs**: Premium job visibility

### 8. Admin Dashboard
- **User Management**: View, ban, unban users
- **Job Moderation**: Approve, reject, feature jobs
- **Review Moderation**: Manage fake reviews
- **Analytics**: Platform usage statistics
- **Bulk Operations**: Batch job management 
with more admin features after the user thing are well implemented and polished

### 9. Mobile Optimization
- **PWA Features**: Installable web app
- **Push Notifications**: Web push notifications
- **Offline Support**: Basic offline functionality
- **Mobile-first Design**: Responsive across devices

## Security Requirements

### Data Security
- **Input Validation**: Comprehensive sanitization
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy
- **CSRF Protection**: Token validation
- **Rate Limiting**: API abuse prevention

### Authentication Security
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Secure token generation
- **Session Management**: Redis-based sessions
- **OAuth Security**: Secure third-party auth

### Infrastructure Security
- **HTTPS Enforcement**: SSL/TLS encryption
- **Environment Variables**: Secure config management
- **Database Security**: Connection encryption
- **File Upload Security**: Type and size validation

## Performance Requirements

### Frontend Performance
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Next.js Image component
- **Caching Strategy**: Browser and CDN caching
- **Bundle Size**: Optimize typescript bundles

### Backend Performance
- **Database Indexing**: Optimized query performance
- **Redis Caching**: Frequent data caching
- **API Rate Limiting**: Prevent overload
- **Connection Pooling**: Database connection optimization

### Scalability
- **Horizontal Scaling**: Load balancer ready
- **Database Scaling**: MongoDB sharding ready
- **CDN Integration**: Static asset delivery
- **Monitoring**: Performance tracking

## Testing Requirements

### Unit Testing
- **Component Testing**: React components
- **API Testing**: Express route testing
- **Database Testing**: Model validation
- **Utility Testing**: Helper functions

### Integration Testing
- **Authentication Flow**: End-to-end auth testing
- **Payment Flow**: Razorpay integration testing
- **Notification System**: Real-time testing
- **File Upload**: Media handling testing

### Performance Testing
- **Load Testing**: High traffic simulation
- **Stress Testing**: System limits testing
- **Database Performance**: Query optimization
- **Memory Usage**: Leak detection

## Deployment Requirements

### Environment Setup
- **Development**: Local MongoDB + Redis
- **Staging**: Cloud testing environment
- **Production**: Scalable cloud infrastructure
- **Monitoring**: Error tracking and analytics

### CI/CD Pipeline
- **Code Quality**: ESLint, Prettier
- **Testing**: Automated test suite
- **Security Scanning**: Vulnerability checks
- **Deployment**: Automated deployment

### Monitoring & Logging
- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Uptime tracking
- **Log Management**: Centralized logging
- **Analytics**: User behavior tracking
