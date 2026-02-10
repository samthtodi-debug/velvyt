import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRsvpSchema } from "@shared/schema";
import { useCreateRsvp, useEvents } from "@/hooks/use-events";
import { useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { z } from "zod";

// Enhance schema for frontend validation
const formSchema = insertRsvpSchema.extend({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number required"),
  eventId: z.coerce.number().min(1, "Please select an event"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Rsvp() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const eventIdParam = searchParams.get("event");

  const { data: events } = useEvents();
  const createRsvp = useCreateRsvp();

  const selectedEvent = events?.find(e => e.id === Number(eventIdParam));

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      instagramHandle: "",
      phone: "",
      eventId: eventIdParam ? parseInt(eventIdParam) : undefined,
    },
  });

  // Load Razorpay SDK


  async function onSubmit(data: FormValues) {
    createRsvp.mutate(data, {
      onSuccess: (newRsvp) => {
        // Use wouter hook for navigation
        setLocation(`/payment-qr/${newRsvp.id}`);
      },
      onError: (error) => {
        alert("Failed to submit details. Please try again.");
        console.error(error);
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-0 left-0 w-full min-h-screen flex items-center justify-center p-6 pt-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card/50 backdrop-blur-md border border-white/5 p-8 md:p-12"
      >
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-display font-bold mb-2">Registration</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            {selectedEvent ? `For ${selectedEvent.title}` : "Join the Movement"}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest text-white/60">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jane Doe"
                      className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-white transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest text-white/60">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jane@example.com"
                      className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-white transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instagramHandle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest text-white/60">Instagram</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="@velvyt.co"
                      className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-white transition-colors"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest text-white/60">Phone Number (WhatsApp)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+91 99999 99999"
                      className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-white transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />



            {!eventIdParam && (
              <FormField
                control={form.control}
                name="eventId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-white/60">Event</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus:ring-0 focus:border-white transition-colors">
                          <SelectValue placeholder="Select an event" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {events?.map((event) => (
                          <SelectItem key={event.id} value={event.id.toString()}>
                            {event.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {eventIdParam && <input type="hidden" {...form.register("eventId")} />}

            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 uppercase text-xs font-bold tracking-widest"
              disabled={createRsvp.isPending}
            >
              {createRsvp.isPending ? "Processing..." : "Submit Details"}
            </Button>
          </form>
        </Form>
      </motion.div>
    </motion.div>
  );
}
