import { useState, useEffect, useRef } from "react";
import { ElasticSlider } from "./ElasticSlider";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [isMuted, setIsMuted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio
    useEffect(() => {
        audioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=lofi-study-112191.mp3"); // Free lofi track as placeholder
        audioRef.current.loop = true;
        audioRef.current.volume = volume / 100;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Handle Play/Pause
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    // Handle Volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume / 100;
            if (!isMuted && audioRef.current.volume === 0 && volume > 0) {
                // audioRef.current.volume = volume / 100; 
            }
        }
    }, [volume, isMuted]);

    const toggleMute = () => setIsMuted(!isMuted);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl w-64 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-3 text-white/80">
                            <span className="text-xs font-medium tracking-widest uppercase">Volume</span>
                            <span className="text-xs font-mono">{isMuted ? "0" : volume}%</span>
                        </div>

                        <ElasticSlider
                            value={isMuted ? 0 : volume}
                            onChange={(v) => {
                                setVolume(v);
                                if (isMuted && v > 0) setIsMuted(false);
                            }}
                            className="mb-2"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 p-2 rounded-full shadow-lg">
                {/* Play/Pause Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10 text-white hover:bg-white/10 hover:text-white"
                    onClick={() => setIsPlaying(!isPlaying)}
                >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </Button>

                {/* Volume Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10 text-white hover:bg-white/10 hover:text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
}
