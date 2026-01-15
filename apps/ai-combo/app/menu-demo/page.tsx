/**
 * @fileoverview IdeaI Menu Demo Page
 *
 * @module MenuDemo
 * @description
 * Demo page showing different variations of the IdeaI menu system.
 * Demonstrates flexibility: horizontal scaling, different item types,
 * swipe support, and dynamic item addition.
 */

"use client";

import * as React from "react";
import { IdeAIMenuMain, IdeAIMenuSection } from "@repo/ui";
import {
  Plus,
  Home,
  Workflow,
  Code,
  Settings,
  Bell,
  User,
  Search,
} from "lucide-react";

/**
 * Menu Item Types for Demo
 */
interface MenuItem {
  id: string;
  type: "card" | "button" | "dropdown" | "toggle";
  title: string;
  content?: React.ReactNode;
}

export default function MenuDemoPage() {
  const [menu1Items, setMenu1Items] = React.useState<MenuItem[]>([
    { id: "1", type: "button", title: "Home" },
    { id: "2", type: "button", title: "Workflows" },
    { id: "3", type: "button", title: "Vibe" },
  ]);

  const [menu2Items, setMenu2Items] = React.useState<MenuItem[]>([
    {
      id: "1",
      type: "card",
      title: "Quick Actions",
      content: (
        <div className="space-y-2">
          <button className="w-full text-left px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-sm">
            New Workflow
          </button>
          <button className="w-full text-left px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-sm">
            New Chat
          </button>
        </div>
      ),
    },
    {
      id: "2",
      type: "card",
      title: "Recent",
      content: (
        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
          <div>Workflow #1</div>
          <div>Chat #2</div>
        </div>
      ),
    },
  ]);

  const [menu3Items, setMenu3Items] = React.useState<MenuItem[]>([
    { id: "1", type: "toggle", title: "All" },
    { id: "2", type: "toggle", title: "Active" },
    { id: "3", type: "toggle", title: "Archived" },
  ]);

  const addItemToMenu1 = () => {
    const newId = String(menu1Items.length + 1);
    setMenu1Items([
      ...menu1Items,
      { id: newId, type: "button", title: `Item ${newId}` },
    ]);
  };

  const addItemToMenu2 = () => {
    const newId = String(menu2Items.length + 1);
    setMenu2Items([
      ...menu2Items,
      {
        id: newId,
        type: "card",
        title: `Card ${newId}`,
        content: (
          <div className="text-sm text-slate-600 dark:text-slate-400">
            New card content
          </div>
        ),
      },
    ]);
  };

  const addItemToMenu3 = () => {
    const newId = String(menu3Items.length + 1);
    setMenu3Items([
      ...menu3Items,
      { id: newId, type: "toggle", title: `Toggle ${newId}` },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-[300px]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            IdeaI Menu Demo
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Demonstrating flexible menu system with horizontal scaling,
            different item types, swipe support, and dynamic item addition.
          </p>
        </div>

        {/* Demo Menu 1: Buttons with Add */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Menu 1: Button Items (Horizontal)
          </h2>
          <IdeAIMenuMain
            position="top"
            trigger="always"
            size={80}
            title=""
            floatingPosition={{ top: 64 }}
            headerContent={
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Navigation
                </span>
              </div>
            }
          >
            <div
              className="ideai-menu-body flex flex-row items-center gap-2 px-4 py-2"
              data-swipeable="true"
            >
              {menu1Items.map((item) => (
                <button
                  key={item.id}
                  className="ideai-menu-item-button"
                  onClick={() => console.log(`Clicked ${item.title}`)}
                >
                  {item.title}
                </button>
              ))}
              <button
                className="ideai-menu-add-item"
                onClick={addItemToMenu1}
                aria-label="Add item"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </IdeAIMenuMain>
        </div>

        {/* Demo Menu 2: Cards with Add */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Menu 2: Card Items (Horizontal)
          </h2>
          <IdeAIMenuMain
            position="top"
            trigger="always"
            size={120}
            title=""
            floatingPosition={{ top: 144 }}
            headerContent={
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Quick Access
                </span>
              </div>
            }
          >
            <div
              className="ideai-menu-body flex flex-row items-center gap-3 px-4 py-2"
              data-swipeable="true"
            >
              {menu2Items.map((item) => (
                <div
                  key={item.id}
                  className="ideai-menu-item ideai-menu-item-card"
                >
                  <h3 className="font-semibold text-sm mb-2 text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>
                  {item.content}
                </div>
              ))}
              <button
                className="ideai-menu-add-item"
                onClick={addItemToMenu2}
                aria-label="Add card"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </IdeAIMenuMain>
        </div>

        {/* Demo Menu 3: Toggle Group with Add */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Menu 3: Toggle Group (Horizontal)
          </h2>
          <IdeAIMenuMain
            position="top"
            trigger="always"
            size={80}
            title=""
            floatingPosition={{ top: 264 }}
            headerContent={
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Filters
                </span>
              </div>
            }
          >
            <div
              className="ideai-menu-body flex flex-row items-center gap-2 px-4 py-2"
              data-swipeable="true"
            >
              <div className="ideai-menu-item ideai-menu-item-toggle-group">
                {menu3Items.map((item) => (
                  <button
                    key={item.id}
                    className="ideai-menu-item-toggle"
                    onClick={() => console.log(`Toggled ${item.title}`)}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              <button
                className="ideai-menu-add-item"
                onClick={addItemToMenu3}
                aria-label="Add toggle"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </IdeAIMenuMain>
        </div>

        {/* Info Section */}
        <div className="mt-16 p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
            Features Demonstrated
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>✅ Horizontal scaling for top/bottom menus</li>
            <li>✅ Different item types: buttons, cards, toggle groups</li>
            <li>✅ Swipe support (data-swipeable attribute)</li>
            <li>✅ Dynamic item addition with plus button</li>
            <li>✅ Smooth animations for adding/removing items</li>
            <li>✅ Mobile-friendly touch interactions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
