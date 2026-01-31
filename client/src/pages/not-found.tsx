import { Link } from "wouter";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-[120px] font-display leading-none font-bold text-white/5">404</h1>
        <p className="text-xl font-medium mb-8">This page has dissolved into the void.</p>
        <Link 
          href="/"
          className="text-xs uppercase tracking-widest border-b border-white/20 pb-1 hover:text-white/60 hover:border-white/60 transition-colors"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
