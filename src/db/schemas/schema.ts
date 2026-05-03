import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';

// tables that are created
export const created_wallets = pgTable('created_wallets', {
    wallet_id: serial('wallet_id').primaryKey().notNull()
});

export const stocks_available = pgTable('stocks_available', {
    stock_id: serial('stock_id').primaryKey().notNull(),
    stock_name: varchar("stock_name", { length: 256 }).unique().notNull(),
    stock_amount: integer('stock_amount').notNull().default(0)
});

export const wallet_ownership = pgTable('wallet_ownership', {
    ownership_id: serial('ownership_id').primaryKey().notNull(),
    wallet_id: integer('wallet_id').references(() => created_wallets.wallet_id).notNull(),
    // because of { onDelete: 'cascade' } - if we wipe wallet_ownership table all dependancies are wiped too
    stock_id: integer('stock_id').references(() => stocks_available.stock_id, { onDelete: 'cascade' }).notNull(),
    stock_amount: integer('stock_amount').notNull().default(0)
});

export const audit_log = pgTable('audit_log', {
    log_id: serial('log_id').primaryKey().notNull(),
    transaction_type: varchar('transaction_type', {length: 10}).notNull(),
    wallet_id: integer('wallet_id').references(() => created_wallets.wallet_id).notNull(),
    stock_name: varchar("stock_name", { length: 256 }).references(() => stocks_available.stock_name).notNull(),
})

// types for typescript
export type Wallet = typeof created_wallets.$inferSelect
export type NewWallet = typeof created_wallets.$inferInsert

export type Stock = typeof stocks_available.$inferSelect
export type NewStock = typeof stocks_available.$inferInsert

export type WalletOwnership = typeof wallet_ownership.$inferSelect
export type NewWalletOwnership = typeof wallet_ownership.$inferInsert

export type Log = typeof audit_log.$inferSelect
export type NewLog = typeof audit_log.$inferInsert