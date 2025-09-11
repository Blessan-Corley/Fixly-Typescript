'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Search,
  BookOpen,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  Star,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Play,
  FileText,
  Video,
  Lightbulb,
  Users,
  Shield,
  DollarSign,
  Settings,
  Briefcase,
  User,
  Camera,
  CreditCard,
  Clock,
  MapPin,
  Award,
  Bell,
  Lock,
  HelpCircle,
  ArrowLeft,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'
import PageLayout from '@/components/layout/page-layout'

interface Article {
  id: string
  title: string
  content: string
}

interface HelpCategory {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  articles: Article[]
}

interface FAQ {
  id: string
  title: string
  questions: Array<{
    q: string
    a: string
  }>
}

interface SearchResult {
  id: string
  title: string
  content: string
  category: string
  categoryId: string
  score: number
  type?: string
}

function HelpPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const article = searchParams.get('article')

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category || null)
  const [selectedArticle, setSelectedArticle] = useState<string | null>(article || null)
  const [expandedFAQs, setExpandedFAQs] = useState(new Set<string>())
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [feedback, setFeedback] = useState<Record<string, boolean>>({})

  // Help categories and articles
  const helpCategories: HelpCategory[] = [
    { 
      id: 'getting-started',
      title: 'Getting Started',
      icon: Play,
      description: 'Learn the basics of using Fixly',
      articles: [
        {
          id: 'what-is-fixly',
          title: 'What is Fixly?',
          content: `
            <h2>Welcome to Fixly!</h2>
            <p>Fixly is a hyperlocal service marketplace that connects customers (hirers) with skilled service providers (fixers) in their area. Whether you need home repairs, professional services, or specialized skills, Fixly makes it easy to find the right person for the job.</p>
            
            <h3>How it works:</h3>
            <ol>
              <li><strong>For Hirers:</strong> Post your job requirements, review applications, and hire the best fixer</li>
              <li><strong>For Fixers:</strong> Browse available jobs, submit applications, and get hired for your skills</li>
              <li><strong>Secure Payments:</strong> All payments are processed securely through our platform</li>
              <li><strong>Quality Assurance:</strong> Rate and review system ensures quality service</li>
            </ol>
            
            <h3>Key Features:</h3>
            <ul>
              <li>Local service providers in your area</li>
              <li>Secure payment processing</li>
              <li>Real-time messaging</li>
              <li>Rating and review system</li>
              <li>Professional profiles</li>
              <li>Job tracking and management</li>
            </ul>
          `
        },
        {
          id: 'create-account',
          title: 'How to Create an Account',
          content: `
            <h2>Creating Your Fixly Account</h2>
            <p>Getting started with Fixly is quick and easy. Follow these steps to create your account:</p>
            
            <h3>Step 1: Choose Your Role</h3>
            <p>When you sign up, you'll need to choose your primary role:</p>
            <ul>
              <li><strong>Hirer:</strong> If you need services and want to hire fixers</li>
              <li><strong>Fixer:</strong> If you provide services and want to get hired</li>
            </ul>
            
            <h3>Step 2: Registration Options</h3>
            <p>You can register using:</p>
            <ul>
              <li>Google account (fastest option)</li>
              <li>Email and password</li>
              <li>Phone number (coming soon)</li>
            </ul>
            
            <h3>Step 3: Complete Your Profile</h3>
            <p>After registration, complete your profile with:</p>
            <ul>
              <li>Personal information</li>
              <li>Location details</li>
              <li>Skills and experience (for fixers)</li>
              <li>Profile photo</li>
            </ul>
            
            <h3>Step 4: Verification</h3>
            <p>For security and trust, we verify:</p>
            <ul>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Identity documents (for fixers)</li>
            </ul>
          `
        }
      ]
    },
    { 
      id: 'for-hirers',
      title: 'For Hirers',
      icon: Users,
      description: 'How to post jobs and hire fixers',
      articles: [
        {
          id: 'post-job',
          title: 'How to Post a Job',
          content: `
            <h2>Posting Your First Job</h2>
            <p>Follow these steps to create an effective job posting:</p>
            
            <h3>Step 1: Job Details</h3>
            <ul>
              <li><strong>Title:</strong> Create a clear, descriptive title</li>
              <li><strong>Description:</strong> Provide detailed requirements and expectations</li>
              <li><strong>Category:</strong> Select the most relevant category</li>
              <li><strong>Skills Required:</strong> List specific skills needed</li>
            </ul>
            
            <h3>Step 2: Budget and Timeline</h3>
            <ul>
              <li><strong>Budget Type:</strong> Fixed price, hourly, or negotiable</li>
              <li><strong>Amount:</strong> Set a fair and competitive budget</li>
              <li><strong>Timeline:</strong> Specify when you need the work completed</li>
              <li><strong>Urgency:</strong> Mark as urgent, medium, or low priority</li>
            </ul>
            
            <h3>Step 3: Location and Preferences</h3>
            <ul>
              <li><strong>Location:</strong> Set work location (your address, remote, or fixer's location)</li>
              <li><strong>Availability:</strong> Specify preferred working hours</li>
              <li><strong>Special Requirements:</strong> Any additional requirements or preferences</li>
            </ul>
            
            <h3>Tips for Better Applications:</h3>
            <ul>
              <li>Be specific about what you need</li>
              <li>Set realistic budgets and timelines</li>
              <li>Include photos if relevant</li>
              <li>Respond to questions promptly</li>
            </ul>
          `
        }
      ]
    },
    { 
      id: 'for-fixers',
      title: 'For Fixers',
      icon: Briefcase,
      description: 'How to find jobs and get hired',
      articles: [
        {
          id: 'find-jobs',
          title: 'Finding and Applying to Jobs',
          content: `
            <h2>Finding the Right Jobs</h2>
            <p>Here's how to find and apply to jobs that match your skills:</p>
            
            <h3>Browsing Jobs</h3>
            <ul>
              <li><strong>Dashboard:</strong> View recommended jobs on your dashboard</li>
              <li><strong>Browse Jobs:</strong> Explore all available jobs</li>
              <li><strong>Search:</strong> Use keywords to find specific types of work</li>
              <li><strong>Filters:</strong> Filter by location, budget, urgency, and skills</li>
            </ul>
            
            <h3>Writing Great Applications</h3>
            <p>Your application should include:</p>
            <ul>
              <li><strong>Personal Introduction:</strong> Brief intro about yourself</li>
              <li><strong>Relevant Experience:</strong> How your skills match the job</li>
              <li><strong>Approach:</strong> How you plan to complete the work</li>
              <li><strong>Timeline:</strong> When you can start and finish</li>
              <li><strong>Rate:</strong> Your proposed fee</li>
              <li><strong>Questions:</strong> Any clarifications needed</li>
            </ul>
          `
        }
      ]
    },
    { 
      id: 'payments',
      title: 'Payments & Billing',
      icon: CreditCard,
      description: 'How payments work on Fixly',
      articles: [
        {
          id: 'how-payments-work',
          title: 'How Payments Work',
          content: `
            <h2>Secure Payment Processing</h2>
            <p>Fixly ensures secure and timely payments for all parties:</p>
            
            <h3>For Hirers</h3>
            <ul>
              <li><strong>Escrow System:</strong> Funds are held securely until work is completed</li>
              <li><strong>Payment Methods:</strong> Credit/debit cards, UPI, net banking</li>
              <li><strong>Release Process:</strong> Funds released after job completion confirmation</li>
              <li><strong>Dispute Protection:</strong> Mediation available for payment disputes</li>
            </ul>
            
            <h3>For Fixers</h3>
            <ul>
              <li><strong>Guaranteed Payment:</strong> Payment held in escrow before work starts</li>
              <li><strong>Quick Release:</strong> Funds released within 24 hours of completion</li>
              <li><strong>Multiple Withdrawals:</strong> Bank transfer, UPI, or wallet</li>
              <li><strong>Earnings Tracking:</strong> Detailed earnings dashboard</li>
            </ul>
          `
        }
      ]
    },
    { 
      id: 'safety-security',
      title: 'Safety & Security',
      icon: Shield,
      description: 'Staying safe while using Fixly',
      articles: [
        {
          id: 'safety-guidelines',
          title: 'Safety Guidelines',
          content: `
            <h2>Staying Safe on Fixly</h2>
            <p>Your safety is our priority. Follow these guidelines for a secure experience:</p>
            
            <h3>Profile Verification</h3>
            <ul>
              <li><strong>Identity Verification:</strong> Complete government ID verification</li>
              <li><strong>Phone Verification:</strong> Verify your phone number</li>
              <li><strong>Email Verification:</strong> Confirm your email address</li>
              <li><strong>Background Checks:</strong> Available for sensitive services</li>
            </ul>
            
            <h3>Communication Safety</h3>
            <ul>
              <li><strong>Platform Messaging:</strong> Use Fixly's messaging system</li>
              <li><strong>No Personal Info:</strong> Don't share personal contact details initially</li>
              <li><strong>Professional Communication:</strong> Keep conversations work-related</li>
              <li><strong>Report Issues:</strong> Report inappropriate behavior immediately</li>
            </ul>
          `
        }
      ]
    },
    { 
      id: 'account-settings',
      title: 'Account & Settings',
      icon: Settings,
      description: 'Managing your account and preferences',
      articles: [
        {
          id: 'account-management',
          title: 'Managing Your Account',
          content: `
            <h2>Account Settings and Management</h2>
            <p>Learn how to manage your Fixly account settings:</p>
            
            <h3>Profile Settings</h3>
            <ul>
              <li><strong>Personal Information:</strong> Update name, bio, and contact details</li>
              <li><strong>Profile Photo:</strong> Upload and change your profile picture</li>
              <li><strong>Location:</strong> Update your city and work area</li>
              <li><strong>Skills:</strong> Add or remove skills and certifications</li>
            </ul>
            
            <h3>Privacy Settings</h3>
            <ul>
              <li><strong>Profile Visibility:</strong> Control who can see your profile</li>
              <li><strong>Contact Information:</strong> Choose what contact info to show</li>
              <li><strong>Activity Status:</strong> Show/hide when you're online</li>
              <li><strong>Search Visibility:</strong> Appear in search results</li>
            </ul>
          `
        }
      ]
    }
  ]

  // FAQs by category
  const faqs: FAQ[] = [
    {
      id: 'general',
      title: 'General Questions',
      questions: [
        {
          q: 'How does Fixly work?',
          a: 'Fixly connects customers who need services (hirers) with skilled service providers (fixers). Hirers post jobs, fixers apply, and once hired, they complete the work and get paid securely.'
        },
        {
          q: 'Is Fixly free to use?',
          a: 'Fixly is free for hirers. Fixers get 3 free applications per month, with unlimited applications available through our Pro plan at ₹99/month.'
        },
        {
          q: 'How do I know if a fixer is reliable?',
          a: 'All fixers go through verification. You can check their ratings, reviews, portfolio, and work history before hiring.'
        },
        { 
          q: 'What if I\'m not satisfied with the work?',
          a: 'We have a dispute resolution system. Funds are held in escrow, and we mediate any issues between hirers and fixers.'
        }
      ]
    },
    { 
      id: 'payments',
      title: 'Payment Questions',
      questions: [
        {
          q: 'How do I get paid as a fixer?',
          a: 'Payments are held in escrow and released to your account within 24 hours of job completion. You can withdraw to your bank account or UPI.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept credit/debit cards, UPI, net banking, and digital wallets through our secure payment processor.'
        },
        {
          q: 'Are there any fees?',
          a: 'Hirers pay no additional fees. Fixers pay a 5% service fee on earnings and ₹99/month for Pro subscription (optional).'
        }
      ]
    },
    {
      id: 'safety',
      title: 'Safety & Security',
      questions: [
        {
          q: 'How do you verify users?',
          a: 'We verify phone numbers, email addresses, and government IDs. Background checks are available for sensitive services.'
        },
        {
          q: 'Is my personal information safe?',
          a: 'Yes, we use bank-level security and never share your personal information without consent.'
        },
        { 
          q: 'What if something goes wrong during a job?',
          a: 'Contact our support team immediately. We have 24/7 support and dispute resolution processes in place.'
        }
      ]
    }
  ]

  // Search functionality
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results: SearchResult[] = []
    helpCategories.forEach(category => {
      category.articles.forEach(article => {
        const score = calculateRelevance(query, article)
        if (score > 0) {
          results.push({
            ...article,
            category: category.title,
            categoryId: category.id,
            score
          })
        }
      })
    })

    // Add FAQ results
    faqs.forEach(faqCategory => {
      faqCategory.questions.forEach(faq => {
        const score = calculateRelevance(query, { title: faq.q, content: faq.a })
        if (score > 0) {
          results.push({
            id: `faq-${faq.q.replace(/\s+/g, '-').toLowerCase()}`,
            title: faq.q,
            content: faq.a,
            category: 'FAQ',
            categoryId: 'faq',
            score,
            type: 'faq'
          })
        }
      })
    })

    results.sort((a, b) => b.score - a.score)
    setSearchResults(results.slice(0, 10))
  }

  const calculateRelevance = (query: string, item: { title: string; content: string }) => {
    const searchTerms = query.toLowerCase().split(' ')
    let score = 0

    searchTerms.forEach(term => {
      if (item.title.toLowerCase().includes(term)) score += 3
      if (item.content.toLowerCase().includes(term)) score += 1
    })

    return score
  }

  // Handle search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Toggle FAQ
  const toggleFAQ = (id: string) => {
    setExpandedFAQs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  // Handle article feedback
  const submitFeedback = async (articleId: string, helpful: boolean) => {
    try {
      setFeedback(prev => ({ ...prev, [articleId]: helpful }))
      toast.success('Thank you for your feedback!')
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  // Render article content
  const renderContent = () => {
    if (selectedArticle) {
      const category = helpCategories.find(cat => cat.id === selectedCategory)
      const article = category?.articles.find(art => art.id === selectedArticle)
      
      if (!article) return null

      return (
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center text-primary hover:text-primary/80 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {category?.title}
          </button>
          
          <div className="glass-card p-8">
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
            
            {/* Feedback */}
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Was this article helpful?
              </h3>
              {feedback[article.id] !== undefined ? (
                <p className="text-green-600">
                  Thank you for your feedback!
                </p>
              ) : (
                <div className="flex space-x-4">
                  <button
                    onClick={() => submitFeedback(article.id, true)}
                    className="flex items-center px-4 py-2 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Yes
                  </button>
                  <button
                    onClick={() => submitFeedback(article.id, false)}
                    className="flex items-center px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    No
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }

    if (selectedCategory) {
      const category = helpCategories.find(cat => cat.id === selectedCategory)
      
      return (
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center text-primary hover:text-primary/80 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all topics
          </button>
          
          <div className="mb-8">
            <div className="flex items-center mb-4">
              {category?.icon && <category.icon className="h-8 w-8 text-primary mr-3" />}
              <h1 className="text-3xl font-bold text-text-primary">{category?.title}</h1>
            </div>
            <p className="text-text-secondary text-lg">{category?.description}</p>
          </div>
          
          <div className="grid gap-4">
            {category?.articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setSelectedArticle(article.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">{article.title}</h3>
                  <ChevronRight className="h-5 w-5 text-text-secondary" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-6xl mx-auto">
        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              Search Results ({searchResults.length})
            </h2>
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-6 cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => {
                    if (result.type === 'faq') {
                      toggleFAQ(result.id)
                    } else {
                      setSelectedCategory(result.categoryId)
                      setSelectedArticle(result.id)
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full mr-2">
                          {result.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">{result.title}</h3>
                      <p className="text-text-secondary line-clamp-2">
                        {result.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-text-secondary flex-shrink-0" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* No Search Results */}
        {searchQuery && searchResults.length === 0 && (
          <div className="text-center py-12 mb-8">
            <Search className="h-12 w-12 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No results found
            </h3>
            <p className="text-text-secondary">
              Try different keywords or browse our help topics below
            </p>
          </div>
        )}

        {/* Help Categories */}
        {!searchQuery && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Browse Help Topics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {helpCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-6 cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="flex items-center mb-4">
                      <category.icon className="h-8 w-8 text-primary mr-3" />
                      <h3 className="text-lg font-semibold text-text-primary">{category.title}</h3>
                    </div>
                    <p className="text-text-secondary mb-4">{category.description}</p>
                    <div className="flex items-center text-primary">
                      <span className="text-sm">{category.articles.length} articles</span>
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Frequently Asked Questions</h2>
              {faqs.map((faqCategory, categoryIndex) => (
                <div key={faqCategory.id} className="mb-8">
                  <h3 className="text-xl font-semibold text-text-primary mb-4">{faqCategory.title}</h3>
                  <div className="space-y-2">
                    {faqCategory.questions.map((faq, index) => {
                      const faqId = `${faqCategory.id}-${index}`
                      const isExpanded = expandedFAQs.has(faqId)
                      
                      return (
                        <motion.div
                          key={faqId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (categoryIndex * faqCategory.questions.length + index) * 0.05 }}
                          className="glass-card border border-border"
                        >
                          <button
                            onClick={() => toggleFAQ(faqId)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-surface-elevated transition-colors"
                          >
                            <span className="font-medium text-text-primary">{faq.q}</span>
                            {isExpanded ? (
                              <ChevronDown className="h-5 w-5 text-text-secondary transform rotate-180 transition-transform" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-text-secondary transition-transform" />
                            )}
                          </button>
                          {isExpanded && (
                            <div className="px-6 pb-4">
                              <p className="text-text-secondary">{faq.a}</p>
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Contact Support */}
        <div className="glass-card p-8 text-center">
          <h3 className="text-xl font-bold text-text-primary mb-4">Still need help?</h3>
          <p className="text-text-secondary mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center px-6 py-3 glass-card border border-border rounded-lg hover:shadow-lg transition-all">
              <MessageCircle className="h-5 w-5 text-primary mr-2" />
              Live Chat
            </button>
            <button className="flex items-center justify-center px-6 py-3 glass-card border border-border rounded-lg hover:shadow-lg transition-all">
              <Mail className="h-5 w-5 text-primary mr-2" />
              Email Support
            </button>
            <button className="flex items-center justify-center px-6 py-3 glass-card border border-border rounded-lg hover:shadow-lg transition-all">
              <Phone className="h-5 w-5 text-primary mr-2" />
              Call Us
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <PageLayout
      title="Help Center"
      description="Find answers to common questions and get help with using Fixly."
    >
      {/* Header */}
      <div className="bg-surface-elevated border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-4">
              How can we help you?
            </h1>
            <p className="text-text-secondary text-lg mb-8">
              Find answers to common questions or browse our help topics
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help..."
                  className="w-full pl-12 pr-4 py-4 text-lg border border-border rounded-xl bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </PageLayout>
  )
}

export default function HelpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading help center...</p>
        </div>
      </div>
    }>
      <HelpPageContent />
    </Suspense>
  )
}