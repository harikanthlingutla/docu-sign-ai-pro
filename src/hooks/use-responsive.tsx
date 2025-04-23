
import { useState, useEffect } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1400,
};

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('xs');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < breakpoints.sm) {
        setBreakpoint('xs');
      } else if (width < breakpoints.md) {
        setBreakpoint('sm');
      } else if (width < breakpoints.lg) {
        setBreakpoint('md');
      } else if (width < breakpoints.xl) {
        setBreakpoint('lg');
      } else if (width < breakpoints['2xl']) {
        setBreakpoint('xl');
      } else {
        setBreakpoint('2xl');
      }
    };

    // Set initial breakpoint
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

export function useResponsive() {
  const breakpoint = useBreakpoint();
  
  return {
    isXs: breakpoint === 'xs',
    isSm: breakpoint === 'sm',
    isMd: breakpoint === 'md',
    isLg: breakpoint === 'lg',
    isXl: breakpoint === 'xl',
    is2Xl: breakpoint === '2xl',
    isSmAndDown: ['xs', 'sm'].includes(breakpoint),
    isMdAndDown: ['xs', 'sm', 'md'].includes(breakpoint),
    isLgAndDown: ['xs', 'sm', 'md', 'lg'].includes(breakpoint),
    isSmAndUp: ['sm', 'md', 'lg', 'xl', '2xl'].includes(breakpoint),
    isMdAndUp: ['md', 'lg', 'xl', '2xl'].includes(breakpoint),
    isLgAndUp: ['lg', 'xl', '2xl'].includes(breakpoint),
    breakpoint,
  };
}
