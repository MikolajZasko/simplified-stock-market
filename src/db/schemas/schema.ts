import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';

export const created_wallets = pgTable('created_wallets', {
    wallet_id: serial('wallet_id').primaryKey()
});

export const stocks_available = pgTable('stocks_available', {
    stock_id: serial('stock_id').primaryKey(),
    stock_name: varchar("stock_name", { length: 256 }),
    stock_amount: integer('stock_amount')
});

export const wallet_ownership = pgTable('wallet_ownership', {
    ownership_id: serial('wallet_id').primaryKey(),
    wallet_id: integer('wallet_id').references(() => created_wallets.wallet_id),
    stock_id: integer('stock_id').references(() => stocks_available.stock_id),
    stock_amount: integer('stock_amount')
});