"use client";

import { useInView } from "framer-motion";
import { useRef, RefObject } from "react";
import { AnimationConfig } from "@/types/landing";

interface UseScrollAnimationOptions {
  /**
   * Animation configuration from component config
   */
  animation?: AnimationConfig;
  /**
   * Trigger animation once or every time element enters viewport
   */
  once?: boolean;
  /**
   * Margin around the viewport for triggering animation
   */
  margin?: string;
  /**
   * Amount of the element that needs to be visible (0-1)
   */
  amount?: number | "some" | "all";
}

interface ScrollAnimationResult {
  /**
   * Ref to attach to the element you want to animate
   */
  ref: RefObject<HTMLDivElement>;
  /**
   * Whether the element is currently in view
   */
  isInView: boolean;
  /**
   * Framer Motion variants for the animation
   */
  variants: {
    hidden: { opacity?: number; y?: number; x?: number; scale?: number };
    visible: { opacity?: number; y?: number; x?: number; scale?: number };
  };
  /**
   * Initial animation state
   */
  initial: string;
  /**
   * Animation state when in view
   */
  animate: string;
  /**
   * Transition configuration
   */
  transition: {
    duration: number;
    delay: number;
    ease: number[];
  };
}

/**
 * Custom hook for scroll-triggered animations using Framer Motion
 *
 * @example
 * ```tsx
 * const animation = useScrollAnimation({
 *   animation: {
 *     type: "fadeInUp",
 *     duration: 800,
 *     delay: 200
 *   }
 * });
 *
 * return (
 *   <motion.div
 *     ref={animation.ref}
 *     initial={animation.initial}
 *     animate={animation.animate}
 *     variants={animation.variants}
 *     transition={animation.transition}
 *   >
 *     Content
 *   </motion.div>
 * );
 * ```
 */
export function useScrollAnimation({
  animation = { type: "fadeIn", duration: 600, delay: 0 },
  once = true,
  amount = 0.3,
}: UseScrollAnimationOptions = {}): ScrollAnimationResult {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount,
  });

  // Default values
  const duration = animation.duration || 600;
  const delay = animation.delay || 0;

  // Convert duration from ms to seconds for Framer Motion
  const durationInSeconds = duration / 1000;
  const delayInSeconds = delay / 1000;

  // Easing function - smooth and natural
  const ease = [0.25, 0.1, 0.25, 1]; // cubic-bezier ease

  // Animation variants based on type
  const getVariants = () => {
    switch (animation.type) {
      case "fadeIn":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };

      case "fadeInUp":
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        };

      case "fadeInDown":
        return {
          hidden: { opacity: 0, y: -40 },
          visible: { opacity: 1, y: 0 },
        };

      case "slideInLeft":
        return {
          hidden: { opacity: 0, x: -60 },
          visible: { opacity: 1, x: 0 },
        };

      case "slideInRight":
        return {
          hidden: { opacity: 0, x: 60 },
          visible: { opacity: 1, x: 0 },
        };

      case "zoomIn":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        };

      case "none":
      default:
        return {
          hidden: { opacity: 1 },
          visible: { opacity: 1 },
        };
    }
  };

  return {
    ref,
    isInView,
    variants: getVariants(),
    initial: "hidden",
    animate: isInView ? "visible" : "hidden",
    transition: {
      duration: durationInSeconds,
      delay: delayInSeconds,
      ease,
    },
  };
}

/**
 * Hook for staggered children animations
 * Use this for animating lists or grids with stagger effect
 *
 * @example
 * ```tsx
 * const stagger = useStaggerAnimation({ staggerDelay: 0.1 });
 *
 * return (
 *   <motion.div
 *     ref={stagger.ref}
 *     initial="hidden"
 *     animate={stagger.animate}
 *     variants={stagger.containerVariants}
 *   >
 *     {items.map(item => (
 *       <motion.div key={item.id} variants={stagger.itemVariants}>
 *         {item.content}
 *       </motion.div>
 *     ))}
 *   </motion.div>
 * );
 * ```
 */
export function useStaggerAnimation({
  animation = { type: "fadeInUp", duration: 600, delay: 0 },
  staggerDelay = 0.1,
  once = true,
  amount = 0.2,
}: UseScrollAnimationOptions & { staggerDelay?: number } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount,
  });

  const duration = (animation.duration || 600) / 1000;
  const delay = (animation.delay || 0) / 1000;

  // Get base animation for items
  const getItemVariants = () => {
    switch (animation.type) {
      case "fadeInUp":
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        };

      case "fadeInDown":
        return {
          hidden: { opacity: 0, y: -30 },
          visible: { opacity: 1, y: 0 },
        };

      case "slideInLeft":
        return {
          hidden: { opacity: 0, x: -40 },
          visible: { opacity: 1, x: 0 },
        };

      case "slideInRight":
        return {
          hidden: { opacity: 0, x: 40 },
          visible: { opacity: 1, x: 0 },
        };

      case "zoomIn":
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 },
        };

      case "fadeIn":
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
    }
  };

  return {
    ref,
    isInView,
    animate: isInView ? "visible" : "hidden",
    containerVariants: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: delay,
        },
      },
    },
    itemVariants: {
      ...getItemVariants(),
      visible: {
        ...getItemVariants().visible,
        transition: {
          duration,
          ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
        },
      },
    },
  };
}
