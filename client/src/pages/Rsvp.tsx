import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRsvpSchema } from "@shared/schema";
import { useCreateRsvp } from "@/hooks/use-events";
import { useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { z } from "zod";

// Enhance schema for frontend validation
const formSchema = insertRsvpSchema.extend({
  email: z.string().email("Invalid email address"),
  eventId: z.coerce.number().min(1, "Please select an event"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Rsvp() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const eventIdParam = searchParams.get("event");
  
  const createRsvp = useCreateRsvp();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      instagramHandle: "",
      eventId: eventIdParam ? parseInt(eventIdParam) : undefined,
    },
  });

  function onSubmit(data: FormValues) {
    createRsvp.mutate(data, {
      onSuccess: () => {
        form.reset();
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card/50 backdrop-blur-md border border-white/5 p-8 md:p-12"
      >
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-display font-bold mb-2">Guest List</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Submissions are subject to approval
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
                      placeholder="@username" 
                      className="bg-transparent border-0 border-b border-white/10 rounded-none px-0 focus-visible:ring-0 focus-visible:border-white transition-colors"
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <input type="hidden" {...form.register("eventId")} />

            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 uppercase text-xs font-bold tracking-widest"
              disabled={createRsvp.isPending}
            >
              {createRsvp.isPending ? "Processing..." : "Submit Request"}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
