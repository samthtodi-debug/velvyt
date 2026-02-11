import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function PaymentProof() {
    const [, setLocation] = useLocation();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 w-full min-h-screen flex items-center justify-center p-6 pt-24"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-card/50 backdrop-blur-md border border-white/5 p-8 md:p-12 text-center"
            >
                <h1 className="text-2xl font-display font-bold mb-6">Payment Verification</h1>

                <div className="space-y-6 mb-8 text-left">
                    <p className="text-sm text-gray-300">
                        Please send a screenshot or proof of your payment to any of the following numbers via WhatsApp:
                    </p>

                    <div className="bg-white/5 p-4 rounded space-y-2 text-center">
                        <p className="font-mono text-lg text-white font-bold tracking-wider">
                            +91 96641 29161
                        </p>
                        <p className="font-mono text-lg text-white font-bold tracking-wider">
                            +91 73400 73499
                        </p>
                    </div>

                    <p className="text-xs text-gray-400 text-center">
                        Once you have sent the proof, your ticket will be confirmed shortly.
                    </p>
                </div>

                <Button
                    className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 uppercase text-xs font-bold tracking-widest"
                    onClick={() => setLocation("/")}
                >
                    Done
                </Button>
            </motion.div>
        </motion.div>
    );
}
