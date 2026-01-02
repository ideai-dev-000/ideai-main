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

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, useSprings, animated, config } from "@react-spring/web";
import { ExternalLink, Code2, Play, Sparkles, Zap } from "lucide-react";
import type { AnimationExample } from "./types";

interface AnimationCardProps {
  example: AnimationExample;
  library: "framer-motion" | "react-spring";
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

  // Render animation based on library
  const renderDemo = () => {
    if (library === "framer-motion") {
      return <FramerMotionDemo example={example} />;
    } else {
      return <ReactSpringDemo example={example} />;
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
              <p className="ideai-animation-card__description">{example.description}</p>
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
                    <code>{example.code}</code>
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
          <div className="ideai-animation-card__demo-content" key={animationKey}>
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
      <div style={{ width: "100%", height: "200px", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center", justifyContent: "center" }}>
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
          style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", background: "rgba(255, 255, 255, 0.3)", border: "none", borderRadius: "4px", cursor: "pointer", color: "white" }}
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
    cursor: animConfig.drag ? "grab" : animConfig.whileHover ? "pointer" : "default",
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
      motionProps.dragConstraints = { left: -50, right: 50, top: -50, bottom: 50 };
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
  const [count, setCount] = useState(animConfig.number || 100);

  // Helper to resolve config (handle string references like "wobbly")
  const resolveConfig = (cfg: any) => {
    if (!cfg) return config.gentle;
    if (typeof cfg === "string") {
      return config[cfg] || config.gentle;
    }
    return cfg;
  };

  // Handle different React Spring patterns
  if (example.id === "react-spring-1") {
    // Spring physics - auto-animate on mount, toggle on click
    const springProps = useSpring({
      from: animConfig.from || { scale: 0 },
      to: { scale: 1 },
      config: resolveConfig(animConfig.config),
    });
    
    const toggleSpring = useSpring({
      scale: toggle ? 1.2 : 1,
      rotate: toggle ? 180 : 0,
      config: resolveConfig(animConfig.config),
    });

    return (
      <animated.div
        style={{
          ...springProps,
          ...toggleSpring,
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

  if (example.id === "react-spring-2") {
    // Number animation
    const springProps = useSpring({
      number: count,
      from: animConfig.from || { number: 0 },
      config: resolveConfig(animConfig.config),
    });

    return (
      <div style={{ width: "100%", height: "200px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <animated.div style={{ fontSize: "3rem", fontWeight: 700 }}>
          {springProps.number.to((n: number) => Math.floor(n))}
        </animated.div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setCount(count + 10)}
            style={{ padding: "0.5rem 1rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            +10
          </button>
          <button
            onClick={() => setCount(count - 10)}
            style={{ padding: "0.5rem 1rem", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            -10
          </button>
        </div>
      </div>
    );
  }

  if (example.id === "react-spring-3") {
    // Trail animation
    const items = [1, 2, 3, 4, 5];
    const [springs, api] = useSprings(
      items.length,
      (i) => ({
        opacity: toggle ? 1 : 0.5,
        transform: toggle ? `translateY(0px)` : `translateY(${i * 20}px)`,
        delay: i * 100,
        config: resolveConfig(animConfig.config),
      })
    );

    useEffect(() => {
      api.start((i) => ({
        opacity: toggle ? 1 : 0.5,
        transform: toggle ? `translateY(0px)` : `translateY(${i * 20}px)`,
        delay: i * 100,
      }));
    }, [toggle, api]);

    return (
      <div style={{ width: "100%", height: "200px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {springs.map((spring, i) => (
            <animated.div
              key={i}
              style={{
                ...spring,
                width: "40px",
                height: "40px",
                background: "#9333ea",
                borderRadius: "8px",
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setToggle(!toggle)}
          style={{ padding: "0.5rem 1rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
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
      <div style={{ width: "100%", height: "200px", overflow: "auto", position: "relative" }}>
        <animated.div
          style={springProps}
          className="ideai-animation-demo-box"
          onClick={() => setToggle(!toggle)}
        >
          <div className="ideai-animation-demo-content">
            {example.title}
            <div style={{ fontSize: "0.75rem", marginTop: "0.5rem", opacity: 0.8 }}>Click to animate</div>
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
    // Spring configurations - show all configs
    const configs = ["gentle", "wobbly", "stiff", "slow", "molasses"];
    const [activeConfig, setActiveConfig] = useState("wobbly");
    
    const springProps = useSpring({
      from: animConfig.from || { x: 0 },
      to: { x: 100 },
      config: config[activeConfig as keyof typeof config] || config.gentle,
    });

    return (
      <div style={{ width: "100%", height: "200px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <animated.div
          style={{
            ...springProps,
            width: "100px",
            height: "100px",
            background: "#3b82f6",
            borderRadius: "8px",
          }}
        />
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          {configs.map((cfg) => (
            <button
              key={cfg}
              onClick={() => setActiveConfig(cfg)}
              style={{
                padding: "0.25rem 0.75rem",
                background: activeConfig === cfg ? "#3b82f6" : "#e2e8f0",
                color: activeConfig === cfg ? "white" : "#1e293b",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.75rem",
              }}
            >
              {cfg}
            </button>
          ))}
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

