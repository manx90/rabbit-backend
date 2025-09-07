# Product Statistics API Documentation

This document describes the comprehensive statistics functionality added to the Product module.

## Overview

The Product Statistics API provides detailed insights into your product catalog, including counts by various criteria, performance metrics, and inventory management data.

## Authentication & Authorization

All statistics endpoints require:

- JWT Authentication (`JwtAuthGuard`)
- Admin or SuperAdmin role (`RolesGuard`)

## Available Endpoints

### 1. Comprehensive Statistics Overview

**GET** `/product/stats/overview`

Returns a complete overview of all product statistics in a single request.

**Response:**

```json
{
  "totalProducts": 150,
  "publishStateStats": {
    "published": 120,
    "draft": 30,
    "total": 150
  },
  "seasonStats": {
    "winter": 45,
    "summer": 35,
    "spring_autumn": 40,
    "all": 30,
    "total": 150
  },
  "flagStats": {
    "featured": 15,
    "trending": 8,
    "new": 25,
    "bestSeller": 12,
    "deleted": 3
  },
  "recentStats": {
    "last7Days": 5,
    "last30Days": 20,
    "last90Days": 45
  },
  "categoryStats": [
    {
      "categoryId": 1,
      "categoryName": "Clothing",
      "count": 80
    }
  ],
  "topSelling": [
    {
      "id": 1,
      "name": "Product Name",
      "sales": 150,
      "totalQuantity": 200
    }
  ],
  "lowStock": [
    {
      "id": 2,
      "name": "Low Stock Product",
      "quantity": 5,
      "season": "winter"
    }
  ],
  "missingImages": 8
}
```

### 2. Total Products Count

**GET** `/product/stats/total`

Returns the total number of products.

**Response:**

```json
{
  "totalProducts": 150
}
```

### 3. Products by Publish State

**GET** `/product/stats/publish-state`

Returns count of products by their publish state.

**Response:**

```json
{
  "published": 120,
  "draft": 30,
  "total": 150
}
```

### 4. Products by Season

**GET** `/product/stats/season`

Returns count of products by season.

**Response:**

```json
{
  "winter": 45,
  "summer": 35,
  "spring_autumn": 40,
  "all": 30,
  "total": 150
}
```

### 5. Products by Special Flags

**GET** `/product/stats/flags`

Returns count of products by special flags (featured, trending, new, etc.).

**Response:**

```json
{
  "featured": 15,
  "trending": 8,
  "new": 25,
  "bestSeller": 12,
  "deleted": 3
}
```

### 6. Recent Products

**GET** `/product/stats/recent/{days}`

Returns count of products created in the last N days.

**Parameters:**

- `days` (number): Number of days to look back

**Example:** `/product/stats/recent/30`

**Response:**

```json
{
  "days": 30,
  "count": 20,
  "message": "20 products created in the last 30 days"
}
```

### 7. Products by Category

**GET** `/product/stats/category`

Returns count of products grouped by category.

**Response:**

```json
[
  {
    "categoryId": 1,
    "categoryName": "Clothing",
    "count": 80
  },
  {
    "categoryId": 2,
    "categoryName": "Accessories",
    "count": 70
  }
]
```

### 8. Products by Subcategory

**GET** `/product/stats/subcategory`

Returns count of products grouped by subcategory with parent category information.

**Response:**

```json
[
  {
    "subCategoryId": 1,
    "subCategoryName": "T-Shirts",
    "categoryName": "Clothing",
    "count": 40
  }
]
```

### 9. Top Selling Products

**GET** `/product/stats/top-selling/{limit?}`

Returns the top selling products by sales count.

**Parameters:**

- `limit` (optional, number): Maximum number of products to return (default: 10)

**Example:** `/product/stats/top-selling/5`

**Response:**

```json
[
  {
    "id": 1,
    "name": "Best Seller Product",
    "sales": 150,
    "totalQuantity": 200
  }
]
```

### 10. Low Stock Products

**GET** `/product/stats/low-stock/{threshold?}`

Returns products with low stock levels.

**Parameters:**

- `threshold` (optional, number): Stock threshold (default: 10)

**Example:** `/product/stats/low-stock/5`

**Response:**

```json
[
  {
    "id": 2,
    "name": "Low Stock Product",
    "quantity": 3,
    "season": "winter"
  }
]
```

### 11. Products Missing Images

**GET** `/product/stats/missing-images`

Returns products that are missing required images.

**Response:**

```json
[
  {
    "id": 3,
    "name": "Product Missing Images",
    "hasCover": false,
    "hasImages": true,
    "hasSizeChart": false,
    "hasMeasure": true
  }
]
```

### 12. Products by Creator

**GET** `/product/stats/creators`

Returns count of products grouped by their creators.

**Response:**

```json
[
  {
    "posterId": "user123",
    "username": "admin",
    "count": 75
  }
]
```

### 13. Scheduled Products

**GET** `/product/stats/scheduled`

Returns products with scheduled publishing dates.

**Response:**

```json
[
  {
    "id": 4,
    "name": "Scheduled Product",
    "datePublished": "2024-02-15T10:00:00.000Z",
    "publishState": "DRAFT"
  }
]
```

### 14. Products by Date Range

**GET** `/product/stats/date-range?startDate={date}&endDate={date}`

Returns count of products created within a specific date range.

**Query Parameters:**

- `startDate` (string): Start date in ISO format
- `endDate` (string): End date in ISO format

**Example:** `/product/stats/date-range?startDate=2024-01-01&endDate=2024-01-31`

**Response:**

```json
{
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.999Z",
  "count": 25,
  "message": "25 products created between 2024-01-01 and 2024-01-31"
}
```

## Usage Examples

### Dashboard Overview

Use the comprehensive overview endpoint to populate a dashboard:

```javascript
const stats = await fetch('/product/stats/overview');
const data = await stats.json();
```

### Inventory Management

Check low stock products:

```javascript
const lowStock = await fetch('/product/stats/low-stock/5');
const products = await lowStock.json();
```

### Performance Analysis

Get top selling products:

```javascript
const topSelling = await fetch('/product/stats/top-selling/10');
const products = await topSelling.json();
```

### Content Management

Find products missing images:

```javascript
const missingImages = await fetch('/product/stats/missing-images');
const products = await missingImages.json();
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK`: Successful request
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Insufficient permissions (not Admin/SuperAdmin)
- `500 Internal Server Error`: Server error

## Performance Considerations

- The comprehensive overview endpoint (`/stats/overview`) performs multiple database queries in parallel for optimal performance
- Individual statistic endpoints are optimized for specific use cases
- All queries use proper indexing and efficient database operations
- Results are cached at the database level where appropriate

## Future Enhancements

Potential future additions:

- Caching layer for frequently accessed statistics
- Real-time statistics updates via WebSocket
- Export functionality for statistics data
- Custom date range filtering for all endpoints
- Product performance analytics over time
