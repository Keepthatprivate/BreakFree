import { Switch, Route } from "wouter";
import { useEffect, lazy, Suspense, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

// Critical path - load shell immediately, animations load after first paint
import IntroSceneShell from "@/components/IntroSceneShell";
import PreLanding from "@/pages/PreLanding";

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
  <div className="min-h-screen bg-[#0d0d16] flex items-center justify-center" role="status" aria-label="Loading">
    <div className="w-8 h-8 border-2 border-[#54d3bb] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
    <span className="sr-only">Loading content...</span>
  </div>
);

// Skip to content link for keyboard navigation (WCAG 2.4.1)
const SkipToContent = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#54d3bb] focus:text-[#0d0d16] focus:rounded-md focus:font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#54d3bb]"
  >
    Skip to main content
  </a>
);

function Router() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <Route path="/" component={PreLanding} />
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
      <SkipToContent />
      {/* Defer tooltip provider and toaster until after first paint */}
      {isReady ? (
        <Suspense fallback={null}>
          <TooltipProvider>
            <Toaster />
            <main id="main-content" role="main">
              <Router />
            </main>
          </TooltipProvider>
        </Suspense>
      ) : (
        <main id="main-content" role="main">
          <Router />
        </main>
      )}
    </QueryClientProvider>
  );
}

export default App;
