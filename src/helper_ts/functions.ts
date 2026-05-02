import { nav_buttons } from "./variables.js"
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PgTable } from 'drizzle-orm/pg-core';

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

// // a helper function for database insert
// export const db_insert = async (db: NodePgDatabase, db_table: PgTable, values: any, success_status: number, error_status: number, success_message: string, error_message: string) => {
//     try {
//         // try to insert stocks to database
//         await db.insert(db_table)
//             .values(values)
//             .returning();

//         // if we reach here, operation was successful
//         return {
//             response_code: success_status,
//             message: success_message
//         }


//         // return res.status(200).json({
//         //     message: "Insertion was successful"
//         // })

//     } catch (e) {
//         // if we reach here, operation was not successful
//         console.error("Insertion failed:", e);
//         return {
//             response_code: error_status,
//             message: error_message
//         }


//         // return res.status(500).json({
//         //     message: "Insertion was NOT successful",
//         //     error: e
//         // })
//     }
// }