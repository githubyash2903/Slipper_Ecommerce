import Razorpay from "razorpay";
import pool from "./db";
import { runMigrations } from "./migrate";

// Import All Schemas
import { usersTable } from "./schemas/001_users";         
import { userProfileMigration } from "./schemas/002_users";
import { productsTable } from "./schemas/003_product";  
import { cartItemsTable } from "./schemas/004_cart";
import { ordersTable } from "./schemas/005_orders";
import { wishlistTable } from "./schemas/006_wishlist";
import { employeesTable } from "./schemas/007_employee";
import { paymentsTable } from "./schemas/008_payment";
import { stockManagementTable } from "./schemas/009_stockManagment";
import { addRazorpayIdToOrders } from "./schemas/010_add_razorpay_id_to_orders";
import { fixMissingOrderColumns } from "./schemas/011_fixMissingColumns";

export class DatabaseInitializer {
  static async initialize() {
    await this.verifyConnection();
    await this.runSchemaMigrations();
  }

  private static async verifyConnection() {
    try {
      await pool.query("SELECT 1");
      console.log(" DB connection verified");
    } catch (err) {
      console.error(" DB connection failed");
      throw err;
    }
  }

  private static async runSchemaMigrations() {
    console.log(" Checking migrations...");
    
    await runMigrations([
      usersTable,
      userProfileMigration,
      productsTable,
      cartItemsTable,
      ordersTable,
      wishlistTable,
      employeesTable,
      paymentsTable,
      stockManagementTable,
      addRazorpayIdToOrders,
      fixMissingOrderColumns,
    
      
    ]);
    
    console.log(" All migrations executed successfully");
  }
}
