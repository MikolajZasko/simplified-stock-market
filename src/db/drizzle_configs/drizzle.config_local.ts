import { defineConfig } from "drizzle-kit";

// connection between TS and DB - drizzle
// this is the config file
export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schemas/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: "postgresql://postgress_admin:postgress_admin@localhost:5432/simplified_stock_market",
    },
    verbose: true,
    strict: true,
});