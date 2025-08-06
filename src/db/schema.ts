import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  text,
  uuid,
  pgEnum,
  numeric,
  integer,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("users_role_enum", ["ADMIN", "CASHIER"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  username: varchar("username", { length: 50 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: userRoleEnum().default("CASHIER").notNull(),
  refreshToken: text("refresh_token"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  price: numeric("price").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  total: numeric("total").notNull(),
});

export const transactionItems = pgTable("transaction_items", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  transactionId: uuid("transaction_id")
    .notNull()
    .references(() => transactions.id),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  qyt: integer("qty").notNull(),
  price: numeric("price").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(
  transactions,
  ({ one, many }) => ({
    users: one(users, {
      fields: [transactions.userId],
      references: [users.id],
    }),
    transactionItems: many(transactionItems),
  })
);

export const productsRelations = relations(products, ({ many }) => ({
  transactionItems: many(transactionItems),
}));

export const transactionItemsRelations = relations(
  transactionItems,
  ({ one }) => ({
    products: one(products, {
      fields: [transactionItems.productId],
      references: [products.id],
    }),
    transactions: one(transactions, {
      fields: [transactionItems.transactionId],
      references: [transactions.id],
    }),
  })
);
