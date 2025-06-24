import { pgTable, uuid, varchar, text, decimal, boolean, timestamp, jsonb, integer, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Schemas para organização
const configSchema = 'config';
const userDataSchema = 'user_data';

// Tabelas de configuração
export const productCategories = pgTable('product_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  displayOrder: integer('display_order'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').references(() => productCategories.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  unit: text('unit').notNull(),
  hasMinimumPrice: boolean('has_minimum_price').default(false),
  minimumPrice: decimal('minimum_price', { precision: 10, scale: 2 }).default('0'),
  displayOrder: integer('display_order'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const productOptions = pgTable('product_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  unit: text('unit').notNull(),
  displayOrder: integer('display_order'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const basePrices = pgTable('base_prices', {
  id: uuid('id').primaryKey().defaultRandom(),
  productOptionId: uuid('product_option_id').references(() => productOptions.id, { onDelete: 'cascade' }).notNull(),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Perfis de usuários
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // Referência ao auth.users.id
  name: text('name'),
  company: text('company'),
  isAdmin: boolean('is_admin').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabelas de dados específicos de usuários
export const userPrices = pgTable('user_prices', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), // Referência ao auth.users.id
  productOptionId: uuid('product_option_id').references(() => productOptions.id, { onDelete: 'cascade' }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const budgetSettings = pgTable('budget_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), // Referência ao auth.users.id
  paymentMethod: text('payment_method'),
  deliveryTime: text('delivery_time'),
  warranty: text('warranty'),
  taxPercentage: decimal('tax_percentage', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const creditCardFees = pgTable('credit_card_fees', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), // Referência ao auth.users.id
  installments: integer('installments').notNull(),
  feePercentage: decimal('fee_percentage', { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const installationFees = pgTable('installation_fees', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), // Referência ao auth.users.id
  location: text('location').notNull(),
  fee: decimal('fee', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabelas de orçamentos
export const budgets = pgTable('budgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), // Referência ao auth.users.id
  clientName: text('client_name').notNull(),
  clientEmail: text('client_email'),
  clientPhone: text('client_phone'),
  clientCompany: text('client_company'),
  status: text('status').notNull().default('draft'),
  budgetNumber: text('budget_number'),
  budgetDate: date('budget_date').defaultNow(),
  validUntil: date('valid_until'),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull().default('0'),
  taxPercentage: decimal('tax_percentage', { precision: 5, scale: 2 }),
  taxValue: decimal('tax_value', { precision: 10, scale: 2 }),
  discountPercentage: decimal('discount_percentage', { precision: 5, scale: 2 }),
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }),
  totalValue: decimal('total_value', { precision: 10, scale: 2 }).notNull().default('0'),
  paymentMethod: text('payment_method'),
  deliveryTime: text('delivery_time'),
  warranty: text('warranty'),
  notes: text('notes'),
  installationLocation: text('installation_location'),
  installationFee: decimal('installation_fee', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const budgetItems = pgTable('budget_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  budgetId: uuid('budget_id').references(() => budgets.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  productOptionId: uuid('product_option_id').references(() => productOptions.id),
  description: text('description').notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  unit: text('unit').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  width: decimal('width', { precision: 10, scale: 2 }),
  height: decimal('height', { precision: 10, scale: 2 }),
  area: decimal('area', { precision: 10, scale: 2 }),
  displayOrder: integer('display_order'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const budgetObservations = pgTable('budget_observations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), // Referência ao auth.users.id
  title: text('title').notNull(),
  content: text('content').notNull(),
  displayOrder: integer('display_order'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const productCategoriesRelations = relations(productCategories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
  options: many(productOptions),
}));

export const productOptionsRelations = relations(productOptions, ({ one, many }) => ({
  product: one(products, {
    fields: [productOptions.productId],
    references: [products.id],
  }),
  basePrice: many(basePrices),
  userPrices: many(userPrices),
}));

export const basePricesRelations = relations(basePrices, ({ one }) => ({
  productOption: one(productOptions, {
    fields: [basePrices.productOptionId],
    references: [productOptions.id],
  }),
}));

export const budgetsRelations = relations(budgets, ({ many }) => ({
  items: many(budgetItems),
}));

export const budgetItemsRelations = relations(budgetItems, ({ one }) => ({
  budget: one(budgets, {
    fields: [budgetItems.budgetId],
    references: [budgets.id],
  }),
  product: one(products, {
    fields: [budgetItems.productId],
    references: [products.id],
  }),
  productOption: one(productOptions, {
    fields: [budgetItems.productOptionId],
    references: [productOptions.id],
  }),
}));
