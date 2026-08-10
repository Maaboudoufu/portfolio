import { motion } from 'motion/react';
import { useSprings } from './motion-presets';

export default function Reveal({ children, ...props }) {
  const s = useSprings();
  return (
    <motion.div
      initial={{ opacity: 0, y: s.reduced ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={s.ui}
      {...props}
    >
      {children}
    </motion.div>
  );
}
