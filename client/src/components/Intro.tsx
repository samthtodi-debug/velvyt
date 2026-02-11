import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PixelSnow from "./PixelSnow";

export function Intro({ onEnter }: { onEnter: () => void }) {
    const [isVisible, setIsVisible] = useState(true);

    const handleEnter = () => {
        setIsVisible(false);
        onEnter();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, pointerEvents: "none" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    onClick={handleEnter}
                    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                >
                    {/* Background Wallpaper */}
                    <div className="absolute inset-0 z-0">
                        <PixelSnow
                            color="#ffffff"
                            flakeSize={0.01}
                            minFlakeSize={1.25}
                            pixelResolution={200}
                            speed={1.5}
                            density={0.4}
                            direction={125}
                            brightness={1}
                            depthFade={8}
                            farPlane={20}
                            gamma={0.4545}
                            variant="square"
                        />
                    </div>
                    <div className="absolute inset-0 z-0 bg-black/60" /> {/* Overlay for text readability */}

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="relative z-10 text-center"
                    >
                        <p className="text-white/40 font-mono text-xs tracking-[0.5em] mb-4">
                            WELCOME TO
                        </p>
                        <h1 className="text-white text-6xl md:text-8xl font-display font-bold tracking-tighter mix-blend-difference mb-8">
                            VELVYT
                        </h1>
                        <div className="text-white/60 font-mono text-xs tracking-widest border border-white/20 px-6 py-3 hover:bg-white/10 transition-colors uppercase">
                            Enter Experience
                        </div>
                    </motion.div>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
