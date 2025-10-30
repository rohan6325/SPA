import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollSection from './ScrollSection'
import './LandingPage.css'

gsap.registerPlugin(ScrollTrigger)

function LandingPage() {
  const navigate = useNavigate()
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  // Refs
  const cursorRef = useRef(null)
  const cursorFollowerRef = useRef(null)

  useEffect(() => {
    // Custom cursor animation
    const cursor = cursorRef.current
    const cursorFollower = cursorFollowerRef.current

    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
      })
      gsap.to(cursorFollower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3
      })
    }

    window.addEventListener('mousemove', moveCursor)

    // Hero entrance animation
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    heroTl
      .from('.hero h1', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        delay: 0.3
      })
      .from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 1
      }, '-=0.6')
      .from('.hero-cta button', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
      }, '-=0.5')
      .from('.scroll-indicator', {
        opacity: 0,
        y: 20,
        duration: 0.8
      }, '-=0.4')

    // Navbar scroll effect
    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      toggleClass: { targets: '.navbar', className: 'scrolled' }
    })

    // Parallax on hero background
    gsap.to('.hero-bg-overlay', {
      yPercent: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    })

    // Feature cards stagger animation
    const featureCards = gsap.utils.toArray('.feature-card')
    featureCards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'back.out(1.4)'
      })

      // Hover animation
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -10, scale: 1.03, duration: 0.3, ease: 'power2.out' })
      })
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' })
      })
    })

    // Stats counter animation
    const statNumbers = gsap.utils.toArray('.stat-number')
    statNumbers.forEach((stat) => {
      const target = stat.textContent
      const isPercentage = target.includes('%')
      const hasPlus = target.includes('+')
      const isSlash = target.includes('/')

      if (!isSlash) {
        const number = parseInt(target.replace(/\D/g, ''))

        ScrollTrigger.create({
          trigger: stat,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.from(stat, {
              textContent: 0,
              duration: 2,
              ease: 'power1.out',
              snap: { textContent: 1 },
              onUpdate: function() {
                const currentNum = Math.ceil(this.targets()[0].textContent)
                if (isPercentage) {
                  stat.textContent = currentNum + '%'
                } else if (hasPlus) {
                  stat.textContent = currentNum + '+'
                } else {
                  stat.textContent = currentNum
                }
              }
            })
          }
        })
      }
    })

    // Magnetic button effect
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary')
    magneticButtons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        gsap.to(cursorFollower, { scale: 3, duration: 0.3 })
      })
      button.addEventListener('mouseleave', () => {
        gsap.to(cursorFollower, { scale: 1, duration: 0.3 })
        gsap.to(button, { x: 0, y: 0, duration: 0.3 })
      })
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        gsap.to(button, { x: x * 0.3, y: y * 0.3, duration: 0.3 })
      })
    })

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', moveCursor)
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([contactForm])

      if (error) throw error

      setMessage({ text: 'Thank you! We will contact you soon.', type: 'success' })
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
      setMessage({ text: 'Error submitting form. Please try again.', type: 'error' })
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: newsletterEmail }])

      if (error) throw error

      setMessage({ text: 'Successfully subscribed to newsletter!', type: 'success' })
      setNewsletterEmail('')
    } catch (error) {
      setMessage({ text: 'Error subscribing. Please try again.', type: 'error' })
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToSection = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Custom Cursor */}
      <div ref={cursorRef} className="custom-cursor"></div>
      <div ref={cursorFollowerRef} className="custom-cursor-follower"></div>

      <div className="landing-page">
        {/* Hero Section */}
        <header className="hero">
          <div className="hero-bg-overlay"></div>
          <nav className="navbar">
            <div className="container">
              <div className="logo">
                <h2>YourBusiness</h2>
              </div>
              <ul className="nav-links">
                <li><a onClick={() => scrollToSection('#services')}>Services</a></li>
                <li><a onClick={() => scrollToSection('#about')}>About</a></li>
                <li><a onClick={() => scrollToSection('#contact')}>Contact</a></li>
                <li><button className="btn-primary" onClick={() => navigate('/quote')}>Get a Quote</button></li>
              </ul>
            </div>
          </nav>

          <div className="hero-content container">
            <h1>Transform Your Business with Professional Solutions</h1>
            <p className="hero-subtitle">We deliver exceptional services tailored to your needs. Get started with a free quote today.</p>
            <div className="hero-cta">
              <button className="btn-large btn-primary" onClick={() => navigate('/quote')}>Request a Quote</button>
              <button className="btn-large btn-secondary" onClick={() => scrollToSection('#contact')}>
                Contact Us
              </button>
            </div>
          </div>

          <div className="scroll-indicator">
            <span>Scroll</span>
            <div className="scroll-line"></div>
          </div>
        </header>

        {/* Features Section with ScrollSection wrapper */}
        <ScrollSection className="features" id="services">
          <h2 className="section-title">Our Services</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Web Development</h3>
              <p>Custom websites and web applications built with modern technologies and best practices.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Apps</h3>
              <p>Native and cross-platform mobile applications for iOS and Android devices.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>UI/UX Design</h3>
              <p>Beautiful, user-friendly interfaces that engage your audience and drive conversions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">☁️</div>
              <h3>Cloud Solutions</h3>
              <p>Scalable cloud infrastructure and deployment solutions for your applications.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Security</h3>
              <p>Comprehensive security audits and implementations to protect your data.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Consulting</h3>
              <p>Expert advice and strategy to help your business leverage technology effectively.</p>
            </div>
          </div>
        </ScrollSection>

        {/* About Section with parallax */}
        <ScrollSection className="about" id="about" parallaxSpeed={-0.3}>
          <div className="about-content">
            <div className="about-text">
              <h2>Why Choose Us</h2>
              <p>We are a team of dedicated professionals committed to delivering excellence. With years of experience and a passion for innovation, we help businesses succeed in the digital age.</p>
              <ul className="benefits-list">
                <li>✓ 10+ Years of Experience</li>
                <li>✓ 500+ Successful Projects</li>
                <li>✓ 98% Client Satisfaction Rate</li>
                <li>✓ Award-Winning Team</li>
              </ul>
            </div>
            <div className="about-image">
              <div className="placeholder-image">
                <span>Your Success Story Starts Here</span>
              </div>
            </div>
          </div>
        </ScrollSection>

        {/* Stats Section with pin effect */}
        <ScrollSection className="stats" pin={true}>
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-number">500+</h3>
              <p>Projects Completed</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">250+</h3>
              <p>Happy Clients</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">98%</h3>
              <p>Satisfaction Rate</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">24/7</h3>
              <p>Support Available</p>
            </div>
          </div>
        </ScrollSection>

        {/* Contact Section */}
        <ScrollSection className="contact" id="contact">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Contact Information</h3>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div>
                  <h4>Email</h4>
                  <p>info@yourbusiness.com</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <h4>Phone</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <h4>Address</h4>
                  <p>123 Business St, Suite 100<br/>City, State 12345</p>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleContactSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Your Name"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Subject"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea
                  required
                  rows="5"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Tell us about your project..."
                />
              </div>
              <button type="submit" className="btn-primary btn-large" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
              {message.text && (
                <div className={`message ${message.type}`}>
                  {message.text}
                </div>
              )}
            </form>
          </div>
        </ScrollSection>

        {/* Newsletter Section */}
        <ScrollSection className="newsletter">
          <h2>Stay Updated</h2>
          <p>Subscribe to our newsletter for the latest updates and insights.</p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </ScrollSection>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h3>YourBusiness</h3>
                <p>Transforming businesses through innovative solutions.</p>
              </div>
              <div className="footer-section">
                <h4>Quick Links</h4>
                <ul>
                  <li><a onClick={() => scrollToSection('#services')}>Services</a></li>
                  <li><a onClick={() => scrollToSection('#about')}>About</a></li>
                  <li><a onClick={() => scrollToSection('#contact')}>Contact</a></li>
                  <li><a onClick={() => navigate('/quote')}>Get Quote</a></li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Legal</h4>
                <ul>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2025 YourBusiness. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default LandingPage
