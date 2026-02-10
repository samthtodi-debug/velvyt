import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Rsvp {
    id: number;
    name: string;
    email: string;
    phone: string;
    eventId: number;
    status: string;
    createdAt: string;
}

interface Event {
    id: number;
    title: string;
    date: string;
    location: string;
}

export default function Receipt() {
    const params = useParams();
    const id = params.id;

    const { data: rsvp, isLoading: rsvpLoading } = useQuery<Rsvp>({
        queryKey: ['/api/rsvps', id], // Updated key format
        queryFn: async () => {
            const res = await fetch(`/api/rsvps/${id}`);
            if (!res.ok) throw new Error("Failed to fetch RSVP");
            return res.json();
        },
        enabled: !!id,
    });

    const { data: event, isLoading: eventLoading } = useQuery<Event>({
        queryKey: ['/api/events', rsvp?.eventId],
        queryFn: async () => {
            if (!rsvp?.eventId) return null;
            const res = await fetch(`/api/events/${rsvp.eventId}`);
            if (!res.ok) throw new Error("Failed to fetch Event");
            return res.json();
        },
        enabled: !!rsvp?.eventId,
    });


    if (rsvpLoading || eventLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!rsvp || !event) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Receipt not found.
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 w-full min-h-screen flex items-center justify-center p-6 pt-24 bg-black"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20 }}
                className="w-full max-w-md bg-white text-black p-8 md:p-12 relative overflow-hidden font-mono shadow-2xl"
            >
                {/* Receipt Header */}
                <div className="text-center border-b-2 border-black pb-6 mb-6">
                    <div className="text-4xl mb-2">VELVYT</div>
                    <p className="text-xs tracking-widest uppercase">Official Receipt</p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle size={20} />
                        <span className="font-bold uppercase">Payment Received</span>
                    </div>
                </div>

                {/* Receipt Details */}
                <div className="space-y-4 text-sm mb-8">
                    <div className="flex justify-between">
                        <span className="text-gray-500 uppercase text-xs">Receipt ID</span>
                        <span className="font-bold">#{rsvp.id.toString().padStart(6, '0')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500 uppercase text-xs">Date</span>
                        <span className="font-bold">{new Date().toLocaleDateString()}</span>
                    </div>

                    <div className="border-t border-dashed border-black/30 my-4 pt-4"></div>

                    <div className="flex justify-between">
                        <span className="font-bold">{event.title}</span>
                        <span className="font-bold">₹600.00</span>
                    </div>
                    <div className="text-xs text-gray-500">Early Bird Access Pass x 1</div>

                    <div className="border-t border-dashed border-black/30 my-4 pt-4"></div>

                    <div className="flex justify-between items-end">
                        <span className="font-bold text-lg">TOTAL</span>
                        <span className="font-bold text-lg">₹600.00</span>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="bg-gray-100 p-4 mb-6 text-xs text-gray-600 rounded">
                    <p className="mb-1"><span className="font-bold">Name:</span> {rsvp.name}</p>
                    <p className="mb-1"><span className="font-bold">Email:</span> {rsvp.email}</p>
                    <p className="mb-1"><span className="font-bold">Phone:</span> {rsvp.phone}</p>
                </div>

                <div className="text-center">
                    <div className="w-full h-16 bg-black text-white flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-900 transition-colors uppercase font-bold tracking-widest text-xs">
                        <Download size={16} />
                        Download Receipt
                    </div>
                    <p className="mt-4 text-[10px] text-gray-400 uppercase tracking-widest">
                        Please show this receipt at the entrance
                    </p>
                </div>

                {/* Perforated edge effect */}
                <div className="absolute top-0 left-0 w-full h-4 bg-black/5" style={{
                    backgroundImage: "radial-gradient(circle, transparent 50%, black 50%)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 -10px",
                    opacity: 0.1
                }}></div>
            </motion.div>
        </motion.div>
    );
}
