import { useEffect, useState } from 'react';

// Based on: https://usehooks-ts.com/react-hook/use-media-query (MIT License)

declare let window: {
  matchMedia: (query: string) => {
    matches: boolean;
    addListener?: (callback: () => void) => void;
    removeListener?: (callback: () => void) => void;
    addEventListener: (name: string, callback: () => void) => void;
    removeEventListener: (name: string, callback: () => void) => void;
  };
};
export const useMediaQuery = (query: string): boolean => {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== `undefined`) {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  function handleChange() {
    setMatches(getMatches(query));
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener(`change`, handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener(`change`, handleChange);
      }
    };
  }, [query]);

  return matches;
};
