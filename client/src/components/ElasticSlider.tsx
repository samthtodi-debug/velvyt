import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ElasticSliderProps {
    defaultValue?: number;
    value?: number;
    onChange?: (value: number) => void;
    className?: string;
    min?: number;
    max?: number;
}

export function ElasticSlider({
    defaultValue = 50,
    value,
    onChange,
    className,
    min = 0,
    max = 100,
}: ElasticSliderProps) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = value ?? internalValue;

    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const widthRef = useRef(0);

    // Update value -> position
    useEffect(() => {
        if (widthRef.current > 0) {
            const newX = ((currentValue - min) / (max - min)) * widthRef.current;
            x.set(newX);
        }
    }, [currentValue, min, max, x]);

    // Handle resizing
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                widthRef.current = containerRef.current.offsetWidth;
                const newX = ((currentValue - min) / (max - min)) * widthRef.current;
                x.set(newX);
            }
        };

        updateWidth();
        // Use ResizeObserver for more robust resizing detection
        const observer = new ResizeObserver(updateWidth);
        if (containerRef.current) observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [currentValue, min, max, x]);

    const handleDrag = () => {
        if (!widthRef.current) return;
        const currentX = x.get();
        // Clamp between 0 and width
        const clampedX = Math.max(0, Math.min(currentX, widthRef.current));

        // Calculate new value
        const newValue = Math.round((clampedX / widthRef.current) * (max - min) + min);

        if (newValue !== currentValue) {
            if (onChange) onChange(newValue);
            setInternalValue(newValue);
        }
    };

    const trackScaleY = useTransform(x, [0, widthRef.current / 2, widthRef.current], [0.85, 1.15, 0.85]);

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full h-10 flex items-center touch-none cursor-pointer", className)}
        >
            {/* Track Background */}
            <div className="absolute w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                {/* Fill */}
                <motion.div
                    className="absolute inset-y-0 left-0 bg-white"
                    style={{ width: x, scaleY: trackScaleY, originY: 0.5 }}
                />
            </div>

            {/* Thumb */}
            <motion.div
                drag="x"
                dragConstraints={containerRef}
                dragElastic={0}
                dragMomentum={false}
                onDrag={handleDrag}
                onDragEnd={handleDrag}
                style={{ x }}
                className="absolute top-1/2 -mt-3 -ml-3 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
            >
                <div className="w-2 h-2 bg-black/50 rounded-full" />
            </motion.div>
        </div>
    );
}
