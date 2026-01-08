import { execSync } from "child_process";

const VERCEL_ENV = process.env.VERCEL_ENV;
const DATABASE_URL = process.env.DATABASE_URL;

// Only run migrations if:
// 1. We're in production environment
// 2. DATABASE_URL is configured
// 3. We're not in a build-only context (migrations should run separately or at runtime)
if (VERCEL_ENV === "production" && DATABASE_URL) {
  console.log("Running database migrations for production...");
  try {
    execSync("pnpm db:migrate", { stdio: "inherit" });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    console.warn(
      "⚠️  Continuing build despite migration failure (migrations can be run separately)",
    );
    // Don't exit - allow build to continue
    // Migrations can be run separately or at runtime
  }
} else {
  if (!DATABASE_URL) {
    console.log(`Skipping migrations (DATABASE_URL not configured)`);
  } else {
    console.log(`Skipping migrations (VERCEL_ENV=${VERCEL_ENV ?? "not set"})`);
  }
}
