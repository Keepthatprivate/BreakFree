import { Switch, Route } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initFacebookTracking } from "@/lib/facebook-tracking";

// Critical path - load immediately for fastest landing page
import IntroScene from "@/components/IntroScene";
import LandingPage from "@/pages/LandingPage";

// Lazy load all other routes - these won't block initial page load
const Quiz = lazy(() => import("@/pages/Quiz"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Login = lazy(() => import("@/pages/Login"));
const FbcValidator = lazy(() => import("@/pages/FbcValidator"));

// Minimal loading fallback - matches landing page background for seamless UX
const LoadingFallback = () => (
  <div className="min-h-screen bg-[#0d0d16] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#54d3bb] border-t-transparent rounded-full animate-spin" />
  </div>
);

function Router() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <Route path="/" component={IntroScene} />
        <Route path="/landing" component={LandingPage} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={Login} />
        <Route path="/fbc-validator" component={FbcValidator} />
      </Switch>
    </Suspense>
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
