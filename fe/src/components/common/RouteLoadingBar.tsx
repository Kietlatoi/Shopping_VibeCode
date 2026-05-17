import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A slim, animated progress bar that appears at the top of the viewport
 * during route transitions — similar to NProgress / YouTube's red bar.
 */
export function RouteLoadingBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    // Start loading
    setVisible(true);
    setProgress(15);

    // Simulate incremental progress
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(intervalRef.current);
          return prev;
        }
        // Slow down as we approach 90%
        const increment = Math.max(1, (90 - prev) * 0.1);
        return Math.min(90, prev + increment);
      });
    }, 100);

    // Complete after a short delay (content has loaded)
    timerRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
    }, 400);

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(intervalRef.current);
    };
  }, [location.pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
      role="progressbar"
      aria-valuenow={progress}
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-primary to-primary/60 shadow-[0_0_10px_var(--color-primary),0_0_5px_var(--color-primary)]"
        style={{
          width: `${progress}%`,
          transition: progress === 0
            ? 'none'
            : progress === 100
              ? 'width 200ms ease-out, opacity 300ms ease-out'
              : 'width 300ms ease-out',
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
