import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { check } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { varchar } from "drizzle-orm/pg-core";
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const product = pgTable(
  "product",
  {
    id: text("id").primaryKey(),
    name: varchar("name").notNull(),
    price: integer("price").notNull(),
    description: text("description").notNull(),
    discournt: integer("discount").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => {
    return {
      // discount must be > 0 AND <= 99
      maxDiscount: check(
        "max_discount",
        sql`${table.discournt} <= 99 AND ${table.discournt} >= 0`,
      ),
    };
  },
);

export const productQuantity = pgTable("product_quantity", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .references(() => product.id, { onDelete: "cascade" })
    .notNull(),
  quantity: integer("quantity"),
  color: varchar("color"),
  size: varchar("size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});

export const productReview = pgTable(
  "product_review",
  {
    id: text("id").primaryKey(),
    rating: integer("rating").notNull(),
    productId: text("product_id")
      .references(() => product.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at"),
  },
  (table) => {
    return {
      // the rating must be more then zero and less then 5
      maxRating: check(
        "max_rating",
        sql`${table.rating} <= 5 AND ${table.rating} >= 0`,
      ),
      //One user can only make one review on one product
      uniqueReview: uniqueIndex("unique_user_product_review").on(
        table.userId,
        table.productId,
      ),
    };
  },
);

export const productImages = pgTable("product_images", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .references(() => product.id, { onDelete: "cascade" })
    .notNull(),
  imageURL: varchar("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});
