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
    // Use controlled or uncontrolled state
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = value ?? internalValue;

    const constraintsRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const widthRef = useRef(0);

    // Convert value (0-100) to position (0-width)
    useEffect(() => {
        if (widthRef.current) {
            const newX = ((currentValue - min) / (max - min)) * widthRef.current;
            x.set(newX);
        }
    }, [currentValue, min, max, x]);

    // Handle resizing or initial measurement
    useEffect(() => {
        if (!constraintsRef.current) return;

        const updateWidth = () => {
            if (constraintsRef.current) {
                widthRef.current = constraintsRef.current.offsetWidth;
                // Re-set x based on current value and new width
                const newX = ((currentValue - min) / (max - min)) * widthRef.current;
                x.set(newX);
            }
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, [currentValue, min, max, x]);

    // Calculate value from position
    const handleDrag = () => {
        if (!widthRef.current) return;
        const currentX = x.get();
        const clampedX = Math.max(0, Math.min(currentX, widthRef.current));

        const newValue = Math.round((clampedX / widthRef.current) * (max - min) + min);

        if (newValue !== currentValue) {
            if (onChange) onChange(newValue);
            setInternalValue(newValue);
        }
    };

    // Elastic track transformation based on thumb position
    // The track will slightly "bend" or scale based on where usage is
    const trackScaleY = useTransform(x, [0, widthRef.current / 2, widthRef.current], [0.8, 1.2, 0.8]);

    return (
        <div className={cn("relative w-full h-8 flex items-center touch-none", className)}>
            {/* Track */}
            <div
                ref={constraintsRef}
                className="absolute w-full h-1.5 bg-secondary/50 rounded-full overflow-hidden"
            >
                <motion.div
                    className="absolute inset-y-0 left-0 bg-primary"
                    style={{ width: x, scaleY: trackScaleY }}
                />
            </div>

            {/* Thumb */}
            <motion.div
                drag="x"
                dragConstraints={constraintsRef}
                dragElastic={0.1}
                dragMomentum={false}
                onDrag={handleDrag}
                onDragEnd={handleDrag} // Ensure final value is set
                style={{ x }}
                className="absolute top-1/2 -mt-3 -ml-3 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
            >
                <div className="w-2 h-2 bg-primary rounded-full" />
            </motion.div>
        </div>
    );
}
