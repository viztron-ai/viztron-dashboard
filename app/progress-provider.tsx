'use client';

import { useEffect } from 'react';
import NProgress from 'nprogress';
import { usePathname, useSearchParams } from 'next/navigation';

// Add NProgress CSS
const NProgressStyles = () => (
  <style jsx global>{`
    #nprogress {
      pointer-events: none;
    }
    
    #nprogress .bar {
      background: #808080;
      position: fixed;
      z-index: 9999;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
    }
    
    #nprogress .peg {
      display: block;
      position: absolute;
      right: 0px;
      width: 100px;
      height: 100%;
      box-shadow: 0 0 10px #808080, 0 0 5px #808080;
      opacity: 1;
      transform: rotate(3deg) translate(0px, -4px);
    }
  `}</style>
);

export default function CustomProgressBar({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Configure NProgress
  useEffect(() => {
    NProgress.configure({ 
      showSpinner: false,
      minimum: 0.1,
      easing: 'ease',
      speed: 300
    });
  }, []);

  // Start/complete progress bar based on route changes
  useEffect(() => {
    // Start progress bar
    NProgress.start();
    
    // Wait a bit to simulate loading for better user experience
    const timer = setTimeout(() => {
      // Complete progress bar
      NProgress.done();
    }, 300);
    
    console.log('Route changed:', pathname);
    
    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname, searchParams]);

  return (
    <>
      <NProgressStyles />
      {children}
    </>
  );
}