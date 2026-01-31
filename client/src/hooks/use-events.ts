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

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.rsvps.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to submit RSVP");
      }
      return api.rsvps.create.responses[201].parse(await res.json());
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
