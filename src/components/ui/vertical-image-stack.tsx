"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, type PanInfo, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"

const images = [
  { id: 1, src: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80", alt: "Omakase Selection", title: "The Trust", desc: "Let the chef guide you" },
  { id: 2, src: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80", alt: "Fresh Sashimi", title: "Purity", desc: "Direct from the ocean" },
  { id: 3, src: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=800&q=80", alt: "Ocean Treasures", title: "Depth", desc: "Treasures of the sea" },
  { id: 4, src: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&q=80", alt: "Signature Ramen", title: "Warmth", desc: "Comfort in a bowl" },
  { id: 5, src: "https://images.unsplash.com/photo-1580828369019-2238b909ca8c?w=800&q=80", alt: "Chef's Creation", title: "Craft", desc: "Years of mastery" },
  { id: 6, src: "https://images.unsplash.com/photo-1534422298391-e4f8c170db76?w=800&q=80", alt: "Tempura", title: "Crisp", desc: "The light touch" },
  { id: 7, src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80", alt: "Artisan Sashimi", title: "Precision", desc: "Every cut matters" },
  { id: 8, src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80", alt: "Zen Interior", title: "Space", desc: "Minimalist beauty" },
  { id: 9, src: "https://images.unsplash.com/photo-1590377435160-c335805f639a?w=800&q=80", alt: "Premium Sake", title: "Balance", desc: "The perfect pairing" },
  { id: 10, src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", alt: "The Experience", title: "Together", desc: "Shared moments" },
]

interface VerticalImageStackProps {
  onComplete?: () => void
  completeTab?: string
}

export function VerticalImageStack({ onComplete, completeTab }: VerticalImageStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFinal, setShowFinal] = useState(false)
  const lastNavigationTime = useRef(0)
  const navigationCooldown = 400

  const navigate = useCallback((newDirection: number, forceAdvance = false) => {
    if (showFinal) return
    
    const now = Date.now()
    if (now - lastNavigationTime.current < navigationCooldown && !forceAdvance) return
    lastNavigationTime.current = now

    setCurrentIndex((prev) => {
      if (newDirection > 0) {
        if (prev === images.length - 1 && !showFinal) {
          setShowFinal(true)
          return prev
        }
        return prev === images.length - 1 ? 0 : prev + 1
      }
      if (showFinal && newDirection < 0) {
        setShowFinal(false)
        return prev
      }
      return prev === 0 ? images.length - 1 : prev - 1
    })
  }, [showFinal])

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (showFinal) return
    const threshold = 50
    if (info.offset.y < -threshold) {
      navigate(1)
    } else if (info.offset.y > threshold) {
      navigate(-1)
    }
  }

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (showFinal) return
      if (Math.abs(e.deltaY) > 30) {
        if (e.deltaY > 0) {
          navigate(1)
        } else {
          navigate(-1)
        }
      }
    },
    [navigate, showFinal],
  )

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: true })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [handleWheel])

  const getCardStyle = (index: number) => {
    const total = images.length
    let diff = index - currentIndex
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total

    if (diff === 0) {
      return { y: 0, scale: 1, opacity: 1, zIndex: 5, rotateX: 0 }
    } else if (diff === -1) {
      return { y: -160, scale: 0.82, opacity: 0.6, zIndex: 4, rotateX: 8 }
    } else if (diff === -2) {
      return { y: -280, scale: 0.7, opacity: 0.3, zIndex: 3, rotateX: 15 }
    } else if (diff === 1) {
      return { y: 160, scale: 0.82, opacity: 0.6, zIndex: 4, rotateX: -8 }
    } else if (diff === 2) {
      return { y: 280, scale: 0.7, opacity: 0.3, zIndex: 3, rotateX: -15 }
    } else {
      return { y: diff > 0 ? 400 : -400, scale: 0.6, opacity: 0, zIndex: 0, rotateX: diff > 0 ? -20 : 20 }
    }
  }

  const isVisible = (index: number) => {
    const total = images.length
    let diff = index - currentIndex
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total
    return Math.abs(diff) <= 2
  }

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/[0.03] blur-3xl" />
      </div>

      <div className="relative flex h-[500px] w-[320px] items-center justify-center" style={{ perspective: "1200px" }}>
        {images.map((image, index) => {
          if (!isVisible(index)) return null
          const style = getCardStyle(index)
          const isCurrent = index === currentIndex

          return (
            <motion.div
              key={image.id}
              className="absolute cursor-grab active:cursor-grabbing"
              animate={{
                y: style.y,
                scale: style.scale,
                opacity: style.opacity,
                rotateX: style.rotateX,
                zIndex: style.zIndex,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1,
              }}
              drag={isCurrent ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{
                transformStyle: "preserve-3d",
                zIndex: style.zIndex,
              }}
            >
              <div
                className="relative h-[420px] w-[280px] overflow-hidden rounded-3xl bg-zinc-900 ring-1 ring-yellow-400/20"
                style={{
                  boxShadow: isCurrent
                    ? "0 25px 50px -12px rgba(212,175,55,0.15), 0 0 0 1px rgba(212,175,55,0.05)"
                    : "0 10px 30px -10px rgba(0,0,0,0.3)",
                }}
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-yellow-400/10 via-transparent to-transparent" />

                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  draggable={false}
                  priority={isCurrent}
                  sizes="280px"
                />

                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="absolute right-8 top-1/2 flex -translate-y-1/2 flex-col gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (index !== currentIndex) {
                setCurrentIndex(index)
              }
            }}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "h-6 bg-yellow-400" : "bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="flex flex-col items-center gap-2 text-white/40">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M5 12l7-7 7 7" />
            </svg>
          </motion.div>
          <span className="text-xs font-medium tracking-widest uppercase">Scroll or drag</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute left-8 top-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-4xl font-light text-yellow-400 tabular-nums">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <div className="my-2 h-px w-8 bg-yellow-400/20" />
          <span className="text-sm text-white/40 tabular-nums">{String(images.length).padStart(2, "0")}</span>
        </div>
      </div>

      <AnimatePresence>
        {showFinal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center px-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative inline-flex items-center justify-center mb-8"
              >
                <div className="w-24 h-px bg-yellow-400/30" />
                <span className="text-yellow-400 text-xs tracking-[0.6em] uppercase font-bold mx-4">
                  The Journey
                </span>
                <div className="w-24 h-px bg-yellow-400/30" />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-4xl md:text-6xl font-serif italic text-white mb-6"
              >
                Taste the <span className="text-yellow-400">story</span>
              </motion.h2>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-center gap-8 md:gap-16 mb-12"
              >
                <div className="text-center">
                  <span className="block text-3xl md:text-4xl font-serif text-yellow-400">200g</span>
                  <span className="text-xs text-white/40 uppercase tracking-wider">fresh fish</span>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="text-center">
                  <span className="block text-3xl md:text-4xl font-serif text-yellow-400">3.5cm</span>
                  <span className="text-xs text-white/40 uppercase tracking-wider">perfect cut</span>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="text-center">
                  <span className="block text-3xl md:text-4xl font-serif text-yellow-400">18°</span>
                  <span className="text-xs text-white/40 uppercase tracking-wider">degrees</span>
                </div>
              </motion.div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-white/50 text-sm md:text-base max-w-md mx-auto mb-12"
              >
                Each nigiri: a moment frozen in time. 
                Chef&apos;s vision, ocean&apos;s gift, rice farmer&apos;s prayer — on your plate.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
              >
                <button 
                  onClick={() => {
                    if (onComplete && completeTab) {
                      onComplete()
                    } else if (completeTab) {
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  }}
                  className="group flex items-center gap-3 text-yellow-400 text-sm tracking-[0.3em] uppercase hover:text-white transition-colors mx-auto"
                >
                  <span>Explore the menu</span>
                  <motion.span 
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="group-hover:text-white"
                  >
                    →
                  </motion.span>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}