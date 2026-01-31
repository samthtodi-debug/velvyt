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
import yepImg from "@/assets/yep.png";

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
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <GridDistortion 
          imageSrc={yepImg}
          grid={10}
          mouse={0.1}
          strength={0.15}
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
