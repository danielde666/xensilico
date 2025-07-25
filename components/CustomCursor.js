// components/CustomCursor.js
import { useEffect, useRef } from 'react'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    let mouseX = 0, mouseY = 0
    let currentX = 0, currentY = 0
    const speed = 0.6 // Increased speed for faster following

    // Hide the original cursor
    document.body.classList.add('custom-cursor-active')

    const animate = () => {
      currentX += (mouseX - currentX) * speed
      currentY += (mouseY - currentY) * speed
      if (cursor) {
        cursor.style.transform = `translate(${currentX}px, ${currentY}px)`
      }
      requestAnimationFrame(animate)
    }

    const handleMouseMove = e => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const handleEnter = () => {
      if (cursor) cursor.classList.add(styles['cursor-hover'])
    }
    const handleLeave = () => {
      if (cursor) cursor.classList.remove(styles['cursor-hover'])
    }

    // Show cursor on hoverable elements
    const handleElementEnter = () => {
      if (cursor) cursor.classList.add(styles['cursor-hover'])
    }
    const handleElementLeave = () => {
      if (cursor) cursor.classList.remove(styles['cursor-hover'])
    }

    document.addEventListener('mousemove', handleMouseMove)
    
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"], .hover-target')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleElementEnter)
      el.addEventListener('mouseleave', handleElementLeave)
    })

    animate()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.body.classList.remove('custom-cursor-active') // Restore cursor on cleanup
      
      // Clean up event listeners
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleElementEnter)
        el.removeEventListener('mouseleave', handleElementLeave)
      })
    }
  }, [])

  return <div ref={cursorRef} className={styles.cursor}></div>
}
