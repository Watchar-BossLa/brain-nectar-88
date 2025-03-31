
// Re-export all motion components from our framer-motion-stub
// This allows component files to import from this central file
import { 
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

// Export all from the stub
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
};

// Export convenience type for component props
export type MotionProps = React.ComponentProps<typeof motion.div>;
