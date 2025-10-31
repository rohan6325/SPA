import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './HorizontalScroll.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * HorizontalScroll Component
 * Creates horizontal scrolling animation with 3D text effects
 * Scrolling vertically moves content horizontally with 3D transforms
 *
 * @param {Object} props
 * @param {Array} props.items - Array of text items to display
 * @param {string} props.direction - 'left' or 'right'
 * @param {boolean} props.use3D - Enable 3D perspective
 * @param {number} props.speed - Scroll speed multiplier
 */
function HorizontalScroll({
  items = [],
  direction = 'left',
  use3D = true,
  speed = 1,
  className = ''
}) {
  const containerRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const scrollContainer = scrollRef.current

    if (!container || !scrollContainer) return

    // Calculate total scroll distance
    const scrollWidth = scrollContainer.scrollWidth
    const containerWidth = container.offsetWidth
    const scrollDistance = scrollWidth - containerWidth

    // Set 3D perspective
    if (use3D) {
      gsap.set(container, {
        perspective: 1000,
        transformStyle: 'preserve-3d'
      })
    }

    // Horizontal scroll animation
    const horizontalScroll = gsap.to(scrollContainer, {
      x: direction === 'left' ? -scrollDistance : scrollDistance,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${scrollDistance * speed}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        // markers: true, // Uncomment for debugging
      }
    })

    // 3D text animations for each item
    if (use3D) {
      const textItems = scrollContainer.querySelectorAll('.horizontal-item')

      textItems.forEach((item, index) => {
        // Rotation effect as it comes into view
        gsap.fromTo(
          item,
          {
            rotationY: direction === 'left' ? 90 : -90,
            rotationX: 30,
            z: -500,
            opacity: 0.3,
          },
          {
            rotationY: 0,
            rotationX: 0,
            z: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              containerAnimation: horizontalScroll,
              start: 'left right',
              end: 'center center',
              scrub: 1,
              // markers: true, // Uncomment for debugging
            }
          }
        )

        // Continue rotation as it leaves view
        gsap.to(item, {
          rotationY: direction === 'left' ? -90 : 90,
          rotationX: -30,
          z: -500,
          opacity: 0.3,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: item,
            containerAnimation: horizontalScroll,
            start: 'center center',
            end: 'right left',
            scrub: 1,
          }
        })
      })
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === container) st.kill()
      })
    }
  }, [items, direction, use3D, speed])

  return (
    <div
      ref={containerRef}
      className={`horizontal-scroll-container ${className}`}
    >
      <div ref={scrollRef} className="horizontal-scroll-content">
        {items.map((item, index) => (
          <div
            key={index}
            className="horizontal-item"
            style={{
              background: item.background || 'transparent',
              color: item.color || '#fff'
            }}
          >
            <div className="item-content">
              {item.icon && <div className="item-icon">{item.icon}</div>}
              <h2 className="item-title">{item.title}</h2>
              {item.subtitle && <p className="item-subtitle">{item.subtitle}</p>}
              {item.description && <p className="item-description">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HorizontalScroll
