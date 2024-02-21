import {
  DESKTOP_SCREEN_SIZE,
  TABLET_SCREEN_SIZE,
  WIDE_SCREEN_SIZE,
} from "../constants";
import { useState, useEffect } from "react";

export const useScreenSize = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);

  const checkIfIsMobile = () => {
    setIsMobile(
      window.matchMedia(`(max-width: ${TABLET_SCREEN_SIZE - 1}px)`).matches,
    );
    setIsTablet(
      window.matchMedia(`(max-width: ${DESKTOP_SCREEN_SIZE - 1}px)`).matches,
    );
    setIsDesktop(
      window.matchMedia(`(min-width: ${DESKTOP_SCREEN_SIZE}px)`).matches,
    );
    setIsWideScreen(
      window.matchMedia(`(min-width: ${WIDE_SCREEN_SIZE}px)`).matches,
    );
  };

  useEffect(() => {
    checkIfIsMobile();

    window.addEventListener("resize", checkIfIsMobile);

    return () => {
      window.removeEventListener("resize", checkIfIsMobile);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isWideScreen,
  };
};
