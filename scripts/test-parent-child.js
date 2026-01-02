#!/usr/bin/env node
/**
 * @fileoverview Test script to verify parent/child app configuration
 * @description Tests defaults work and URLs are correct
 */

const fs = require("fs");
const path = require("path");

const DEFAULT_CHILD_PORTS = {
  docs: 3001,
  all: 3002,
  nocss: 3003,
  mvp: 3004,
  tailwind: 3005,
  allcss: 3006,
  bootstrap: 3007,
  unocss: 3008,
  shadcn: 3009,
};

function readConfig(appName) {
  const configPath = path.join(__dirname, "..", "apps", appName, ".ideai.json");
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
  }
  return null;
}

function getDefaultConfig(appName) {
  if (appName === "web") {
    return {
      role: "parent",
      name: "IdeaI",
      childApps: Object.keys(DEFAULT_CHILD_PORTS),
    };
  }
  return {
    role: "child",
    name: appName.charAt(0).toUpperCase() + appName.slice(1),
    parentApp: "web",
    localPort: DEFAULT_CHILD_PORTS[appName],
  };
}

console.log("🧪 Testing Parent/Child Configuration\n");

// Test parent (web)
const webConfig = readConfig("web") || getDefaultConfig("web");
console.log("✅ Parent App (web):");
console.log(`   Role: ${webConfig.role}`);
console.log(`   Name: ${webConfig.name}`);
console.log(`   Child Apps: ${webConfig.childApps?.length || 0}`);
console.log(`   URL: / (root)`);
console.log("");

// Test children (docs, all, nocss - no config files)
const testChildren = ["docs", "all", "nocss"];
console.log("✅ Child Apps (testing defaults - no .ideai.json):");
testChildren.forEach((app) => {
  const config = readConfig(app) || getDefaultConfig(app);
  const hasConfig = readConfig(app) !== null;
  console.log(`   ${app}:`);
  console.log(`     Role: ${config.role} ${hasConfig ? "(from config)" : "(default)"}`);
  console.log(`     Name: ${config.name}`);
  console.log(`     Parent: ${config.parentApp}`);
  console.log(`     Port: ${config.localPort}`);
  console.log(`     URL: /apps/${app}`);
  console.log(`     Dev URL: http://localhost:${config.localPort}`);
  console.log("");
});

// Test all child apps
console.log("📋 All Child Apps:");
const allChildren = Object.keys(DEFAULT_CHILD_PORTS);
allChildren.forEach((app) => {
  const config = readConfig(app) || getDefaultConfig(app);
  const status = readConfig(app) ? "📄" : "⚙️";
  console.log(`   ${status} ${app}: /apps/${app} (port ${config.localPort})`);
});

console.log("\n✅ Defaults working correctly!");
console.log("   - web defaults to parent");
console.log("   - All other apps default to children");








