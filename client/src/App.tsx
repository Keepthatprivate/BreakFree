import { Switch, Route } from "wouter";
import { useEffect, lazy, Suspense, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

// Critical path - load shell immediately, animations load after first paint
import IntroSceneShell from "@/components/IntroSceneShell";
import LandingPage from "@/pages/LandingPage";

// Lazy load non-critical UI components
const Toaster = lazy(() =>
  import("@/components/ui/toaster").then((m) => ({ default: m.Toaster }))
);
const TooltipProvider = lazy(() =>
  import("@/components/ui/tooltip").then((m) => ({ default: m.TooltipProvider }))
);

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
        <Route path="/" component={LandingPage} />
        <Route path="/intro" component={IntroSceneShell} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={Login} />
        <Route path="/fbc-validator" component={FbcValidator} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Defer non-critical initialization after first paint
    const timer = requestAnimationFrame(() => {
      // Initialize Facebook tracking after first paint
      import("@/lib/facebook-tracking").then((m) => m.initFacebookTracking());
      setIsReady(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Defer tooltip provider and toaster until after first paint */}
      {isReady ? (
        <Suspense fallback={null}>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </Suspense>
      ) : (
        <Router />
      )}
    </QueryClientProvider>
  );
}

export default App;
