// components/FadeInOnView.tsx
import { motion } from "framer-motion";
import { ReactNode } from "react";

type FadeInOnViewProps = {
  children: ReactNode;
  y?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
};

export default function FadeInOnView({
  children,
  y = 50,
  duration = 0.8,
  delay = 0,
  once = true,
}: FadeInOnViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
