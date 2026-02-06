import { type Event } from "@shared/schema";
import { format } from "date-fns";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface EventCardProps {
  event: Event;
  index: number;
}

export function EventCard({ event, index }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative flex flex-col gap-4"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />

        {/* Dynamic Image from Event Data */}
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
        />

        {event.isExclusive && (
          <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-white text-black text-[10px] font-bold tracking-widest uppercase">
            Exclusive
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-xs font-mono text-muted-foreground">
          {format(new Date(event.date), "MM.dd.yyyy — HH:mm")}
        </div>
        <h3 className="text-xl md:text-2xl text-white font-medium group-hover:text-white/80 transition-colors">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.location}
        </p>
      </div>

      <Link
        href={`/rsvp?event=${event.id}`}
        className="mt-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
      >
        <span>Book Now</span>
        <span className="block h-[1px] w-8 bg-current transition-all group-hover:w-12" />
      </Link>
    </motion.div>
  );
}
