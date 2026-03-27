-- Add customer_phone column to orders table
-- Phone is collected by Stripe checkout but was not being persisted on orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone text;
