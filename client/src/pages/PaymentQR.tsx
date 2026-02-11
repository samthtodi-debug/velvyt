import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Rsvp {
    id: number;
    name: string;
    email: string;
    phone: string;
    eventId: number;
    status: string;
}

export default function PaymentQR() {
    const { id } = useParams();
    const [, setLocation] = useLocation();

    const { data: rsvp, isLoading, error } = useQuery<Rsvp>({
        queryKey: ['/api/rsvps', id],
        queryFn: async () => {
            const res = await fetch(`/api/rsvps/${id}`);
            if (!res.ok) throw new Error("Failed to fetch RSVP");
            return res.json();
        },
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        );
    }

    if (error || !rsvp) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Error loading payment details.
            </div>
        );
    }

    const handlePaymentComplete = () => {
        // Navigate to proof page
        setLocation(`/payment-proof/${id}`);
    };

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
                <h1 className="text-2xl font-display font-bold mb-2">Complete Payment</h1>
                <p className="text-sm text-muted-foreground mb-8">
                    Scan the QR code below to pay for your ticket.
                </p>

                <div className="relative mx-auto w-64 h-64 bg-white p-4 mb-6 rounded-lg flex items-center justify-center">
                    <img
                        src="/images/payment-qr.jpeg"
                        alt="Payment QR Code"
                        className="w-full h-full object-contain"
                    />
                </div>

                <div className="space-y-4">
                    <div className="bg-white/5 p-4 rounded text-left">
                        <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Total Amount (Early Bird)</p>
                        <p className="text-xl font-bold">₹600.00</p>
                    </div>

                    <div className="text-left text-sm text-white/60">
                        <p>Name: {rsvp.name}</p>
                        <p>Phone: {rsvp.phone}</p>
                    </div>

                    <Button
                        className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 uppercase text-xs font-bold tracking-widest mt-6"
                        onClick={handlePaymentComplete}
                    >
                        I Have Paid
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}
