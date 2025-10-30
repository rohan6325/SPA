import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './QuoteGenerator.css'

function QuoteGenerator() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [quoteData, setQuoteData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    company_name: '',
    service_type: '',
    description: '',
    budget_range: '',
    project_timeline: '',
    notes: ''
  })

  const serviceTypes = [
    'Web Development',
    'Mobile App Development',
    'UI/UX Design',
    'Cloud Solutions',
    'Security Audit',
    'Consulting',
    'E-commerce',
    'Custom Software',
    'Other'
  ]

  const budgetRanges = [
    'Under $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000 - $100,000',
    'Over $100,000'
  ]

  const timelines = [
    'Less than 1 month',
    '1-3 months',
    '3-6 months',
    '6-12 months',
    'More than 1 year',
    'Flexible'
  ]

  const handleInputChange = (field, value) => {
    setQuoteData({ ...quoteData, [field]: value })
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return quoteData.client_name && quoteData.client_email
      case 2:
        return quoteData.service_type
      case 3:
        return quoteData.description && quoteData.budget_range && quoteData.project_timeline
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('quotes')
        .insert([{
          ...quoteData,
          status: 'pending'
        }])
        .select()

      if (error) throw error

      console.log('Quote submitted successfully:', data)
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting quote:', error)
      alert('Error submitting quote. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="quote-generator">
        <div className="container">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h1>Quote Request Submitted!</h1>
            <p>Thank you for your interest, {quoteData.client_name}!</p>
            <p>We've received your quote request and will get back to you within 24 hours at {quoteData.client_email}.</p>
            <div className="success-actions">
              <button className="btn-primary btn-large" onClick={() => navigate('/')}>
                Back to Home
              </button>
              <button className="btn-secondary btn-large" onClick={() => {
                setSubmitted(false)
                setCurrentStep(1)
                setQuoteData({
                  client_name: '',
                  client_email: '',
                  client_phone: '',
                  company_name: '',
                  service_type: '',
                  description: '',
                  budget_range: '',
                  project_timeline: '',
                  notes: ''
                })
              }}>
                Submit Another Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="quote-generator">
      <div className="quote-header">
        <div className="container">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <h1>Request a Quote</h1>
          <p>Get a customized quote for your project in 3 easy steps</p>
        </div>
      </div>

      <div className="container">
        <div className="progress-bar">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Contact Info</div>
          </div>
          <div className="progress-line" />
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Service Type</div>
          </div>
          <div className="progress-line" />
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Project Details</div>
          </div>
        </div>

        <form className="quote-form" onSubmit={handleSubmit}>
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <div className="form-step">
              <h2>Tell us about yourself</h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={quoteData.client_name}
                    onChange={(e) => handleInputChange('client_name', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={quoteData.client_email}
                    onChange={(e) => handleInputChange('client_email', e.target.value)}
                    placeholder="john@company.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={quoteData.client_phone}
                    onChange={(e) => handleInputChange('client_phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={quoteData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    placeholder="Your Company"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Service Type */}
          {currentStep === 2 && (
            <div className="form-step">
              <h2>What service are you interested in?</h2>
              <div className="service-grid">
                {serviceTypes.map((service) => (
                  <div
                    key={service}
                    className={`service-card ${quoteData.service_type === service ? 'selected' : ''}`}
                    onClick={() => handleInputChange('service_type', service)}
                  >
                    <div className="service-icon">
                      {service === 'Web Development' && '🌐'}
                      {service === 'Mobile App Development' && '📱'}
                      {service === 'UI/UX Design' && '🎨'}
                      {service === 'Cloud Solutions' && '☁️'}
                      {service === 'Security Audit' && '🔒'}
                      {service === 'Consulting' && '💼'}
                      {service === 'E-commerce' && '🛒'}
                      {service === 'Custom Software' && '⚙️'}
                      {service === 'Other' && '✨'}
                    </div>
                    <h3>{service}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Project Details */}
          {currentStep === 3 && (
            <div className="form-step">
              <h2>Tell us about your project</h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Project Description *</label>
                  <textarea
                    required
                    rows="5"
                    value={quoteData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your project, goals, and requirements..."
                  />
                </div>
                <div className="form-group">
                  <label>Budget Range *</label>
                  <select
                    required
                    value={quoteData.budget_range}
                    onChange={(e) => handleInputChange('budget_range', e.target.value)}
                  >
                    <option value="">Select budget range</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Project Timeline *</label>
                  <select
                    required
                    value={quoteData.project_timeline}
                    onChange={(e) => handleInputChange('project_timeline', e.target.value)}
                  >
                    <option value="">Select timeline</option>
                    {timelines.map((timeline) => (
                      <option key={timeline} value={timeline}>{timeline}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Additional Notes</label>
                  <textarea
                    rows="3"
                    value={quoteData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional information you'd like to share..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" className="btn-secondary" onClick={prevStep}>
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                className="btn-primary"
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !validateStep(currentStep)}
              >
                {loading ? 'Submitting...' : 'Submit Quote Request'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuoteGenerator
