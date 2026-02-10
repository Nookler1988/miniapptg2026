import { createContext, useContext, useEffect, useState } from "react";

const SafeAreaContext = createContext({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

export const useSafeArea = () => useContext(SafeAreaContext);

export default function SafeAreaProvider({ children }) {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    const updateSafeArea = () => {
      const insets = tg.contentSafeAreaInset || {};
      const safeAreaInset = tg.safeAreaInset || {};

      const newSafeArea = {
        top: insets.top || safeAreaInset.top || 0,
        right: insets.right || safeAreaInset.right || 0,
        bottom: insets.bottom || safeAreaInset.bottom || 0,
        left: insets.left || safeAreaInset.left || 0,
      };

      setSafeArea(newSafeArea);

      document.documentElement.style.setProperty(
        "--safe-area-top",
        `${Math.max(newSafeArea.top, 44)}px`
      );
      document.documentElement.style.setProperty(
        "--safe-area-right",
        `${newSafeArea.right}px`
      );
      document.documentElement.style.setProperty(
        "--safe-area-bottom",
        `${newSafeArea.bottom}px`
      );
      document.documentElement.style.setProperty(
        "--safe-area-left",
        `${newSafeArea.left}px`
      );
      document.documentElement.style.setProperty(
        "--content-safe-area-top",
        `${newSafeArea.top}px`
      );
    };

    updateSafeArea();

    tg.onEvent("safeAreaChanged", updateSafeArea);
    tg.onEvent("contentSafeAreaChanged", updateSafeArea);

    return () => {
      tg.offEvent("safeAreaChanged", updateSafeArea);
      tg.offEvent("contentSafeAreaChanged", updateSafeArea);
    };
  }, []);

  return (
    <SafeAreaContext.Provider value={safeArea}>
      {children}
    </SafeAreaContext.Provider>
  );
}
