import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { check, integer } from "drizzle-orm/pg-core";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { orderItems } from "./order-schema";

// ============== PRODUCT ==============
export const product = pgTable(
  "product",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name").notNull(),
    price: integer("price").notNull(),
    description: text("description").notNull(),
    rating: integer("rating"),
    clothingType: varchar("cloathing_type"),
    discount: integer("discount").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    maxDiscount: check(
      "max_discount",
      sql`${table.discount} >= 0 AND ${table.discount} <= 99`,
    ),
  }),
);

// ============== PRODUCT QUANTITY ==============
export const productQuantity = pgTable("product_quantity", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  productId: integer("product_id")
    .references(() => product.id, { onDelete: "cascade" })
    .notNull(),

  quantity: integer("quantity").notNull(),
  color: varchar("color").notNull(),
  size: varchar("size").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============== PRODUCT REVIEW ==============
export const productReview = pgTable(
  "product_review",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

    rating: integer("rating").notNull(),

    productId: integer("product_id")
      .references(() => product.id, { onDelete: "cascade" })
      .notNull(),

    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    maxRating: check(
      "max_rating",
      sql`${table.rating} >= 1 AND ${table.rating} <= 5`,
    ),

    uniqueReview: uniqueIndex("unique_user_product_review").on(
      table.userId,
      table.productId,
    ),
  }),
);

// ============== PRODUCT IMAGES ==============
export const productImages = pgTable("product_images", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  productId: integer("product_id")
    .references(() => product.id, { onDelete: "cascade" })
    .notNull(),

  imageURL: varchar("image_url").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============== RELATIONS ==============

export const productRelations = relations(product, ({ many }) => ({
  images: many(productImages),
  quantities: many(productQuantity),
  reviews: many(productReview),
  orderItems: many(orderItems),
}));

export const productQuantityRelations = relations(
  productQuantity,
  ({ one }) => ({
    product: one(product, {
      fields: [productQuantity.productId],
      references: [product.id],
    }),
  }),
);

export const productReviewRelations = relations(productReview, ({ one }) => ({
  product: one(product, {
    fields: [productReview.productId],
    references: [product.id],
  }),
  user: one(user, {
    fields: [productReview.userId],
    references: [user.id],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(product, {
    fields: [productImages.productId],
    references: [product.id],
  }),
}));
