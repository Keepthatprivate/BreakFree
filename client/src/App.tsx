import { Switch, Route } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import IntroScene from "@/components/IntroScene";
import LandingPage from "@/pages/LandingPage";
import Quiz from "@/pages/Quiz";
import SignUp from "@/pages/SignUp";
import Login from "@/pages/Login";
import { initFacebookTracking } from "@/lib/facebook-tracking";

function Router() {
  return (
    <Switch>
      <Route path="/" component={IntroScene} />
      <Route path="/landing" component={LandingPage} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/signup" component={SignUp} />
      <Route path="/login" component={Login} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    initFacebookTracking();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
