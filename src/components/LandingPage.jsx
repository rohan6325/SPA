import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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

  // Refs for animations
  const heroRef = useRef(null)
  const heroTitleRef = useRef(null)
  const heroSubtitleRef = useRef(null)
  const heroCTARef = useRef(null)
  const featuresRef = useRef(null)
  const aboutRef = useRef(null)
  const statsRef = useRef(null)
  const contactRef = useRef(null)
  const cursorRef = useRef(null)
  const cursorFollowerRef = useRef(null)

  useEffect(() => {
    // Smooth scroll behavior
    const lenis = {
      scrollTo: (target) => {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
      }
    }

    // Custom cursor
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

    // Hero animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from(heroTitleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      delay: 0.3
    })
    .from(heroSubtitleRef.current, {
      y: 50,
      opacity: 0,
      duration: 1
    }, '-=0.6')
    .from(heroCTARef.current.children, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2
    }, '-=0.5')

    // Parallax effect on hero
    gsap.to(heroRef.current, {
      backgroundPosition: '50% 100%',
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })

    // Features cards animation
    const featureCards = document.querySelectorAll('.feature-card')
    featureCards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power2.out'
      })

      // Hover effect
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })

    // About section animation
    gsap.from('.about-text h2', {
      scrollTrigger: {
        trigger: aboutRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      x: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    gsap.from('.about-text p', {
      scrollTrigger: {
        trigger: aboutRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      x: -100,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out'
    })

    gsap.from('.benefits-list li', {
      scrollTrigger: {
        trigger: aboutRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      x: -50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.4,
      ease: 'power2.out'
    })

    gsap.from('.about-image', {
      scrollTrigger: {
        trigger: aboutRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      x: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number')
    statNumbers.forEach((stat) => {
      const target = stat.textContent
      const isPercentage = target.includes('%')
      const number = parseInt(target.replace(/\D/g, ''))

      ScrollTrigger.create({
        trigger: stat,
        start: 'top 80%',
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
              } else if (target.includes('+')) {
                stat.textContent = currentNum + '+'
              } else if (target.includes('/')) {
                stat.textContent = '24/7'
              } else {
                stat.textContent = currentNum
              }
            }
          })
        }
      })
    })

    // Contact form animation
    gsap.from('.contact-info', {
      scrollTrigger: {
        trigger: contactRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      x: -80,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    gsap.from('.contact-form', {
      scrollTrigger: {
        trigger: contactRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      x: 80,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    // Magnetic buttons
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary')
    magneticButtons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        gsap.to(cursorFollower, {
          scale: 3,
          duration: 0.3
        })
      })

      button.addEventListener('mouseleave', () => {
        gsap.to(cursorFollower, {
          scale: 1,
          duration: 0.3
        })
      })

      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2

        gsap.to(button, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3
        })
      })

      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.3
        })
      })
    })

    // Section titles animation
    const sectionTitles = document.querySelectorAll('.section-title')
    sectionTitles.forEach(title => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      })
    })

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

  return (
    <div className="landing-page">
      {/* Custom Cursor */}
      <div ref={cursorRef} className="custom-cursor"></div>
      <div ref={cursorFollowerRef} className="custom-cursor-follower"></div>

      {/* Hero Section */}
      <header className="hero" ref={heroRef}>
        <div className="hero-bg-overlay"></div>
        <nav className="navbar">
          <div className="container">
            <div className="logo">
              <h2>YourBusiness</h2>
            </div>
            <ul className="nav-links">
              <li><a href="#services">Services</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><button className="btn-primary" onClick={() => navigate('/quote')}>Get a Quote</button></li>
            </ul>
          </div>
        </nav>

        <div className="hero-content container">
          <h1 ref={heroTitleRef}>Transform Your Business with Professional Solutions</h1>
          <p className="hero-subtitle" ref={heroSubtitleRef}>We deliver exceptional services tailored to your needs. Get started with a free quote today.</p>
          <div className="hero-cta" ref={heroCTARef}>
            <button className="btn-large btn-primary" onClick={() => navigate('/quote')}>Request a Quote</button>
            <button className="btn-large btn-secondary" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
              Contact Us
            </button>
          </div>
        </div>

        <div className="scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features" id="services" ref={featuresRef}>
        <div className="container">
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
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about" ref={aboutRef}>
        <div className="container">
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
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats" ref={statsRef}>
        <div className="container">
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
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact" ref={contactRef}>
        <div className="container">
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
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="container">
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
        </div>
      </section>

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
                <li><a href="#services">Services</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
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
  )
}

export default LandingPage
