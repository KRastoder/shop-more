import { integer } from "drizzle-orm/pg-core";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { product } from "./product-schema";
import { relations } from "drizzle-orm";

export const orderSchema = pgTable("order", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  totalPrice: integer("total_price"),
  adress: varchar("adress"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

//RELATIONS
export const orderItems = pgTable("order_items", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orderSchema.id),
  productId: integer("product_id")
    .notNull()
    .references(() => product.id),
  quantity: integer("quantity"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const orderRelations = relations(orderSchema, ({ one, many }) => ({
  user: one(user, {
    fields: [orderSchema.userId],
    references: [user.id],
  }),

  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orderSchema, {
    fields: [orderItems.orderId],
    references: [orderSchema.id],
  }),

  product: one(product, {
    fields: [orderItems.productId],
    references: [product.id],
  }),
}));
