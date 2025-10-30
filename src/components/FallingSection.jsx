import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './FallingSection.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * FallingSection Component
 * Creates scroll-triggered falling animations with gravity-like effects
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.background - Background color or gradient
 * @param {boolean} props.pin - Whether to pin this section
 * @param {Array} props.elements - Array of element configs for falling animations
 * @param {boolean} props.use3D - Enable 3D perspective
 */
function FallingSection({
  children,
  className = '',
  background = '#0a0a0f',
  pin = false,
  elements = [],
  use3D = false,
  id = ''
}) {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current

    if (!section) return

    // Apply 3D perspective to section if enabled
    if (use3D) {
      gsap.set(section, {
        perspective: 1000,
        transformStyle: 'preserve-3d'
      })
    }

    // Main content fade-in animation
    gsap.from(content, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power2.out'
    })

    // Animate falling elements
    elements.forEach((element, index) => {
      const el = section.querySelector(`.fall-element-${index}`)
      if (!el) return

      // Create falling animation tied to scroll
      gsap.fromTo(
        el,
        {
          y: element.startY || -200,
          x: element.startX || 0,
          rotation: element.startRotation || 0,
          scale: element.startScale || 0.8,
          opacity: element.startOpacity || 0,
          z: element.startZ || 0,
        },
        {
          y: element.endY || 200,
          x: element.endX || 0,
          rotation: element.endRotation || 0,
          scale: element.endScale || 1,
          opacity: element.endOpacity || 1,
          z: element.endZ || 0,
          ease: element.ease || 'none', // 'none' for smooth scroll-controlled motion
          scrollTrigger: {
            trigger: section,
            start: element.start || 'top bottom',
            end: element.end || 'bottom top',
            scrub: element.scrub !== undefined ? element.scrub : 1, // Smooth scroll binding
            // markers: true, // Uncomment for debugging
          }
        }
      )
    })

    // Pin section if specified
    if (pin) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: true,
      })
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section) st.kill()
      })
    }
  }, [pin, elements, use3D])

  return (
    <section
      ref={sectionRef}
      className={`falling-section ${className}`}
      style={{ background }}
      id={id}
    >
      <div ref={contentRef} className="falling-section-content">
        {children}
        {/* Render falling elements */}
        {elements.map((element, index) => (
          <div
            key={index}
            className={`falling-element fall-element-${index}`}
            style={{
              ...element.style,
              position: 'absolute',
              willChange: 'transform'
            }}
          >
            {element.content}
          </div>
        ))}
      </div>
    </section>
  )
}

export default FallingSection
