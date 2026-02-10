import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import GridDistortion from "@/components/GridDistortion";
import { Navigation } from "@/components/Navigation";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import Rules from "@/pages/Rules";
import Rsvp from "@/pages/Rsvp";
import PaymentQR from "@/pages/PaymentQR";
import Receipt from "@/pages/Receipt";
import NotFound from "@/pages/not-found";
import yepImg from "@/assets/yep.png";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Intro } from "@/components/Intro";

function Router() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (location !== "/") {
      setLocation("/");
    }
  }, []);


  return (
    <AnimatePresence>
      <Switch location={location} key={location}>
        <Route path="/" component={Home} />
        <Route path="/events" component={Events} />
        <Route path="/rules" component={Rules} />
        <Route path="/rsvp" component={Rsvp} />
        <Route path="/payment-qr/:id" component={PaymentQR} />
        <Route path="/receipt/:id" component={Receipt} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Intro onEnter={() => {
        // The click itself triggers the MusicPlayer's document listener
        // We can also dispatch a custom event if needed
        window.dispatchEvent(new Event('intro-enter'));
        (window as any).introDismissed = true;
      }} />
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <GridDistortion
          imageSrc={yepImg}
          grid={15}
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
      <MusicPlayer />
    </QueryClientProvider>
  );
}

export default App;
