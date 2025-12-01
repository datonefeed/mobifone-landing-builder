"use client";

import React, { useState, useEffect } from "react";
import { LoadingSpinner, LoadingSpinnerType } from "@/components/landing/LoadingSpinner";

interface LandingPageLoaderProps {
  children: React.ReactNode;
  enabled?: boolean;
  type?: LoadingSpinnerType;
  color?: string;
  duration?: number;
  minDuration?: number;
}

export const LandingPageLoader: React.FC<LandingPageLoaderProps> = ({
  children,
  enabled = false,
  type = "spin",
  color = "#f97316",
  duration = 1000,
  minDuration = 500,
}) => {
  const [isLoading, setIsLoading] = useState(enabled);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      setIsReady(true);
      return;
    }

    const startTime = Date.now();

    // Wait for both: minimum duration AND content ready
    const contentTimer = setTimeout(() => {
      setIsReady(true);
    }, duration);

    const checkReady = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        if (isReady || Date.now() - startTime >= duration) {
          setIsLoading(false);
        }
      }, remainingTime);
    };

    // Check if page is loaded
    if (document.readyState === "complete") {
      checkReady();
    } else {
      window.addEventListener("load", checkReady);
      return () => {
        window.removeEventListener("load", checkReady);
        clearTimeout(contentTimer);
      };
    }

    return () => clearTimeout(contentTimer);
  }, [enabled, duration, minDuration, isReady]);

  useEffect(() => {
    if (isReady) {
      const startTime = Date.now();
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    }
  }, [isReady, minDuration]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <LoadingSpinner type={type} color={color} size="lg" />
        </div>
      )}

      {/* Content - render immediately but hidden during loading */}
      <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300"}>
        {children}
      </div>
    </>
  );
};
