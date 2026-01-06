import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Fixed: Added missing React import to resolve 'Cannot find namespace React' error.
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Smooth scroll can sometimes be interrupted by page loads, 
    // so 'instant' or 'auto' is usually better for route transitions.
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
