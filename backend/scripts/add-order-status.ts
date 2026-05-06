import db from "../src/db";
import { sql } from "drizzle-orm";

async function addOrderStatus() {
  try {
    console.log("Adding status column to orders table...");
    
    // Check if status column exists and add default value for existing rows
    await db.execute(sql`
      ALTER TABLE "order" 
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' NOT NULL
    `);
    
    console.log("Order status column added successfully!");
    console.log("All existing orders have been set to 'pending' status.");
    
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

addOrderStatus();
