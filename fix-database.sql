-- Fix for the 500 error: Add missing isManualPublishState column
-- Run this SQL script directly in your cPanel MySQL database

-- Add the missing column to the product table
ALTER TABLE `product` 
ADD COLUMN `isManualPublishState` tinyint(1) NOT NULL DEFAULT 0;

-- Verify the column was added
DESCRIBE `product`;
