import { nav_buttons } from "./variables.js"
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from "../db/schemas/schema.js";

// a helper function that looks for the right tittle in nav_buttons
export const getPageTitle = (currentPath: string) => {
    const button = nav_buttons.find(btn => btn.link === currentPath);

    // Default title ("Home") if no match
    if (button) {
        return button.title
    }
    else {
        return "Home"
    }
};

// a helper function for database audit log insert
// returns 1 if ok
// returns 0 if NOT ok
export const db_log_insert = async (db: NodePgDatabase<typeof schema>, log_entry: schema.NewLog) => {
    try {
        // try to insert stocks to database
        await db.insert(schema.audit_log)
            .values(log_entry)

        // if we reach here, operation was successful
        return 1

    } catch (e) {
        // if we reach here, operation was not successful
        console.error("Insertion failed:", e);
        return 0
    }
}