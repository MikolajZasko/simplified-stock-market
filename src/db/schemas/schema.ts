import { pgTable, serial, integer } from 'drizzle-orm/pg-core';

export const wallet_ownership = pgTable('wallet_ownership', {
    wallet_id: serial('wallet_id').primaryKey(),
    stock_id: integer('stock_id'),
    stock_amount: integer('stock_amount')
});

export const stocks_available = pgTable('stocks_available', {
    stock_id: serial('stock_id').primaryKey(),
    stock_amount: integer('stock_amount')
});