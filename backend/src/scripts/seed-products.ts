import db from "../db";
import { product, productImages, productQuantity } from "../db/schemas/product-schema";

const clothingNames = [
  "Classic T-Shirt", "Slim Fit Jeans", "Hooded Sweatshirt", "Casual Button-Down",
  "Winter Jacket", "Summer Dress", "Sports Shorts", "Formal Blazer",
  "Knit Sweater", "Cargo Pants", "Polo Shirt", "Denim Jacket",
  "Chino Pants", "Graphic Tee", "Bomber Jacket", "Yoga Leggings",
  "Oxford Shirt", "Track Pants", "Tank Top", "Maxi Skirt",
  "Flannel Shirt", "Joggers", "Crop Top", "Blazer Dress",
  "Hawaiian Shirt", "Pleated Skirt", "Turtleneck Sweater", "Biker Jacket",
  "Linen Shirt", "Sweatpants", "Tube Top", "Trench Coat",
  "Henley Shirt", "Palazzo Pants", "V-Neck Tee", "Peacoat",
  "Corduroy Pants", "Racerback Tank", "Moto Jacket", "A-Line Skirt",
  "Flannel Shirt", "Vest Jacket", "Sun Dress", "Skinny Jeans",
  "Muscle Tee", "Wrap Dress", "Parka Jacket", "Cardigan"
];

const colors = ["Black", "White", "Navy", "Gray", "Red", "Blue", "Green"];
const sizes = ["XS", "S", "XL", "XXL", "XXXL"];
const descriptions = [
  "Premium quality clothing made with comfortable materials.",
  "Stylish and comfortable for everyday wear.",
  "Perfect fit for any occasion.",
  "High-quality fabric with excellent durability.",
  "Modern design with classic comfort."
];

async function seed() {
  console.log("Starting to seed 50 products...");

  let added = 0;

  for (let i = 0; i < 50; i++) {
    const name = clothingNames[i % clothingNames.length] + ` ${i + 1}`;
    const price = Math.floor(Math.random() * 150) + 20; // $20-$170
    const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 10 : 0; // 0-50% or 0
    const description = descriptions[i % descriptions.length];

    try {
      const [newProduct] = await db.insert(product).values({
        name,
        price,
        description,
        discount,
      }).returning();

      console.log(`Created: ${name} (ID: ${newProduct.id})`);

      // Add 1-2 images using image-7.png as placeholder
      const imageCount = Math.random() > 0.5 ? 2 : 1;
      for (let j = 0; j < imageCount; j++) {
        await db.insert(productImages).values({
          productId: newProduct.id,
          imageURL: `/uploads/1777479391236-image7.png`,
        });
      }

      // Add quantities for 2-3 random colors and sizes
      const numColors = Math.floor(Math.random() * 2) + 2; // 2-3 colors
      const selectedColors = colors.sort(() => Math.random() - 0.5).slice(0, numColors);

      for (const color of selectedColors) {
        const numSizes = Math.floor(Math.random() * 3) + 2; // 2-4 sizes
        const selectedSizes = sizes.sort(() => Math.random() - 0.5).slice(0, numSizes);

        for (const size of selectedSizes) {
          await db.insert(productQuantity).values({
            productId: newProduct.id,
            color,
            size,
            quantity: Math.floor(Math.random() * 50) + 5, // 5-55 stock
          });
        }
      }

      added++;
    } catch (err) {
      console.error(`Failed to create product ${name}:`, err);
    }
  }

  console.log(`\nSuccessfully added ${added} products!`);
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
