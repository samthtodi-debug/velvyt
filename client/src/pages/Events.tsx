import { useEvents } from "@/hooks/use-events";
import { EventCard } from "@/components/EventCard";
import { motion } from "framer-motion";

export default function Events() {
  const { data: events, isLoading } = useEvents();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-0 left-0 w-full min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto left-0 right-0"
    >
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8"
      >
        <div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Upcoming</h1>
        </div>
        <div className="hidden md:block text-right text-xs font-mono text-white/40">
          SEASON 01 <br /> COLLECTION
        </div>
      </motion.header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-white font-mono animate-pulse tracking-widest text-sm">
            LOADING EVENT DATA...
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {events?.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}

          {!events?.length && (
            <div className="col-span-full py-20 text-center border border-white/5">
              <p className="text-white/40 font-mono text-sm">NO EVENTS SCHEDULED</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
