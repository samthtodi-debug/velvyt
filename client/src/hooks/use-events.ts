import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type RsvpInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useEvents() {
  return useQuery({
    queryKey: [api.events.list.path],
    queryFn: async () => {
      const res = await fetch(api.events.list.path);
      if (!res.ok) throw new Error("Failed to load events");
      return api.events.list.responses[200].parse(await res.json());
    },
  });
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: [api.events.get.path, id],
    queryFn: async () => {
      const res = await fetch(api.events.get.path.replace(":id", id.toString()));
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to load event");
      return api.events.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateRsvp() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: RsvpInput) => {
      const res = await fetch(api.rsvps.create.path, {
        method: api.rsvps.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseText = await res.text();
      if (!res.ok) {
        try {
          const errorData = JSON.parse(responseText);
          if (errorData && errorData.message) {
            throw new Error(errorData.message);
          }
        } catch (e) {
          // If JSON parse fails, use the raw text if available
          if (responseText && responseText.trim().length > 0) {
            // Trim to avoid huge HTML dumps if possible, just take first 100 chars
            throw new Error(`Server Error: ${responseText.slice(0, 100)}`);
          }
        }
        throw new Error(`Failed to submit RSVP (Status: ${res.status})`);
      }
      return api.rsvps.create.responses[201].parse(JSON.parse(responseText));
    },
    onSuccess: () => {
      toast({
        title: "You're on the list.",
        description: "We'll be in touch shortly with details.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
