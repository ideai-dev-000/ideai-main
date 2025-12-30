/**
 * @fileoverview App card component for landing page
 */

"use client";

import { useState } from "react";
import { defaultRoutingConfig, getAppUrl, type AppConfig } from "./config/routing";
import styles from "./app-card.module.css";

interface AppCardProps {
  app: AppConfig;
}

export function AppCard({ app }: AppCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    // Dispatch custom event to open modal (popup)
    window.dispatchEvent(
      new CustomEvent("openAppModal", { detail: { app } })
    );
  };

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{app.name}</h3>
        <span className={styles.cardPath}>{app.path}</span>
      </div>
      
      <p className={styles.cardDescription}>{app.description}</p>
      
      <div className={styles.cardFooter}>
        <div className={styles.cardMeta}>
          <span className={styles.cardPort}>Port: {app.port}</span>
          <span className={styles.cardHint}>Click to open in popup</span>
        </div>
      </div>
    </div>
  );
}

