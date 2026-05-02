import db from "../db";
import { product, productImages, productQuantity, productReview } from "../db/schemas/product-schema";
import { gt, eq } from "drizzle-orm";

async function cleanup() {
  console.log("Cleaning up products with ID > 9...");

  try {
    // Get products to delete
    const productsToDelete = await db.select({ id: product.id }).from(product).where(gt(product.id, 9));
    const ids = productsToDelete.map(p => p.id);
    console.log(`Found ${ids.length} products to delete`);

    if (ids.length === 0) {
      console.log("No products to clean up");
      process.exit(0);
    }

    // Delete from child tables first
    for (const id of ids) {
      await db.delete(productReview).where(eq(productReview.productId, id));
      await db.delete(productImages).where(eq(productImages.productId, id));
      await db.delete(productQuantity).where(eq(productQuantity.productId, id));
    }

    // Then delete products
    const result = await db.delete(product).where(gt(product.id, 9)).returning();
    console.log(`Deleted ${result.length} products`);
  } catch (err) {
    console.error("Cleanup failed:", err);
  }

  process.exit(0);
}

cleanup();
