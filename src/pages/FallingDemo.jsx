import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FallingSection from '../components/FallingSection'
import './FallingDemo.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * Falling Animation Demo Page
 * Showcases various falling and scroll-triggered effects
 */
function FallingDemo() {
  useEffect(() => {
    // Global smooth scroll setup
    gsap.to(window, {
      scrollTo: { y: 0 },
      duration: 0
    })

    // Navbar scroll effect
    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      toggleClass: { targets: '.demo-navbar', className: 'scrolled' }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div className="falling-demo">
      {/* Navigation */}
      <nav className="demo-navbar">
        <div className="nav-content">
          <h2>Falling Animations</h2>
          <div className="nav-links">
            <a href="#intro">Intro</a>
            <a href="#scene1">Scene 1</a>
            <a href="#scene2">Scene 2</a>
            <a href="#end">End</a>
          </div>
        </div>
      </nav>

      {/* INTRO SECTION - Simple falling text */}
      <FallingSection
        id="intro"
        className="intro-section"
        background="linear-gradient(135deg, #0f0c29 0%, #302b63 100%)"
        elements={[
          {
            content: <div className="floating-shape circle"></div>,
            startY: -300,
            endY: 800,
            startX: -100,
            endX: 50,
            startOpacity: 0.3,
            endOpacity: 1,
            scrub: 2,
            style: { left: '10%', top: '20%' }
          },
          {
            content: <div className="floating-shape square"></div>,
            startY: -200,
            endY: 900,
            startX: 50,
            endX: -30,
            startRotation: 0,
            endRotation: 360,
            scrub: 1.5,
            style: { right: '15%', top: '30%' }
          },
          {
            content: <div className="floating-shape triangle"></div>,
            startY: -400,
            endY: 700,
            startScale: 0.5,
            endScale: 1.2,
            scrub: 1.8,
            style: { left: '50%', top: '10%' }
          }
        ]}
      >
        <div className="intro-content">
          <h1 className="mega-title">Scroll-Triggered</h1>
          <h2 className="mega-subtitle">Falling Animations</h2>
          <p className="intro-text">
            Elements fall naturally as you scroll, creating an immersive gravity-like experience
          </p>
          <div className="scroll-hint">
            <span>↓</span>
            <p>Scroll to see magic</p>
          </div>
        </div>
      </FallingSection>

      {/* SCENE 1 - Diagonal falling with 3D */}
      <FallingSection
        id="scene1"
        className="scene-1"
        background="linear-gradient(135deg, #24243e 0%, #0f0f15 100%)"
        use3D={true}
        elements={[
          {
            content: (
              <div className="text-block">
                <h3>Smooth</h3>
              </div>
            ),
            startY: -300,
            endY: 600,
            startX: -200,
            endX: 100,
            startZ: -500,
            endZ: 0,
            startOpacity: 0,
            endOpacity: 1,
            scrub: 1,
            style: { left: '20%', top: '20%' }
          },
          {
            content: (
              <div className="text-block">
                <h3>Motion</h3>
              </div>
            ),
            startY: -400,
            endY: 700,
            startX: 200,
            endX: -100,
            startZ: -600,
            endZ: 0,
            startOpacity: 0,
            endOpacity: 1,
            scrub: 1.3,
            style: { right: '20%', top: '15%' }
          },
          {
            content: <div className="floating-shape hexagon"></div>,
            startY: -250,
            endY: 850,
            startRotation: -180,
            endRotation: 180,
            startScale: 0.5,
            endScale: 1,
            scrub: 1.7,
            style: { left: '50%', top: '40%' }
          },
          {
            content: <div className="floating-particle"></div>,
            startY: -100,
            endY: 1000,
            startX: -50,
            endX: 30,
            startOpacity: 0.5,
            endOpacity: 0.2,
            scrub: 0.8,
            style: { left: '30%', top: '60%' }
          },
          {
            content: <div className="floating-particle"></div>,
            startY: -150,
            endY: 950,
            startX: 40,
            endX: -20,
            startOpacity: 0.6,
            endOpacity: 0.3,
            scrub: 1.1,
            style: { right: '25%', top: '50%' }
          }
        ]}
      >
        <div className="scene-content">
          <h2>Diagonal Fall</h2>
          <p>Elements drift horizontally while falling, creating natural motion</p>
        </div>
      </FallingSection>

      {/* SCENE 2 - Parallax layers with pin */}
      <FallingSection
        id="scene2"
        className="scene-2"
        background="linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%)"
        pin={true}
        elements={[
          // Background layer - slowest
          {
            content: <div className="layer-circle layer-bg"></div>,
            startY: -100,
            endY: 400,
            startScale: 0.8,
            endScale: 1.2,
            startOpacity: 0.2,
            endOpacity: 0.4,
            scrub: 3,
            style: { left: '15%', top: '30%' }
          },
          // Middle layer - medium speed
          {
            content: <div className="layer-square layer-mid"></div>,
            startY: -150,
            endY: 500,
            startRotation: -90,
            endRotation: 90,
            startOpacity: 0.3,
            endOpacity: 0.6,
            scrub: 2,
            style: { right: '20%', top: '25%' }
          },
          // Foreground layer - fastest
          {
            content: <div className="layer-triangle layer-fg"></div>,
            startY: -200,
            endY: 600,
            startX: -50,
            endX: 50,
            startOpacity: 0.4,
            endOpacity: 0.9,
            scrub: 1,
            style: { left: '50%', top: '20%' }
          },
          // Additional particles
          ...Array.from({ length: 6 }, (_, i) => ({
            content: <div className="floating-dot"></div>,
            startY: -Math.random() * 200 - 100,
            endY: Math.random() * 600 + 400,
            startX: (Math.random() - 0.5) * 100,
            endX: (Math.random() - 0.5) * 50,
            startOpacity: Math.random() * 0.3 + 0.2,
            endOpacity: Math.random() * 0.2,
            scrub: Math.random() * 2 + 0.5,
            style: {
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }
          }))
        ]}
      >
        <div className="scene-content pinned-content">
          <h2>Parallax Layers</h2>
          <p>Multiple layers moving at different speeds create depth</p>
          <p className="subtitle">This section pins while elements fall through</p>
        </div>
      </FallingSection>

      {/* END SECTION - Gentle fade and rise */}
      <FallingSection
        id="end"
        className="end-section"
        background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        elements={[
          {
            content: (
              <div className="end-message">
                <span className="checkmark">✓</span>
              </div>
            ),
            startY: 300,
            endY: -50,
            startScale: 0.5,
            endScale: 1.5,
            startOpacity: 0,
            endOpacity: 1,
            scrub: 1.5,
            style: { left: '50%', top: '40%', transform: 'translateX(-50%)' }
          },
          ...Array.from({ length: 8 }, (_, i) => ({
            content: <div className="confetti"></div>,
            startY: -200,
            endY: 800,
            startX: (Math.random() - 0.5) * 300,
            endX: (Math.random() - 0.5) * 200,
            startRotation: Math.random() * 360,
            endRotation: Math.random() * 720,
            startOpacity: 0,
            endOpacity: 0.8,
            scrub: Math.random() * 2 + 1,
            style: {
              left: `${20 + i * 10}%`,
              top: '20%'
            }
          }))
        ]}
      >
        <div className="end-content">
          <h2>Smooth Gravity</h2>
          <p>All animations are controlled by your scroll speed</p>
          <p className="final-note">Scroll back up to see the reverse motion</p>
        </div>
      </FallingSection>

      {/* Footer */}
      <footer className="demo-footer">
        <p>Built with GSAP ScrollTrigger + React</p>
        <p>Scroll to control the falling motion</p>
      </footer>
    </div>
  )
}

export default FallingDemo
