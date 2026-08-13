-- Manual + preset expense entry (Finance). Free-text label for where the money
-- went, and an optional payment method. Category is already free text (String).
ALTER TABLE "Transaction" ADD COLUMN "description" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "paymentMethod" TEXT;
