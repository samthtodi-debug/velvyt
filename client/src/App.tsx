import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import GridDistortion from "@/components/GridDistortion";
import { Navigation } from "@/components/Navigation";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import Rsvp from "@/pages/Rsvp";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/events" component={Events} />
      <Route path="/rsvp" component={Rsvp} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="fixed inset-0 -z-10">
        <GridDistortion 
          imageSrc="https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=2000&q=80"
          grid={20}
          mouse={0.15}
          strength={0.2}
          relaxation={0.9}
          className="w-full h-full"
        />
      </div>
      <div className="noise-overlay" />
      <Navigation />
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
