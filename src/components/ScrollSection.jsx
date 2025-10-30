import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ScrollSection.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * Reusable ScrollSection Component
 * Creates cinematic scroll-triggered animations for content
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.pin - Whether to pin this section during animation
 * @param {number} props.parallaxSpeed - Speed for parallax effect (0 = no parallax)
 */
function ScrollSection({
  children,
  className = '',
  pin = false,
  parallaxSpeed = 0,
  id = ''
}) {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current

    if (!section || !content) return

    // Main timeline for section entrance
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%', // Start animation when section is 80% into viewport
        end: 'top 20%',   // End when section is 20% into viewport
        toggleActions: 'play none none reverse',
        // markers: true, // Uncomment for debugging
      }
    })

    // Animate content: fade in + slide up
    tl.fromTo(
      content,
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }
    )

    // Add pin effect if specified
    if (pin) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=100%', // Pin for the height of the section
        pin: true,
        pinSpacing: true,
        // markers: true, // Uncomment for debugging
      })
    }

    // Add parallax effect if specified
    if (parallaxSpeed !== 0) {
      gsap.to(content, {
        y: parallaxSpeed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1, // Smooth scrubbing
        }
      })
    }

    // Cleanup on unmount
    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section) st.kill()
      })
    }
  }, [pin, parallaxSpeed])

  return (
    <section
      ref={sectionRef}
      className={`scroll-section ${className}`}
      id={id}
    >
      <div ref={contentRef} className="scroll-section-content">
        {children}
      </div>
    </section>
  )
}

export default ScrollSection
