import { Switch, Route } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initFacebookTracking } from "@/lib/facebook-tracking";

// Code splitting - lazy load routes for faster initial page load
// IntroScene loads first (landing page), others load on-demand
import IntroScene from "@/components/IntroScene";
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const Quiz = lazy(() => import("@/pages/Quiz"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Login = lazy(() => import("@/pages/Login"));
const FbcValidator = lazy(() => import("@/pages/FbcValidator"));

// Loading fallback for lazy-loaded routes
function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0d0d16]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#54d3bb]/30 border-t-[#54d3bb] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/70">Loading...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
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
