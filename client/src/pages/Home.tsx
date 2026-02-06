import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import SplitText from "@/components/SplitText";
import CircularText from "@/components/CircularText";
import ShinyText from '@/components/ShinyText';
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import StarBorder from '@/components/StarBorder';


const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

export default function Home() {
  const queryClient = useQueryClient();
  const [hasAccess, setHasAccess] = React.useState(() => {
    // Check in-memory flag (resets on reload)
    if (typeof window !== 'undefined') {
      return !!(window as any).introDismissed;
    }
    return false;
  });

  React.useEffect(() => {
    const handleIntro = () => setHasAccess(true);
    window.addEventListener('intro-enter', handleIntro);
    return () => window.removeEventListener('intro-enter', handleIntro);
  }, []);

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: [api.events.list.path],
      queryFn: async () => {
        const res = await fetch(api.events.list.path);
        if (!res.ok) throw new Error("Failed to load events");
        const data = api.events.list.responses[200].parse(await res.json());

        // Preload images aggressively
        data.forEach((event) => {
          if (event.imageUrl) {
            const img = new Image();
            img.src = event.imageUrl;
          }
        });

        return data;
      },
    });
  };

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-0 left-0 w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >

      {hasAccess && (
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
              text="velvyt"
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

          <StarBorder
            as={Link}
            href="/events"
            onMouseEnter={handleMouseEnter}
            className="cursor-pointer"
            color="white"
            speed="3s"
          >
            <div className="flex items-center gap-3 font-bold uppercase tracking-widest text-xs px-4">
              Break In
              <ArrowRight className="w-4 h-4" />
            </div>
          </StarBorder>
        </motion.div>
      )}

      {/* BOTTOM CENTER TEXT */}

      {/* BOTTOM CENTER TEXT */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-12 text-[10px] text-white/20 font-mono tracking-widest uppercase">
        <span>In Jaipur</span>
      </div>
      {/* 🔥 Shiny TEXT - MIDDLE */}

      {/* 🔥 CIRCULAR TEXT — BOTTOM LEFT */}
      <div className="fixed bottom-6 left-6 z-20 scale-75 origin-bottom-left">
        <CircularText
          text="Instagram"
          onHover="speedUp"
          spinDuration={43}
          className="text-white/60 text-xs"
        />
      </div>

    </motion.div >
  );
}
