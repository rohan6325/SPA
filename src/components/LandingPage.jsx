import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LocomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.css'
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
  const scrollRef = useRef(null)
  const locomotiveScrollRef = useRef(null)
  const cursorRef = useRef(null)
  const cursorFollowerRef = useRef(null)

  useEffect(() => {
    // Initialize Locomotive Scroll
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      multiplier: 1,
      class: 'is-revealed',
      smartphone: {
        smooth: true
      },
      tablet: {
        smooth: true
      }
    })

    locomotiveScrollRef.current = scroll

    // Sync ScrollTrigger with Locomotive Scroll
    scroll.on('scroll', ScrollTrigger.update)

    ScrollTrigger.scrollerProxy(scrollRef.current, {
      scrollTop(value) {
        return arguments.length
          ? scroll.scrollTo(value, { duration: 0, disableLerp: true })
          : scroll.scroll.instance.scroll.y
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        }
      },
      pinType: scrollRef.current.style.transform ? 'transform' : 'fixed'
    })

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

    // Hero Timeline
    const heroTl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    })

    heroTl
      .from('.hero h1', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        delay: 0.5
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
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scroller: scrollRef.current,
      onUpdate: (self) => {
        if (self.progress > 0.1) {
          gsap.to('.navbar', {
            backgroundColor: 'rgba(15, 12, 41, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '20px 0',
            duration: 0.3
          })
        } else {
          gsap.to('.navbar', {
            backgroundColor: 'rgba(15, 12, 41, 0.8)',
            padding: '30px 0',
            duration: 0.3
          })
        }
      }
    })

    // Features Timeline
    const featureCards = gsap.utils.toArray('.feature-card')
    featureCards.forEach((card, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 30%',
          scroller: scrollRef.current,
          toggleActions: 'play none none reverse'
        }
      })

      tl.from(card, {
        y: 100,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: 'back.out(1.4)'
      })
    })

    // About Section Timeline
    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.about',
        start: 'top 70%',
        end: 'top 20%',
        scroller: scrollRef.current,
        toggleActions: 'play none none reverse'
      }
    })

    aboutTl
      .from('.about-text h2', {
        x: -100,
        opacity: 0,
        duration: 1
      })
      .from('.about-text p', {
        x: -100,
        opacity: 0,
        duration: 0.8
      }, '-=0.6')
      .from('.benefits-list li', {
        x: -50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1
      }, '-=0.4')
      .from('.about-image', {
        x: 100,
        opacity: 0,
        scale: 0.95,
        duration: 1
      }, '-=1.2')

    // Stats Counter Timeline
    const statsCards = gsap.utils.toArray('.stat-card')
    statsCards.forEach((card) => {
      const statNumber = card.querySelector('.stat-number')
      const target = statNumber.textContent
      const isPercentage = target.includes('%')
      const hasPlus = target.includes('+')
      const isSlash = target.includes('/')
      const number = parseInt(target.replace(/\D/g, ''))

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          scroller: scrollRef.current,
          toggleActions: 'play none none none',
          once: true
        }
      })

      tl.from(card, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      })

      if (!isSlash) {
        tl.from(statNumber, {
          textContent: 0,
          duration: 2,
          ease: 'power1.out',
          snap: { textContent: 1 },
          onUpdate: function() {
            const currentNum = Math.ceil(this.targets()[0].textContent)
            if (isPercentage) {
              statNumber.textContent = currentNum + '%'
            } else if (hasPlus) {
              statNumber.textContent = currentNum + '+'
            } else {
              statNumber.textContent = currentNum
            }
          }
        }, '-=1.5')
      }
    })

    // Contact Section Timeline
    const contactTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.contact',
        start: 'top 70%',
        end: 'top 20%',
        scroller: scrollRef.current,
        toggleActions: 'play none none reverse'
      }
    })

    contactTl
      .from('.contact .section-title', {
        y: 50,
        opacity: 0,
        duration: 0.8
      })
      .from('.contact-info', {
        x: -80,
        opacity: 0,
        duration: 1
      }, '-=0.4')
      .from('.contact-info .contact-item', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15
      }, '-=0.6')
      .from('.contact-form', {
        x: 80,
        opacity: 0,
        duration: 1
      }, '-=1.2')

    // Newsletter Timeline
    const newsletterTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.newsletter',
        start: 'top 75%',
        scroller: scrollRef.current,
        toggleActions: 'play none none reverse'
      }
    })

    newsletterTl
      .from('.newsletter h2', {
        y: 50,
        opacity: 0,
        duration: 0.8
      })
      .from('.newsletter p', {
        y: 30,
        opacity: 0,
        duration: 0.6
      }, '-=0.4')
      .from('.newsletter-form', {
        y: 30,
        opacity: 0,
        duration: 0.8
      }, '-=0.3')

    // Section Titles
    const sectionTitles = gsap.utils.toArray('.section-title')
    sectionTitles.forEach((title) => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          scroller: scrollRef.current,
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      })
    })

    // Parallax Effects
    gsap.to('.hero-bg-overlay', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scroller: scrollRef.current,
        scrub: 1
      },
      opacity: 1,
      scale: 1.2
    })

    // Magnetic Buttons
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
        gsap.to(button, {
          x: 0,
          y: 0,
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
    })

    // Feature card hover animations
    featureCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.03,
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

    // Update ScrollTrigger on Locomotive Scroll events
    ScrollTrigger.addEventListener('refresh', () => scroll.update())
    ScrollTrigger.refresh()

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      scroll.destroy()
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
    const target = document.querySelector(id)
    if (target && locomotiveScrollRef.current) {
      locomotiveScrollRef.current.scrollTo(target, {
        duration: 1500,
        easing: [0.25, 0.0, 0.35, 1.0]
      })
    }
  }

  return (
    <>
      {/* Custom Cursor */}
      <div ref={cursorRef} className="custom-cursor"></div>
      <div ref={cursorFollowerRef} className="custom-cursor-follower"></div>

      <div className="landing-page" ref={scrollRef} data-scroll-container>
        {/* Hero Section */}
        <header className="hero" data-scroll-section>
          <div className="hero-bg-overlay" data-scroll data-scroll-speed="-2"></div>
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

          <div className="hero-content container" data-scroll data-scroll-speed="1">
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

        {/* Features Section */}
        <section className="features" id="services" data-scroll-section>
          <div className="container">
            <h2 className="section-title" data-scroll data-scroll-speed="0.5">Our Services</h2>
            <div className="features-grid">
              <div className="feature-card" data-scroll data-scroll-speed="0.5">
                <div className="feature-icon">🚀</div>
                <h3>Web Development</h3>
                <p>Custom websites and web applications built with modern technologies and best practices.</p>
              </div>
              <div className="feature-card" data-scroll data-scroll-speed="0.6">
                <div className="feature-icon">📱</div>
                <h3>Mobile Apps</h3>
                <p>Native and cross-platform mobile applications for iOS and Android devices.</p>
              </div>
              <div className="feature-card" data-scroll data-scroll-speed="0.7">
                <div className="feature-icon">🎨</div>
                <h3>UI/UX Design</h3>
                <p>Beautiful, user-friendly interfaces that engage your audience and drive conversions.</p>
              </div>
              <div className="feature-card" data-scroll data-scroll-speed="0.5">
                <div className="feature-icon">☁️</div>
                <h3>Cloud Solutions</h3>
                <p>Scalable cloud infrastructure and deployment solutions for your applications.</p>
              </div>
              <div className="feature-card" data-scroll data-scroll-speed="0.6">
                <div className="feature-icon">🔒</div>
                <h3>Security</h3>
                <p>Comprehensive security audits and implementations to protect your data.</p>
              </div>
              <div className="feature-card" data-scroll data-scroll-speed="0.7">
                <div className="feature-icon">📊</div>
                <h3>Consulting</h3>
                <p>Expert advice and strategy to help your business leverage technology effectively.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about" id="about" data-scroll-section>
          <div className="container">
            <div className="about-content">
              <div className="about-text" data-scroll data-scroll-speed="0.5">
                <h2>Why Choose Us</h2>
                <p>We are a team of dedicated professionals committed to delivering excellence. With years of experience and a passion for innovation, we help businesses succeed in the digital age.</p>
                <ul className="benefits-list">
                  <li>✓ 10+ Years of Experience</li>
                  <li>✓ 500+ Successful Projects</li>
                  <li>✓ 98% Client Satisfaction Rate</li>
                  <li>✓ Award-Winning Team</li>
                </ul>
              </div>
              <div className="about-image" data-scroll data-scroll-speed="0.8">
                <div className="placeholder-image">
                  <span>Your Success Story Starts Here</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats" data-scroll-section>
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card" data-scroll data-scroll-speed="0.5">
                <h3 className="stat-number">500+</h3>
                <p>Projects Completed</p>
              </div>
              <div className="stat-card" data-scroll data-scroll-speed="0.6">
                <h3 className="stat-number">250+</h3>
                <p>Happy Clients</p>
              </div>
              <div className="stat-card" data-scroll data-scroll-speed="0.7">
                <h3 className="stat-number">98%</h3>
                <p>Satisfaction Rate</p>
              </div>
              <div className="stat-card" data-scroll data-scroll-speed="0.8">
                <h3 className="stat-number">24/7</h3>
                <p>Support Available</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact" id="contact" data-scroll-section>
          <div className="container">
            <h2 className="section-title">Get In Touch</h2>
            <div className="contact-content">
              <div className="contact-info" data-scroll data-scroll-speed="0.5">
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

              <form className="contact-form" onSubmit={handleContactSubmit} data-scroll data-scroll-speed="0.7">
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
        <section className="newsletter" data-scroll-section>
          <div className="container">
            <h2 data-scroll data-scroll-speed="0.5">Stay Updated</h2>
            <p data-scroll data-scroll-speed="0.6">Subscribe to our newsletter for the latest updates and insights.</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit} data-scroll data-scroll-speed="0.7">
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
        <footer className="footer" data-scroll-section>
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
