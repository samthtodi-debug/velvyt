import { useState, useEffect, useRef } from "react";
import ElasticSlider from "./ElasticSlider";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [isMuted, setIsMuted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const closeTimerRef = useRef<NodeJS.Timeout>();

    // Initialize audio
    useEffect(() => {
        // Using a more reliable lo-fi stream or file
        audioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3");
        audioRef.current.loop = true;
        audioRef.current.volume = volume / 100;

        // Add event listeners for error handling
        const handleError = (e: Event) => console.error("Audio error:", e);
        audioRef.current.addEventListener('error', handleError);

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener('error', handleError);
                audioRef.current = null;
            }
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        };
    }, []);

    // Handle Play/Pause
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Autoplay prevented or failed:", error);
                        // Optional: setIsPlaying(false) if we want to reflect that it failed
                    });
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    // Handle Volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume / 100;
        }
    }, [volume, isMuted]);

    // Auto-close Logic
    const resetCloseTimer = () => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        if (isOpen) {
            closeTimerRef.current = setTimeout(() => {
                setIsOpen(false);
            }, 1500); // 1.5 seconds
        }
    };

    useEffect(() => {
        if (isOpen) {
            resetCloseTimer();
        } else {
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        }
    }, [isOpen]);

    const toggleMute = () => setIsMuted(!isMuted);

    return (
        <div
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto"
            onMouseEnter={resetCloseTimer}
            onMouseMove={resetCloseTimer}
            onMouseLeave={() => isOpen && resetCloseTimer()}
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 bg-black/60 backdrop-blur-xl border border-white/20 p-4 rounded-xl w-64 shadow-2xl"
                    >
                        <ElasticSlider
                            defaultValue={isMuted ? 0 : volume}
                            startingValue={0}
                            maxValue={100}
                            isStepped={false}
                            stepSize={1}
                            onChange={(v) => {
                                setVolume(v);
                                if (isMuted && v > 0) setIsMuted(false);
                                resetCloseTimer();
                            }}
                            className="mb-1"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/20 p-2 rounded-full shadow-lg hover:bg-black/70 transition-colors">
                {/* Play/Pause Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10 text-white hover:bg-white/20 hover:text-white transition-all"
                    onClick={() => setIsPlaying(!isPlaying)}
                >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </Button>

                {/* Volume Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10 text-white hover:bg-white/20 hover:text-white transition-all"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
}
