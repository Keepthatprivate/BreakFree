import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy, Suspense, useState, useRef } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { trackViewContent } from "@/lib/facebook-tracking";

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
  <div className="min-h-screen bg-[#0d0d16] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#54d3bb] border-t-transparent rounded-full animate-spin" />
  </div>
);

/**
 * PageViewTracker - Tracks page views on every route/state change
 * Sends PageView event to Facebook Conversion API & Pixel
 * Tracks both path changes and query parameter changes (e.g., ?state=checkout)
 *
 * Tracked routes:
 * - / (PreLanding)
 * - /intro (IntroSceneShell)
 * - /quiz (Quiz with various states via ?state= param)
 * - /signup (Sign Up)
 * - /login (Login)
 * - /fbc-validator (FBC Validator)
 */
function PageViewTracker() {
  const [location] = useLocation();
  const lastTrackedKey = useRef<string | null>(null);

  useEffect(() => {
    // Build a unique key for this page view (path + state param)
    const searchParams = new URLSearchParams(window.location.search);
    const state = searchParams.get('state');
    const question = searchParams.get('question');

    // Create a unique tracking key based on path and relevant params
    let trackingKey = location;
    let contentName = location;

    if (location === '/quiz') {
      // For quiz, include state in the tracking key
      if (state) {
        trackingKey = `${location}?state=${state}`;
        contentName = `/quiz/${state}`;
      } else if (question) {
        trackingKey = `${location}?question=${question}`;
        contentName = `/quiz/question-${question}`;
      } else {
        contentName = '/quiz/start';
      }
    }

    // Only track if the key has changed (prevents duplicate tracking)
    if (trackingKey !== lastTrackedKey.current) {
      lastTrackedKey.current = trackingKey;
      trackViewContent({
        contentName: `PageView: ${contentName}`,
      });
    }
  }, [location]);

  // Also listen for popstate (back/forward navigation) and pushState changes
  useEffect(() => {
    const handleUrlChange = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const state = searchParams.get('state');
      const question = searchParams.get('question');
      const pathname = window.location.pathname;

      let trackingKey = pathname;
      let contentName = pathname;

      if (pathname === '/quiz') {
        if (state) {
          trackingKey = `${pathname}?state=${state}`;
          contentName = `/quiz/${state}`;
        } else if (question) {
          trackingKey = `${pathname}?question=${question}`;
          contentName = `/quiz/question-${question}`;
        } else {
          contentName = '/quiz/start';
        }
      }

      if (trackingKey !== lastTrackedKey.current) {
        lastTrackedKey.current = trackingKey;
        trackViewContent({
          contentName: `PageView: ${contentName}`,
        });
      }
    };

    // Listen for browser back/forward
    window.addEventListener('popstate', handleUrlChange);

    // Intercept pushState and replaceState to catch programmatic navigation
    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);

    history.pushState = (...args) => {
      originalPushState(...args);
      handleUrlChange();
    };

    history.replaceState = (...args) => {
      originalReplaceState(...args);
      handleUrlChange();
    };

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  return null;
}

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
      {/* Track page views on every route change */}
      {isReady && <PageViewTracker />}
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
