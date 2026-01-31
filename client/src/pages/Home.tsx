import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 text-center px-4"
      >
        <p className="text-xs md:text-sm font-mono text-white/40 tracking-[0.5em] mb-6 md:mb-8">
          EST. 2024
        </p>
        
        <h1 className="text-6xl md:text-9xl font-display font-bold text-white tracking-tighter mb-8 mix-blend-difference">
          VELVYT
        </h1>
        
        <p className="max-w-md mx-auto text-sm md:text-base text-muted-foreground leading-relaxed mb-12">
          Curating exclusive nightlife experiences for the discerning few. 
          Where luxury meets the underground.
        </p>

        <Link 
          href="/events"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-white/90 transition-all hover:pr-10"
        >
          Enter The Void
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>

      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-12 text-[10px] text-white/20 font-mono tracking-widest uppercase">
        <span>New York</span>
        <span>London</span>
        <span>Tokyo</span>
      </div>
    </div>
  );
}
