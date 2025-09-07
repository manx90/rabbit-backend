# Database Fix for 500 Error

## Problem Identified

The 500 error is caused by a missing database column. The error message shows:

```
Unknown column 'product.isManualPublishState' in 'field list'
```

This means the `product` table in your database is missing the `isManualPublishState` column that is defined in your TypeORM entity.

## Root Cause

The database schema is out of sync with your entity definitions. The `product` entity defines the `isManualPublishState` column, but it doesn't exist in the actual database table.

## Solutions

### Option 1: Quick Fix (Recommended for cPanel)

Run this SQL command directly in your cPanel MySQL database:

```sql
ALTER TABLE `product`
ADD COLUMN `isManualPublishState` tinyint(1) NOT NULL DEFAULT 0;
```

**Steps:**

1. Go to your cPanel
2. Open "MySQL Databases" or "phpMyAdmin"
3. Select your database
4. Run the SQL command above
5. Test your API endpoint

### Option 2: Using the Fix Script

If you have access to run Node.js scripts on your cPanel:

1. **Set up environment variables** (create a `.env` file):

   ```env
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=your_username
   MYSQL_PASSWORD=your_password
   MYSQL_DB=your_database_name
   ```

2. **Run the fix script:**
   ```bash
   npm run db:fix
   ```

### Option 3: Using TypeORM Migration

If you have TypeORM CLI access:

1. **Run the migration:**
   ```bash
   npm run typeorm migration:run
   ```

## Verification

After applying the fix, you can verify it worked by:

1. **Check the logs:**

   ```bash
   npm run logs:error
   ```

   (Should show no more database errors)

2. **Test the API endpoint:**

   ```bash
   curl -X GET "http://your-domain.com/product"
   ```

3. **Check the database structure:**
   ```sql
   DESCRIBE `product`;
   ```
   (Should show the `isManualPublishState` column)

## Files Created for This Fix

- `fix-database.sql` - Direct SQL fix
- `scripts/fix-database.js` - Automated fix script
- `src/migrations/1748633000000-AddIsManualPublishStateToProduct.ts` - TypeORM migration

## Prevention

To prevent this issue in the future:

1. **Always run migrations** when deploying schema changes
2. **Use TypeORM synchronize** in development only
3. **Test database schema** before deploying to production
4. **Keep entity definitions in sync** with database schema

## Additional Database Issues

If you encounter other similar errors, check for these common missing columns:

```sql
-- Check if these columns exist in your product table
DESCRIBE `product`;

-- Common missing columns that might cause similar errors:
-- isManualPublishState, datePublished, updatedAt, etc.
```

## Logging System Benefits

The logging system we implemented helped identify this exact issue by:

1. **Capturing the full error** with stack trace
2. **Showing the exact SQL query** that failed
3. **Providing context** about which operation failed
4. **Making debugging** much easier for production issues

## Next Steps

1. **Apply the database fix** using one of the methods above
2. **Test your API endpoints** to ensure they work
3. **Monitor the logs** for any other issues
4. **Consider setting up** proper database migration processes

The 500 error should be resolved once the missing column is added to your database.
