
// Re-export all motion components from our framer-motion-stub
// This allows component files to import from this central file

export {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useTransform,
  useScroll,
  useSpring,
  useInView,
  useDragControls,
  useVelocity
} from '@/lib/framer-motion-stub';

// Export convenience type for component props
export type MotionProps = React.ComponentProps<typeof motion.div>;
