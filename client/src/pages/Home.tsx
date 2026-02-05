import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import SplitText from "@/components/SplitText";
import CircularText from "@/components/CircularText";
import ShinyText from '@/components/ShinyText';


const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

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
          EST. 2026
        </p>
        
        {/* SPLIT TEXT ONLY FOR VELVYT */}
        <h1 className="text-6xl md:text-9xl font-display font-bold tracking-tighter mb-8 mix-blend-difference overflow-hidden">
          <SplitText
            text="VELVYT"
            className="text-white inline-block"
            delay={100}
            duration={2}
            ease="elastic.out(1, 0.3)"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={handleAnimationComplete}
          />
        </h1>
        
        <p className="max-w-md mx-auto text-sm md:text-base text-muted-foreground leading-relaxed mb-12">
          Constant law curation.
        </p>

        <Link 
          href="/events"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-white/90 transition-all hover:pr-10"
        >
          Break In
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>

      {/* BOTTOM CENTER TEXT */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-12 text-[10px] text-white/20 font-mono tracking-widest uppercase">
        <span>In Jaipur</span>
      </div>
      {/* 🔥 Shiny TEXT - MIDDLE */}
      
      {/* 🔥 CIRCULAR TEXT — BOTTOM LEFT */}
      <div className="fixed bottom-6 left-6 z-20">
        <CircularText
          text="Our Insta Velvyt "
          onHover="speedUp"
          spinDuration={43}
          className="text-white/60 text-xs"
        />
      </div>

    </div>
  );
}
