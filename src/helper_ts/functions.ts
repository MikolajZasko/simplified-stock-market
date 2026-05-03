import { nav_buttons } from "./variables.js"
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from "../db/schemas/schema.js";
import * as fs from 'node:fs';
import * as path from 'node:path';

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

// makes sure that port is correct
export function getPort(): number {
  const port = process.env.PORT;
  if (!port) return 3000;

  const parsedPort = parseInt(port, 10);
  if (isNaN(parsedPort)) {
    throw new Error(`Invalid PORT environment variable: "${port}"`);
  }
  return parsedPort;
}

// // -= 1 from the /app_controll_scripts/instance_count
// export async function decrease_instance_counter() {
    
//     // get path
//     const filePath = path.join(process.cwd(), 'app_controll_scripts', 'instance_count');

//     console.log(filePath)
//     return

//     // try {
//     //     // 1. Read the file (returns a string)
//     //     const content = fs.readFileSync(filePath, 'utf8').trim();
        
//     //     // 2. Convert to number
//     //     let count = parseInt(content, 10);

//     //     if (isNaN(count)) {
//     //         throw new Error("File content is not a valid number");
//     //     }

//     //     // 3. Subtract 1
//     //     count -= 1;

//     //     // 4. Write back to file
//     //     // Note: Use string template or .toString() to save it
//     //     fs.writeFileSync(filePath, count.toString(), 'utf8');

//     //     console.log(`Instance count updated to: ${count}`);
//     // } catch (error) {
//     //     console.error("Failed to update instance count:", error.message);
//     // }
// }