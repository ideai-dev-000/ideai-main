/**
 * @fileoverview Modal component for viewing apps
 */

"use client";

import { useEffect, useState } from "react";
import { defaultRoutingConfig, getAppIframeUrl, type AppConfig } from "./config/routing";
import styles from "./app-modal.module.css";

export function AppModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState<AppConfig | null>(null);
  const [appUrl, setAppUrl] = useState<string>("");

  useEffect(() => {
    const handleOpenModal = (event: CustomEvent<{ app: AppConfig }>) => {
      const app = event.detail.app;
      setCurrentApp(app);
      
      // Use centralized routing config to get URL
      const config = {
        ...defaultRoutingConfig,
        baseUrl: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
      };
      
      setAppUrl(getAppIframeUrl(app, config));
      setIsOpen(true);
    };

    const handleCloseModal = () => {
      setIsOpen(false);
      setCurrentApp(null);
      setAppUrl("");
    };

    window.addEventListener("openAppModal", handleOpenModal as EventListener);
    window.addEventListener("closeAppModal", handleCloseModal);

    return () => {
      window.removeEventListener("openAppModal", handleOpenModal as EventListener);
      window.removeEventListener("closeAppModal", handleCloseModal);
    };
  }, []);

  if (!isOpen || !currentApp) return null;

  const handleClose = () => {
    window.dispatchEvent(new CustomEvent("closeAppModal"));
  };

  const handleOpenInNewTab = () => {
    window.open(appUrl, "_blank");
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{currentApp.name}</h2>
          <button className={styles.closeButton} onClick={handleClose} type="button">
            ×
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <p className={styles.modalDescription}>{currentApp.description}</p>
          <div className={styles.modalInfo}>
            <span className={styles.modalPath}>Path: {currentApp.path}</span>
            <span className={styles.modalPort}>Port: {currentApp.port}</span>
          </div>
          
          <div className={styles.modalFrame}>
            <iframe
              src={appUrl}
              className={styles.iframe}
              title={currentApp.name}
              allow="fullscreen"
            />
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <button
            className={styles.openButton}
            onClick={handleOpenInNewTab}
            type="button"
          >
            Open in New Tab
          </button>
          <button
            className={styles.closeButtonSecondary}
            onClick={handleClose}
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

