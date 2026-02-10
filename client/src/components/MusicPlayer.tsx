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
    const volumeRef = useRef(volume);

    // Initialize audio
    useEffect(() => {
        // Using local audio file
        audioRef.current = new Audio("/audio/music.mp3");
        audioRef.current.loop = false; // Disable native loop to handle fade-in manually
        audioRef.current.volume = volume / 100;

        // Function to play audio
        const playAudio = async () => {
            if (!audioRef.current) return;
            try {
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (error) {
                console.error("Playback failed:", error);
                setIsPlaying(false);
            }
        };

        const fadeIn = () => {
            const audio = audioRef.current;
            if (!audio) return;

            // Target is current user volume setting
            const targetVolume = volumeRef.current / 100;
            const duration = 3000; // 3 seconds fade in
            const interval = 50;
            const steps = duration / interval;
            const stepSize = targetVolume / steps;

            // Start silent
            audio.volume = 0;

            const fadeInterval = setInterval(() => {
                // Stop if audio is gone or paused manually, or if we reached target
                if (!audio || audio.paused) {
                    clearInterval(fadeInterval);
                    return;
                }

                // Smoothly ramp up to target volume
                // Always fetch fresh target from ref (in case user changes volume during fade)
                const currentTarget = volumeRef.current / 100;

                if (audio.volume < currentTarget) {
                    const newVol = Math.min(currentTarget, audio.volume + stepSize);
                    audio.volume = newVol;
                } else {
                    // We reached the target (or exceeded, so we clamp)
                    // If audio.volume >= currentTarget, we are done.
                    // But wait, if user lowered volume, we might be above target already?
                    // In that case, volume effect handles it. Here just stop fading.
                    clearInterval(fadeInterval);
                }
            }, interval);
        };

        const handleEnded = () => {
            if (!audioRef.current) return;
            audioRef.current.currentTime = 0;

            // Play returns a promise
            audioRef.current.play()
                .then(() => {
                    // Once playing starts, begin fade in
                    fadeIn();
                })
                .catch(e => console.error("Loop restart failed:", e));
        };

        const handleIntroEnter = () => {
            playAudio();
        };

        // Listen for events
        window.addEventListener('intro-enter', handleIntroEnter);

        if (audioRef.current) {
            audioRef.current.addEventListener('ended', handleEnded);
        }

        return () => {
            window.removeEventListener('intro-enter', handleIntroEnter);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener('ended', handleEnded);
                audioRef.current = null;
            }
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        };
    }, []);

    // Handle Play/Pause synchronization
    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            if (audioRef.current.paused) {
                audioRef.current.play().catch(e => console.error("Sync play failed:", e));
            }
        } else {
            if (!audioRef.current.paused) {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    // Handle Volume
    useEffect(() => {
        volumeRef.current = isMuted ? 0 : volume; // Sync ref
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
