/**
 * @fileoverview Animation Demo Card Component
 *
 * @module AnimationCard
 * @description
 * Reusable card component for displaying animation examples.
 * Shows effect description on left, demo on right.
 *
 * @example
 * ```tsx
 * <AnimationCard example={exampleData} />
 * ```
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useSpring,
  useSprings,
  useTrail,
  animated,
  config,
} from "@react-spring/web";
import { ExternalLink, Code2, Play, Sparkles, Zap } from "lucide-react";
import type { AnimationExample } from "./types";

interface AnimationCardProps {
  example: AnimationExample;
  library:
    | "framer-motion"
    | "react-spring"
    | "kute"
    | "motion-one"
    | "tsparticles"
    | "vivus";
}

/**
 * Animation Demo Card
 *
 * Displays animation example with description card on left and demo on right
 */
export function AnimationCard({ example, library }: AnimationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  // Get current config (variant or default)
  const currentConfig =
    selectedVariant && example.variants
      ? example.variants.find((v) => v.name === selectedVariant)?.config ||
        example.config
      : example.config;

  const currentCode =
    selectedVariant && example.variants
      ? example.variants.find((v) => v.name === selectedVariant)?.code ||
        example.code
      : example.code;

  const exampleWithVariant = {
    ...example,
    config: currentConfig,
    code: currentCode,
  };

  // Render animation based on library
  const renderDemo = () => {
    switch (library) {
      case "framer-motion":
        return <FramerMotionDemo example={exampleWithVariant} />;
      case "react-spring":
        return <ReactSpringDemo example={exampleWithVariant} />;
      case "kute":
        return <KuteDemo example={exampleWithVariant} />;
      case "motion-one":
        return (
          <MotionOneDemo
            example={exampleWithVariant}
            animationKey={animationKey}
          />
        );
      case "tsparticles":
        return <TsParticlesDemo example={exampleWithVariant} />;
      case "vivus":
        return <VivusDemo example={exampleWithVariant} />;
      default:
        return (
          <div className="ideai-animation-demo-box">Library not supported</div>
        );
    }
  };

  return (
    <div className="ideai-animation-card">
      <div className="ideai-animation-card__container">
        {/* Left: Description Card */}
        <div className="ideai-animation-card__info">
          <div className="ideai-animation-card__header">
            <div>
              <h3 className="ideai-animation-card__title">{example.title}</h3>
              <p className="ideai-animation-card__description">
                {example.description}
              </p>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ideai-animation-card__expand"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? "−" : "+"}
            </button>
          </div>

          <div className="ideai-animation-card__meta">
            <div className="ideai-animation-card__badges">
              <span className="ideai-animation-card__badge ideai-animation-card__badge--library flex items-center gap-1.5">
                {library === "framer-motion" ? (
                  <Sparkles className="h-3 w-3" />
                ) : (
                  <Zap className="h-3 w-3" />
                )}
                {example.library}
              </span>
              <span className="ideai-animation-card__badge ideai-animation-card__badge--category">
                {example.category}
              </span>
            </div>

            {/* Variant Selector */}
            {example.variants && example.variants.length > 0 && (
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                  Variant:
                </label>
                <select
                  value={selectedVariant || ""}
                  onChange={(e) => {
                    setSelectedVariant(e.target.value || null);
                    setAnimationKey((prev) => prev + 1); // Reset animation
                  }}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Default</option>
                  {example.variants.map((variant) => (
                    <option key={variant.name} value={variant.name}>
                      {variant.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="ideai-animation-card__tags">
              {example.tags.map((tag) => (
                <span key={tag} className="ideai-animation-card__tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="ideai-animation-card__expanded"
              >
                <div className="ideai-animation-card__actions">
                  <a
                    href={example.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ideai-animation-card__link"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Source
                  </a>
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="ideai-animation-card__code-toggle"
                  >
                    <Code2 className="h-4 w-4" />
                    {showCode ? "Hide" : "Show"} Code
                  </button>
                </div>

                {showCode && (
                  <motion.pre
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ideai-animation-card__code"
                  >
                    <code>{currentCode}</code>
                  </motion.pre>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Demo */}
        <div className="ideai-animation-card__demo">
          <div className="ideai-animation-card__demo-header">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              <span>Live Demo</span>
              {library === "framer-motion" ? (
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              ) : (
                <Zap className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              )}
            </div>
            <button
              onClick={() => {
                // Trigger animation restart by remounting
                setAnimationKey((prev) => prev + 1);
              }}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5"
              aria-label="Play animation"
              title="Play animation"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Play</span>
            </button>
          </div>
          <div
            className="ideai-animation-card__demo-content"
            key={animationKey}
          >
            {renderDemo()}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Framer Motion Demo Renderer
 */
function FramerMotionDemo({ example }: { example: AnimationExample }) {
  const animConfig = example.config as any;
  const [isDragging, setIsDragging] = useState(false);

  // Handle special cases
  if (example.id === "framer-motion-4") {
    // Stagger Children - render multiple items
    const items = [1, 2, 3, 4, 5];
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };
    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="ideai-animation-demo-box"
        style={{
          width: "100%",
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        {items.map((item) => (
          <motion.div
            key={item}
            variants={itemVariants}
            style={{
              width: "40px",
              height: "40px",
              background: "rgba(255, 255, 255, 0.3)",
              borderRadius: "8px",
            }}
          />
        ))}
      </motion.div>
    );
  }

  if (example.id === "framer-motion-6") {
    // Layout Animation - render list that can be reordered
    const [items, setItems] = useState([1, 2, 3, 4, 5]);

    return (
      <div
        style={{
          width: "100%",
          height: "200px",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{
                padding: "0.5rem 1rem",
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "4px",
                minWidth: "100px",
                textAlign: "center",
              }}
            >
              Item {item}
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          onClick={() => setItems([...items].reverse())}
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 1rem",
            background: "rgba(255, 255, 255, 0.3)",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            color: "white",
          }}
        >
          Reverse
        </button>
      </div>
    );
  }

  // Build motion props from config
  const baseStyle: React.CSSProperties = {
    width: "100%",
    height: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: animConfig.drag
      ? "grab"
      : animConfig.whileHover
        ? "pointer"
        : "default",
  };

  const motionProps: any = {
    className: "ideai-animation-demo-box",
    style: baseStyle,
  };

  // Apply config properties - ensure animations always run
  if (animConfig.initial !== undefined) {
    motionProps.initial = animConfig.initial;
  } else {
    motionProps.initial = { opacity: 0 };
  }

  if (animConfig.animate !== undefined) {
    motionProps.animate = animConfig.animate;
  } else {
    motionProps.animate = { opacity: 1 };
  }

  if (animConfig.whileHover) {
    motionProps.whileHover = animConfig.whileHover;
  }

  if (animConfig.whileTap) {
    motionProps.whileTap = animConfig.whileTap;
  }

  if (animConfig.drag) {
    motionProps.drag = true;
    if (animConfig.dragConstraints) {
      motionProps.dragConstraints = animConfig.dragConstraints;
    } else {
      motionProps.dragConstraints = {
        left: -50,
        right: 50,
        top: -50,
        bottom: 50,
      };
    }
    if (animConfig.dragElastic !== undefined) {
      motionProps.dragElastic = animConfig.dragElastic;
    }
    motionProps.onDragStart = () => setIsDragging(true);
    motionProps.onDragEnd = () => setIsDragging(false);
  }

  if (animConfig.transition) {
    motionProps.transition = animConfig.transition;
  } else {
    motionProps.transition = { duration: 0.5 };
  }

  if (animConfig.whileInView) {
    motionProps.whileInView = animConfig.whileInView;
    if (animConfig.viewport) {
      motionProps.viewport = animConfig.viewport;
    } else {
      motionProps.viewport = { once: false, margin: "-50px" };
    }
  }

  return (
    <motion.div {...motionProps}>
      <div className="ideai-animation-demo-content">
        {isDragging ? "Dragging..." : example.title}
      </div>
    </motion.div>
  );
}

/**
 * React Spring Demo Renderer
 */
function ReactSpringDemo({ example }: { example: AnimationExample }) {
  const animConfig = example.config as any;
  const [toggle, setToggle] = useState(false);
  const [targetNumber, setTargetNumber] = useState(animConfig.number || 100);

  // Helper to resolve config (handle string references like "wobbly")
  const resolveConfig = (cfg: any) => {
    if (!cfg) return config.gentle;
    if (typeof cfg === "string") {
      const configKey = cfg as keyof typeof config;
      return config[configKey] || config.gentle;
    }
    return cfg;
  };

  // Spring Physics (react-spring-1)
  if (example.id === "react-spring-1") {
    const springProps = useSpring({
      from: animConfig.from || { scale: 0 },
      to: toggle ? { scale: 1.2, rotate: 180 } : { scale: 1, rotate: 0 },
      config: resolveConfig(animConfig.config),
    });

    return (
      <div
        style={{
          width: "100%",
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
        className="ideai-animation-demo-box"
      >
        <animated.div
          style={{
            ...springProps,
            width: "100px",
            height: "100px",
            backgroundColor: "#3b82f6",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => setToggle(!toggle)}
        >
          Click
        </animated.div>
      </div>
    );
  }

  // Number Animation (react-spring-2)
  if (example.id === "react-spring-2") {
    // Number animation
    const { number } = useSpring({
      number: targetNumber,
      from: animConfig.from || { number: 0 },
      config: resolveConfig(animConfig.config),
    });

    return (
      <div
        style={{
          width: "100%",
          height: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <animated.div
          style={{ fontSize: "3rem", fontWeight: 700, color: "#3b82f6" }}
        >
          {number.to((n: number) => Math.floor(n))}
        </animated.div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setTargetNumber(100)}
            style={{
              padding: "0.5rem 1rem",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            To 100
          </button>
          <button
            onClick={() => setTargetNumber(0)}
            style={{
              padding: "0.5rem 1rem",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            To 0
          </button>
        </div>
      </div>
    );
  }

  if (example.id === "react-spring-3") {
    // Trail animation
    const itemCount = animConfig.itemCount || 5;
    const trail = useTrail(itemCount, {
      from: animConfig.from || { opacity: 0, y: 20 },
      to: toggle ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
      config: resolveConfig(animConfig.config),
    });

    return (
      <div
        style={{
          width: "100%",
          height: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        {trail.map((props, i) => (
          <animated.div
            key={i}
            style={{
              ...props,
              width: "80px",
              height: "30px",
              background: `hsl(${i * 60}, 70%, 60%)`,
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "0.875rem",
            }}
          >
            Item {i + 1}
          </animated.div>
        ))}
        <button
          onClick={() => setToggle(!toggle)}
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 1rem",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Toggle Trail
        </button>
      </div>
    );
  }

  if (example.id === "react-spring-4") {
    // Parallax - simplified for demo
    const springProps = useSpring({
      from: { transform: "translateY(0px)" },
      to: { transform: toggle ? "translateY(20px)" : "translateY(0px)" },
      config: resolveConfig(animConfig.config),
    });

    return (
      <div
        style={{
          width: "100%",
          height: "200px",
          overflow: "auto",
          position: "relative",
        }}
      >
        <animated.div
          style={springProps}
          className="ideai-animation-demo-box"
          onClick={() => setToggle(!toggle)}
        >
          <div className="ideai-animation-demo-content">
            {example.title}
            <div
              style={{ fontSize: "0.75rem", marginTop: "0.5rem", opacity: 0.8 }}
            >
              Click to animate
            </div>
          </div>
        </animated.div>
      </div>
    );
  }

  if (example.id === "react-spring-5") {
    // Color transition
    const springProps = useSpring({
      backgroundColor: toggle ? "#3b82f6" : "#ef4444",
      config: resolveConfig(animConfig.config),
    });

    return (
      <animated.div
        style={{
          ...springProps,
          width: "100%",
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        className="ideai-animation-demo-box"
        onClick={() => setToggle(!toggle)}
      >
        <div className="ideai-animation-demo-content">{example.title}</div>
      </animated.div>
    );
  }

  if (example.id === "react-spring-6") {
    // Spring configurations - use variant config if available, otherwise use default
    const currentConfig = resolveConfig(animConfig.config);
    const [resetKey, setResetKey] = useState(0);

    const springProps = useSpring({
      from: animConfig.from || { x: 0 },
      to: { x: 100 },
      config: currentConfig,
      reset: resetKey > 0,
    });

    // Get all available configs
    const configs = [
      { name: "gentle", label: "Gentle" },
      { name: "wobbly", label: "Wobbly" },
      { name: "stiff", label: "Stiff" },
      { name: "slow", label: "Slow" },
      { name: "molasses", label: "Molasses" },
    ];

    const handleConfigChange = (cfgName: string) => {
      // This would need to be handled via variant selection in parent
      setResetKey((prev) => prev + 1);
    };

    return (
      <div
        style={{
          width: "100%",
          height: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <animated.div
          style={{
            ...springProps,
            width: "80px",
            height: "80px",
            background: "#3b82f6",
            borderRadius: "8px",
          }}
        />
        <div
          style={{ fontSize: "0.75rem", color: "#64748b", textAlign: "center" }}
        >
          Use variant dropdown to change config
        </div>
      </div>
    );
  }

  // Default spring - auto-animate
  const springProps = useSpring({
    from: animConfig.from || { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
    config: resolveConfig(animConfig.config),
  });

  return (
    <animated.div
      style={{
        ...springProps,
        width: "100%",
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="ideai-animation-demo-box"
    >
      <div className="ideai-animation-demo-content">{example.title}</div>
    </animated.div>
  );
}

/**
 * KUTE.js Demo Renderer
 */
function KuteDemo({ example }: { example: AnimationExample }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tweenRef = useRef<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  const config = example.config || {};
  const effectType = example.effectType || "animating";

  useEffect(() => {
    if (containerRef.current && !isAnimating) {
      const modulePath = "kute" + ".js";
      import(modulePath)
        .then((KUTEModule: any) => {
          const KUTE = KUTEModule.default || KUTEModule;

          if (
            !KUTE ||
            (typeof KUTE.fromTo !== "function" && typeof KUTE.to !== "function")
          ) {
            setError("KUTE.js not loaded correctly");
            setIsAnimating(true);
            return;
          }

          setIsAnimating(true);

          // Small delay to ensure DOM is ready
          setTimeout(() => {
            try {
              // Handle different KUTE.js component types
              if (
                config.type === "svgMorph" ||
                config.type === "svgCubicMorph"
              ) {
                // SVG Morph animation
                if (svgRef.current) {
                  const paths = svgRef.current.querySelectorAll("path");
                  if (paths.length >= 2) {
                    const fromPath = paths[0] as SVGPathElement;
                    const toPath = paths[1] as SVGPathElement;

                    // Destroy previous tween
                    if (
                      tweenRef.current &&
                      typeof tweenRef.current.stop === "function"
                    ) {
                      tweenRef.current.stop();
                    }

                    // Use path strings instead of elements for morph
                    const fromPathStr = fromPath.getAttribute("d") || "";
                    const toPathStr = toPath.getAttribute("d") || "";

                    if (fromPathStr && toPathStr) {
                      tweenRef.current = KUTE.fromTo(
                        fromPath,
                        { path: fromPathStr },
                        { path: toPathStr },
                        { duration: config.duration || 1000 },
                      );
                      tweenRef.current.start();
                    }
                  }
                }
              } else if (config.type === "svgDraw") {
                // SVG Draw animation
                if (svgRef.current) {
                  const path = svgRef.current.querySelector(
                    "path",
                  ) as SVGPathElement;
                  if (path) {
                    if (
                      tweenRef.current &&
                      typeof tweenRef.current.stop === "function"
                    ) {
                      tweenRef.current.stop();
                    }

                    // Use fromTo for draw animations with start and end values
                    const drawFrom = config.drawFrom || "0% 0%";
                    const drawTo = config.drawTo || "0% 100%";

                    tweenRef.current = KUTE.fromTo(
                      path,
                      { draw: drawFrom },
                      { draw: drawTo },
                      { duration: config.duration || 2000 },
                    );
                    tweenRef.current.start();
                  }
                }
              } else if (config.type === "transformFunctions") {
                // Transform Functions - simpler approach
                const targetElement = containerRef.current?.querySelector(
                  ".kute-transform-target",
                ) as HTMLElement;
                if (targetElement) {
                  if (
                    tweenRef.current &&
                    typeof tweenRef.current.stop === "function"
                  ) {
                    tweenRef.current.stop();
                  }

                  // Use simple transform properties
                  tweenRef.current = KUTE.to(
                    targetElement,
                    {
                      translateX: config.translate?.[0] || 0,
                      translateY: config.translate?.[1] || 0,
                      rotate: config.rotate || 0,
                      scale: config.scale || 1,
                    },
                    { duration: config.duration || 600 },
                  );
                  tweenRef.current.start();
                }
              } else if (config.type === "colorProperties") {
                // Color animations
                const targetElement = containerRef.current?.querySelector(
                  ".kute-color-target",
                ) as HTMLElement;
                if (targetElement) {
                  if (
                    tweenRef.current &&
                    typeof tweenRef.current.stop === "function"
                  ) {
                    tweenRef.current.stop();
                  }

                  tweenRef.current = KUTE.to(
                    targetElement,
                    {
                      color: config.color,
                      backgroundColor: config.backgroundColor,
                      borderColor: config.borderColor,
                    },
                    { duration: config.duration || 600 },
                  );
                  tweenRef.current.start();
                }
              }
            } catch (err) {
              console.warn("KUTE.js animation error:", err);
              setError("Animation failed to start");
            }
          }, 100);
        })
        .catch((err) => {
          console.warn("KUTE.js import error:", err);
          setError("Package not installed");
          setIsAnimating(true);
        });
    }

    return () => {
      if (tweenRef.current && typeof tweenRef.current.stop === "function") {
        tweenRef.current.stop();
      }
    };
  }, [isAnimating, animationKey, config]);

  const handlePlay = () => {
    setAnimationKey((prev) => prev + 1);
    setIsAnimating(false);
  };

  // Render appropriate demo based on effect type
  const renderDemo = () => {
    if (error) {
      return (
        <div className="ideai-animation-demo-content">
          <div style={{ color: "#ef4444" }}>
            ⚠️ Package not installed. Run: pnpm add kute.js
          </div>
        </div>
      );
    }

    if (config.type === "svgMorph" || config.type === "svgCubicMorph") {
      // SVG Morph - rectangle to star
      return (
        <svg
          ref={svgRef}
          width="120"
          height="120"
          viewBox="0 0 600 600"
          style={{ stroke: "#3b82f6", strokeWidth: 2, fill: "none" }}
        >
          <path
            id="rectangle"
            d="M38.01,5.653h526.531c17.905,0,32.422,14.516,32.422,32.422v526.531 c0,17.905-14.517,32.422-32.422,32.422H38.01c-17.906,0-32.422-14.517-32.422-32.422V38.075C5.588,20.169,20.104,5.653,38.01,5.653z"
          />
          <path
            id="star"
            d="M301.113,12.011l99.25,179.996l201.864,38.778L461.706,380.808 l25.508,203.958l-186.101-87.287L115.01,584.766l25.507-203.958L0,230.785l201.86-38.778L301.113,12.011"
            style={{ visibility: "hidden" }}
          />
        </svg>
      );
    }

    if (config.type === "svgDraw") {
      // SVG Draw - use a more complex path for better demo
      return (
        <svg
          ref={svgRef}
          width="120"
          height="120"
          viewBox="0 0 200 200"
          style={{ stroke: "#3b82f6", strokeWidth: 4, fill: "none" }}
        >
          <path d="M 20 100 Q 50 20, 100 100 T 180 100" />
        </svg>
      );
    }

    if (
      config.type === "transformMatrix" ||
      config.type === "transformFunctions"
    ) {
      // Transform animations
      return (
        <div
          className="kute-transform-target"
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#3b82f6",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          KUTE
        </div>
      );
    }

    if (config.type === "colorProperties") {
      // Color animations
      return (
        <div
          className="kute-color-target"
          style={{
            padding: "16px 24px",
            borderRadius: "8px",
            border: "2px solid #e5e7eb",
            backgroundColor: "#ffffff",
            color: "#1f2937",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.3s",
          }}
        >
          Color Transition
        </div>
      );
    }

    // Default fallback
    return (
      <div className="ideai-animation-demo-content">
        {example.title}
        <div style={{ fontSize: "0.75rem", marginTop: "0.5rem", opacity: 0.7 }}>
          KUTE.js - {example.description}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="ideai-animation-demo-box"
      style={{
        width: "100%",
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
      key={animationKey}
    >
      {renderDemo()}
      {!error && (
        <button
          onClick={handlePlay}
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            padding: "4px 8px",
            fontSize: "11px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Play
        </button>
      )}
    </div>
  );
}

/**
 * Motion One Demo Renderer
 */
function MotionOneDemo({
  example,
  animationKey,
}: {
  example: AnimationExample;
  animationKey?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<any>(null);
  const [itemOrder, setItemOrder] = useState([0, 1, 2, 3]);
  const animConfig = example.config as any;

  useEffect(() => {
    // Reset animation state when example or animationKey changes
    setHasAnimated(false);
    setError(null);
    if (
      animationRef.current &&
      typeof animationRef.current.stop === "function"
    ) {
      animationRef.current.stop();
    }

    if (containerRef.current && typeof window !== "undefined") {
      // Use dynamic import with proper error handling - only on client
      const loadMotionOne = async () => {
        try {
          // Try importing from @motionone/dom with multiple strategies
          let motionOneModule: any;
          let importError: any = null;

          // Try multiple import strategies
          const importStrategies = [
            () => import("@motionone/dom"),
            () => import("@motionone/dom/dist/index.es.js"),
            () => {
              const path = "@motionone" + "/dom";
              return import(path);
            },
          ];

          for (const importFn of importStrategies) {
            try {
              motionOneModule = await importFn();
              // Check for named export
              if (motionOneModule.animate) {
                break;
              }
              // Check for default export
              if (motionOneModule.default?.animate) {
                motionOneModule = motionOneModule.default;
                break;
              }
              // Check if it's the module itself
              if (typeof motionOneModule === "function") {
                motionOneModule = { animate: motionOneModule };
                break;
              }
            } catch (err: any) {
              importError = err;
              continue;
            }
          }

          if (!motionOneModule || !motionOneModule.animate) {
            console.error(
              "Motion One import failed. Module:",
              motionOneModule,
              "Error:",
              importError,
            );
            setError("Package not installed. Run: pnpm add @motionone/dom");
            setHasAnimated(true);
            return;
          }

          setHasAnimated(true);

          // Handle Layout Animation (reordering)
          if (animConfig.layout && animConfig.reorder) {
            const itemCount = animConfig.itemCount || 4;
            const items =
              containerRef.current?.querySelectorAll(".layout-item");
            if (items && items.length > 0) {
              // Animate each item to its new position
              items.forEach((el: any, i: number) => {
                const newIndex = itemOrder[i];
                const x = newIndex * 50;
                motionOneModule.animate(
                  el,
                  { x: [null, x] },
                  { duration: animConfig.duration || 0.3, easing: "ease-out" },
                );
              });
            }
            return;
          }

          // Handle regular animations
          const targetElement = containerRef.current?.querySelector(
            ".motion-one-target",
          ) as HTMLElement;
          if (targetElement) {
            // Stop previous animation
            if (
              animationRef.current &&
              typeof animationRef.current.stop === "function"
            ) {
              animationRef.current.stop();
            }

            // Build keyframes object from config
            const keyframes: any = {};
            if (animConfig.opacity) keyframes.opacity = animConfig.opacity;
            if (animConfig.scale) {
              // Spring animations only support 2 keyframes
              const scaleValues = Array.isArray(animConfig.scale)
                ? animConfig.scale
                : [1, animConfig.scale];
              keyframes.scale =
                scaleValues.length > 2 && animConfig.easing?.includes("spring")
                  ? [scaleValues[0], scaleValues[1]]
                  : scaleValues;
            }
            if (animConfig.x !== undefined) keyframes.x = animConfig.x;
            if (animConfig.y !== undefined) keyframes.y = animConfig.y;
            if (animConfig.rotate) keyframes.rotate = animConfig.rotate;
            if (animConfig.backgroundColor)
              keyframes.backgroundColor = animConfig.backgroundColor;

            const options: any = {
              duration: animConfig.duration || 0.5,
            };

            // Handle spring easing - Motion One uses string 'spring()' or 'spring(stiffness, damping)'
            if (animConfig.easing) {
              // Motion One accepts spring easing as string directly
              options.easing = animConfig.easing;
            }

            if (animConfig.repeat) {
              options.repeat =
                animConfig.repeat === "Infinity" ? Infinity : animConfig.repeat;
            }

            animationRef.current = motionOneModule.animate(
              targetElement,
              Object.keys(keyframes).length > 0
                ? keyframes
                : { opacity: [0, 1] },
              options,
            );
          }
        } catch (err: any) {
          console.warn("Motion One error:", err);
          // Check if it's a module not found error
          if (
            err?.message?.includes("Cannot find module") ||
            err?.code === "MODULE_NOT_FOUND" ||
            err?.message?.includes("Failed to fetch") ||
            err?.message?.includes("not found")
          ) {
            setError("Package not installed. Run: pnpm add @motionone/dom");
          } else {
            setError(`Motion One error: ${err?.message || "Unknown error"}`);
          }
          setHasAnimated(true);
        }
      };
      loadMotionOne();
    }

    return () => {
      if (
        animationRef.current &&
        typeof animationRef.current.stop === "function"
      ) {
        animationRef.current.stop();
      }
    };
  }, [example.config, example.id, animationKey, itemOrder]); // Include animationKey to reset on play

  // Handle layout reordering on click
  const handleReorder = () => {
    setItemOrder((prev) => {
      const newOrder = [...prev];
      // Rotate items
      const first = newOrder.shift();
      if (first !== undefined) {
        newOrder.push(first);
      }
      return newOrder;
    });
    setHasAnimated(false); // Trigger re-animation
  };

  // Layout Animation - show reorderable items
  if (animConfig.layout && animConfig.reorder) {
    const itemCount = animConfig.itemCount || 4;
    return (
      <div
        ref={containerRef}
        className="ideai-animation-demo-box"
        style={{
          width: "100%",
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          position: "relative",
        }}
      >
        {Array.from({ length: itemCount }).map((_, i) => (
          <div
            key={i}
            className="layout-item"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: `hsl(${i * 90}, 70%, 60%)`,
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {itemOrder[i] + 1}
          </div>
        ))}
        <button
          onClick={handleReorder}
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            padding: "4px 8px",
            fontSize: "11px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reorder
        </button>
        {error && (
          <div
            style={{
              fontSize: "0.75rem",
              marginTop: "0.5rem",
              color: "#ef4444",
              position: "absolute",
              top: "8px",
            }}
          >
            ⚠️ Package not installed. Run: pnpm add @motionone/dom
          </div>
        )}
      </div>
    );
  }

  // Regular animations
  return (
    <div
      ref={containerRef}
      className="ideai-animation-demo-box"
      style={{
        width: "100%",
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        className="motion-one-target"
        style={{
          width: "80px",
          height: "80px",
          backgroundColor: "#3b82f6",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {example.title}
      </div>
      {error && (
        <div
          style={{
            fontSize: "0.75rem",
            marginTop: "0.5rem",
            color: "#ef4444",
            position: "absolute",
            top: "8px",
          }}
        >
          ⚠️ Package not installed. Run: pnpm add @motionone/dom
        </div>
      )}
    </div>
  );
}

/**
 * tsParticles Demo Renderer
 */
function TsParticlesDemo({ example }: { example: AnimationExample }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [init, setInit] = useState(false);
  const [ParticlesComponent, setParticlesComponent] = useState<any>(null);
  const [initParticlesEngine, setInitParticlesEngine] = useState<any>(null);
  const [loadSlimFn, setLoadSlimFn] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize particles engine once per component mount
  useEffect(() => {
    Promise.all([
      import("@tsparticles/react").catch(() => null),
      import("@tsparticles/slim").catch(() => null),
    ])
      .then(([Particles, Slim]) => {
        if (Particles && Slim) {
          const ParticlesComp = Particles.default || Particles.Particles;
          const initEngine = Particles.initParticlesEngine;
          const loadSlim = Slim.default || Slim.loadSlim;

          if (ParticlesComp && loadSlim && initEngine) {
            setParticlesComponent(() => ParticlesComp);
            setInitParticlesEngine(() => initEngine);
            setLoadSlimFn(() => loadSlim);

            // Initialize engine - only once
            initEngine(async (engine: any) => {
              await loadSlim(engine);
            })
              .then(() => {
                setInit(true);
              })
              .catch((err: any) => {
                console.warn("Particles init error:", err);
                setError("Failed to initialize particles engine");
              });
          } else {
            setError("Packages not installed");
          }
        } else {
          setError("Packages not installed");
        }
      })
      .catch((err) => {
        console.warn("Particles import error:", err);
        setError("Packages not installed");
      });
  }, []);

  const particlesConfig = example.config || {
    particles: {
      number: { value: 50 },
      color: { value: "#3b82f6" },
      size: { value: 3 },
    },
  };

  return (
    <div
      ref={containerRef}
      className="ideai-animation-demo-box"
      style={{
        width: "100%",
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
        zIndex: 1,
        backgroundColor:
          particlesConfig.background?.color?.value || "transparent",
      }}
    >
      {error ? (
        <div className="ideai-animation-demo-content">
          {example.title}
          <div
            style={{
              fontSize: "0.75rem",
              marginTop: "0.5rem",
              color: "#ef4444",
            }}
          >
            ⚠️ Packages not installed. Run: pnpm add @tsparticles/react
            @tsparticles/slim @tsparticles/engine
          </div>
        </div>
      ) : init && ParticlesComponent ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            isolation: "isolate",
            zIndex: 1,
          }}
        >
          <ParticlesComponent
            id={`tsparticles-demo-${example.id}`}
            options={{
              ...particlesConfig,
              fullScreen: { enable: false },
              detectRetina: true,
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      ) : (
        <div className="ideai-animation-demo-content">Loading particles...</div>
      )}
    </div>
  );
}

/**
 * Vivus Demo Renderer
 */
function VivusDemo({ example }: { example: AnimationExample }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (svgRef.current && !isAnimating) {
      import("vivus")
        .then((VivusModule: any) => {
          setIsAnimating(true);
          const animConfig = example.config as any;
          const Vivus = VivusModule.default || VivusModule;
          if (Vivus && svgRef.current) {
            new Vivus(svgRef.current, {
              type: animConfig.type || "oneByOne",
              duration: animConfig.duration || 200,
              animTimingFunction: Vivus.EASE,
            });
          }
        })
        .catch(() => {
          setError("Package not installed");
          setIsAnimating(true);
        });
    }
  }, [example.config, isAnimating]);

  return (
    <div
      ref={containerRef}
      className="ideai-animation-demo-box"
      style={{
        width: "100%",
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {error ? (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "0.875rem",
              marginBottom: "0.5rem",
              color: "#ef4444",
            }}
          >
            ⚠️ Package not installed
          </div>
          <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
            Run: pnpm add vivus
          </div>
        </div>
      ) : (
        <svg
          ref={svgRef}
          width="120"
          height="120"
          viewBox="0 0 120 120"
          style={{ stroke: "#3b82f6", strokeWidth: 2, fill: "none" }}
        >
          <circle cx="60" cy="60" r="50" />
          <path d="M 30 60 L 60 30 L 90 60 L 60 90 Z" />
        </svg>
      )}
    </div>
  );
}
