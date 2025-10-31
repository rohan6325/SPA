import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FallingSection from '../components/FallingSection'
import HorizontalScroll from '../components/HorizontalScroll'
import './AnimationDemo.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * Comprehensive Animation Demo Page
 * Combines falling animations with horizontal scroll effects
 * Features 3D perspective, gravity-like motion, and scroll-triggered animations
 */
function AnimationDemo() {
  const navigate = useNavigate()

  useEffect(() => {
    // Navbar scroll effect
    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      toggleClass: { targets: '.demo-nav', className: 'scrolled' }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // Horizontal scroll items with 3D effects
  const horizontalItems = [
    {
      title: 'Immersive',
      subtitle: '3D Animations',
      description: 'Experience depth with perspective transforms',
      icon: '✨',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff'
    },
    {
      title: 'Horizontal',
      subtitle: 'Scroll Magic',
      description: 'Vertical scroll controls horizontal movement',
      icon: '→',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#fff'
    },
    {
      title: 'Smooth',
      subtitle: 'Transitions',
      description: 'Buttery smooth 60fps animations',
      icon: '⚡',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: '#fff'
    },
    {
      title: 'Perspective',
      subtitle: 'Depth Effects',
      description: 'Elements rotate in 3D space',
      icon: '🎯',
      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      color: '#fff'
    },
    {
      title: 'Interactive',
      subtitle: 'Scroll Control',
      description: 'You control the speed and direction',
      icon: '🎮',
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      color: '#fff'
    }
  ]

  return (
    <div className="animation-demo">
      {/* Navigation */}
      <nav className="demo-nav">
        <div className="nav-container">
          <h2>Animation Showcase</h2>
          <button className="nav-back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>
      </nav>

      {/* Hero Section with Falling Elements */}
      <FallingSection
        className="hero-section"
        background="linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)"
        use3D={true}
        elements={[
          {
            content: <div className="float-orb orb-1"></div>,
            startY: -400,
            endY: 1000,
            startX: -150,
            endX: 100,
            startZ: -800,
            endZ: 0,
            startScale: 0.5,
            endScale: 1.5,
            startOpacity: 0.2,
            endOpacity: 0.8,
            scrub: 2,
            style: { left: '10%', top: '20%' }
          },
          {
            content: <div className="float-orb orb-2"></div>,
            startY: -300,
            endY: 900,
            startX: 150,
            endX: -80,
            startZ: -600,
            endZ: 0,
            startRotation: 0,
            endRotation: 360,
            startOpacity: 0.3,
            endOpacity: 1,
            scrub: 1.5,
            style: { right: '15%', top: '30%' }
          },
          {
            content: <div className="float-orb orb-3"></div>,
            startY: -500,
            endY: 800,
            startScale: 0.3,
            endScale: 1.2,
            startOpacity: 0.2,
            endOpacity: 0.6,
            scrub: 1.8,
            style: { left: '50%', top: '15%' }
          },
          ...Array.from({ length: 10 }, (_, i) => ({
            content: <div className="particle"></div>,
            startY: -Math.random() * 300 - 100,
            endY: Math.random() * 1000 + 500,
            startX: (Math.random() - 0.5) * 200,
            endX: (Math.random() - 0.5) * 100,
            startOpacity: Math.random() * 0.4 + 0.2,
            endOpacity: Math.random() * 0.2,
            scrub: Math.random() * 2 + 0.5,
            style: {
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }
          }))
        ]}
      >
        <div className="hero-content">
          <h1 className="hero-title">Scroll-Triggered</h1>
          <h2 className="hero-subtitle">3D Animation Experience</h2>
          <p className="hero-description">
            Combining gravity-like falling effects with horizontal scroll magic
          </p>
          <div className="scroll-prompt">
            <span className="scroll-arrow">↓</span>
            <p>Scroll to explore</p>
          </div>
        </div>
      </FallingSection>

      {/* Horizontal Scroll Section */}
      <HorizontalScroll
        items={horizontalItems}
        direction="left"
        use3D={true}
        speed={1.5}
        className="horizontal-demo"
      />

      {/* Falling Grid Section */}
      <FallingSection
        className="grid-section"
        background="linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%)"
        use3D={true}
        elements={[
          // Grid of falling cards
          ...Array.from({ length: 6 }, (_, i) => ({
            content: (
              <div className="falling-card">
                <div className="card-number">{i + 1}</div>
                <div className="card-title">Feature {i + 1}</div>
              </div>
            ),
            startY: -200 - (i % 3) * 100,
            endY: 700 + (i % 2) * 200,
            startX: ((i % 3) - 1) * 80,
            endX: ((i % 2) - 0.5) * 50,
            startZ: -400 - (i % 3) * 100,
            endZ: 0,
            startRotation: (i % 2) * 180 - 90,
            endRotation: 0,
            startOpacity: 0,
            endOpacity: 1,
            startScale: 0.5,
            endScale: 1,
            scrub: 1 + (i % 3) * 0.3,
            style: {
              left: `${20 + (i % 3) * 30}%`,
              top: `${20 + Math.floor(i / 3) * 40}%`
            }
          }))
        ]}
      >
        <div className="grid-content">
          <h2>Falling Grid Animation</h2>
          <p>Cards fall and rotate in 3D space as you scroll</p>
        </div>
      </FallingSection>

      {/* Diagonal Movement Section */}
      <FallingSection
        className="diagonal-section"
        background="linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)"
        elements={[
          {
            content: (
              <div className="text-panel panel-1">
                <h3>Diagonal</h3>
                <p>Motion</p>
              </div>
            ),
            startY: -400,
            endY: 600,
            startX: -300,
            endX: 200,
            startOpacity: 0,
            endOpacity: 1,
            scrub: 1.2,
            style: { left: '20%', top: '25%' }
          },
          {
            content: (
              <div className="text-panel panel-2">
                <h3>Smooth</h3>
                <p>Gravity</p>
              </div>
            ),
            startY: -300,
            endY: 700,
            startX: 300,
            endX: -150,
            startOpacity: 0,
            endOpacity: 1,
            scrub: 1.5,
            style: { right: '20%', top: '20%' }
          },
          {
            content: <div className="diagonal-line line-1"></div>,
            startY: -200,
            endY: 800,
            startX: -100,
            endX: 100,
            startRotation: -45,
            endRotation: 45,
            startOpacity: 0.2,
            endOpacity: 0.8,
            scrub: 1,
            style: { left: '30%', top: '50%' }
          },
          {
            content: <div className="diagonal-line line-2"></div>,
            startY: -150,
            endY: 750,
            startX: 100,
            endX: -100,
            startRotation: 45,
            endRotation: -45,
            startOpacity: 0.3,
            endOpacity: 0.9,
            scrub: 1.3,
            style: { right: '30%', top: '45%' }
          }
        ]}
      >
        <div className="diagonal-content">
          <h2>Diagonal Drift</h2>
          <p>Elements move diagonally while falling</p>
        </div>
      </FallingSection>

      {/* Parallax Layers Section */}
      <FallingSection
        className="parallax-section"
        background="linear-gradient(135deg, #134e4a 0%, #065f46 100%)"
        pin={true}
        elements={[
          // Background layer
          {
            content: <div className="parallax-layer layer-back"></div>,
            startY: -100,
            endY: 300,
            startScale: 1.5,
            endScale: 2,
            startOpacity: 0.3,
            endOpacity: 0.6,
            scrub: 3,
            style: { left: '25%', top: '30%' }
          },
          // Middle layer
          {
            content: <div className="parallax-layer layer-middle"></div>,
            startY: -150,
            endY: 400,
            startRotation: -180,
            endRotation: 180,
            startOpacity: 0.4,
            endOpacity: 0.8,
            scrub: 2,
            style: { right: '25%', top: '35%' }
          },
          // Front layer
          {
            content: <div className="parallax-layer layer-front"></div>,
            startY: -200,
            endY: 500,
            startX: -80,
            endX: 80,
            startOpacity: 0.5,
            endOpacity: 1,
            scrub: 1,
            style: { left: '50%', top: '40%' }
          }
        ]}
      >
        <div className="parallax-content">
          <h2>Parallax Depth</h2>
          <p>Multiple layers create depth perception</p>
          <p className="subtitle">Section pinned while layers move</p>
        </div>
      </FallingSection>

      {/* Final Section */}
      <FallingSection
        className="final-section"
        background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        elements={[
          {
            content: (
              <div className="success-badge">
                <span className="badge-icon">✓</span>
              </div>
            ),
            startY: 400,
            endY: -100,
            startScale: 0.3,
            endScale: 2,
            startRotation: -180,
            endRotation: 0,
            startOpacity: 0,
            endOpacity: 1,
            scrub: 1.5,
            style: { left: '50%', top: '35%', transform: 'translateX(-50%)' }
          },
          ...Array.from({ length: 12 }, (_, i) => ({
            content: <div className="celebration-particle"></div>,
            startY: -300,
            endY: 900,
            startX: (Math.random() - 0.5) * 400,
            endX: (Math.random() - 0.5) * 300,
            startRotation: Math.random() * 360,
            endRotation: Math.random() * 1080,
            startOpacity: 0,
            endOpacity: 0.9,
            scrub: Math.random() * 2 + 0.8,
            style: {
              left: `${10 + i * 7}%`,
              top: '15%'
            }
          }))
        ]}
      >
        <div className="final-content">
          <h2>Scroll-Controlled Animations</h2>
          <p>Every movement tied to your scroll position</p>
          <p className="final-note">Scroll back up to see reverse motion</p>
          <button className="cta-button" onClick={() => navigate('/')}>
            Explore More
          </button>
        </div>
      </FallingSection>

      {/* Footer */}
      <footer className="animation-footer">
        <p>Built with GSAP ScrollTrigger + React</p>
        <p>Combining horizontal scroll with falling animations</p>
      </footer>
    </div>
  )
}

export default AnimationDemo
