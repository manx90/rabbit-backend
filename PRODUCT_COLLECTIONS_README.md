# Product Collections Feature

This feature allows admins to create custom product collections that control what products are shown to clients. It provides flexible ways to organize and display products based on categories, subcategories, or specific product selections.

## Features

### 1. Collection Types

- **Category-based**: Show all products from selected categories
- **Product-based**: Show only specific selected products
- **Mixed**: Combine categories, subcategories, and specific products

### 2. Collection Management

- Create, update, and delete collections
- Set collection status (draft, active, inactive)
- Mark collections as featured
- Set display priority (control which collections show first)
- Mark collections as priority for special display
- Set validity dates for time-limited collections
- Configure sorting and filtering options

### 3. Advanced Settings (All Optional)

- Maximum number of products to show
- Show/hide out-of-stock products
- Custom sorting (by price, date, etc.)
- Include subcategories automatically
- Add metadata (tags, season, discount info)
- Auto-generated collection names based on content

## API Endpoints

### Admin Endpoints (Protected)

#### Create Collection (Simplified)

```http
POST /collections
Authorization: Bearer <token>
Content-Type: application/json

# Minimal example - just select categories
{
  "categoryIds": [1, 2]
  // Auto-generates: "Men's Clothing & Women's Clothing Collections"
}

# With description
{
  "description": "Summer sale products",
  "categoryIds": [1]
  // Auto-generates: "Men's Clothing Collection"
}

# With custom name
{
  "name": "Summer Sale 2024",
  "categoryIds": [1, 2],
  "subCategoryIds": [3, 4]
}

# Advanced example (all fields optional)
{
  "name": "Summer Collection with Discount",
  "description": "Best summer products with special discounts",
  "type": "mixed",
  "status": "active",
  "isFeatured": true,
  "displayPriority": 10,
  "isPriority": true,
  "categoryIds": [1, 2],
  "subCategoryIds": [3, 4],
  "productIds": [10, 11, 12],
  "settings": {
    "maxProducts": 50,
    "showOutOfStock": false,
    "sortBy": "createdAt",
    "sortOrder": "DESC"
  },
  "metadata": {
    "tags": ["summer", "discount"],
    "season": "summer",
    "discount": 20,
    "validFrom": "2024-06-01",
    "validTo": "2024-08-31"
  }
}
```

#### Get All Collections (Admin)

```http
GET /collections/admin?page=1&limit=10&status=active
Authorization: Bearer <token>
```

#### Update Collection

```http
PUT /collections/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Summer Collection",
  "status": "active",
  "productIds": [10, 11, 12, 13]
}
```

#### Delete Collection

```http
DELETE /collections/:id
Authorization: Bearer <token>
```

### Client Endpoints (Public)

#### Get Active Collections

```http
GET /collections
```

#### Get Priority Collections

```http
GET /collections/priority
```

#### Get Collections by Priority Range

```http
GET /collections/priority/5        # Collections with priority >= 5
GET /collections/priority/5/10     # Collections with priority between 5 and 10
GET /collections/priority-range?minPriority=5&maxPriority=10  # Using query parameters
```

#### Get Products from Collection

```http
GET /collections/:id/products?page=1&limit=20
```

#### Get Collection with Products (Paginated)

```http
GET /collections/:id/with-products?page=1&limit=10
```

#### Get Featured Collection Products

```http
GET /collections/featured/products?page=1&limit=20
```

## Usage Examples

### Example 1: Summer Sale Collection (High Priority)

```json
{
  "name": "Summer Sale 2024",
  "description": "Amazing summer deals with up to 50% off",
  "type": "category_based",
  "status": "active",
  "isFeatured": true,
  "displayPriority": 10,
  "isPriority": true,
  "categoryIds": [1, 2, 3],
  "settings": {
    "maxProducts": 100,
    "showOutOfStock": false,
    "sortBy": "sales",
    "sortOrder": "DESC"
  },
  "metadata": {
    "tags": ["summer", "sale", "discount"],
    "season": "summer",
    "discount": 50,
    "validFrom": "2024-06-01",
    "validTo": "2024-08-31"
  }
}
```

### Example 2: Best Sellers Collection (Medium Priority)

```json
{
  "name": "Best Sellers",
  "description": "Our most popular products",
  "type": "product_based",
  "status": "active",
  "isFeatured": true,
  "displayPriority": 5,
  "isPriority": false,
  "productIds": [1, 5, 10, 15, 20],
  "settings": {
    "maxProducts": 20,
    "sortBy": "sales",
    "sortOrder": "DESC"
  },
  "metadata": {
    "tags": ["bestsellers", "popular"]
  }
}
```

### Example 3: New Arrivals Collection (Low Priority)

```json
{
  "name": "New Arrivals",
  "description": "Fresh products just arrived",
  "type": "mixed",
  "status": "active",
  "displayPriority": 1,
  "isPriority": false,
  "categoryIds": [1],
  "subCategoryIds": [2, 3],
  "productIds": [25, 26],
  "settings": {
    "maxProducts": 30,
    "sortBy": "createdAt",
    "sortOrder": "DESC",
    "includeSubcategories": true
  },
  "metadata": {
    "tags": ["new", "arrivals", "fresh"]
  }
}
```

### Example 4: Minimal Collection (Just Categories)

```json
{
  "categoryIds": [1]
  // Auto-generates: "Men's Clothing Collection"
  // Defaults: type="mixed", status="active"
}
```

### Example 5: Minimal Collection (Just Subcategories)

```json
{
  "subCategoryIds": [5]
  // Auto-generates: "T-Shirts Collection"
  // Defaults: type="mixed", status="active"
}
```

### Example 6: Minimal Collection (Mixed Items)

```json
{
  "categoryIds": [1, 2],
  "subCategoryIds": [5],
  "productIds": [10, 15]
  // Auto-generates: "Men's Clothing & Women's Clothing + T-Shirts + Premium T-Shirt & Designer Jeans Collection"
  // Defaults: type="mixed", status="active"
}
```

## Priority System

### Display Priority

- **Higher numbers = Higher priority** (e.g., priority 10 shows before priority 5)
- Collections are ordered by: `displayPriority DESC` → `isPriority DESC` → `sortOrder ASC` → `createdAt DESC`
- Use priority numbers like 1, 5, 10, 100 for easy management

### Priority Flag

- `isPriority: true` - Marks collection for special display treatment
- Can be used to highlight important collections in the frontend
- Works together with `displayPriority` for fine-grained control

### Priority Examples

- **Priority 10 + isPriority: true** - Top banner/hero section
- **Priority 5 + isPriority: false** - Main content area
- **Priority 1 + isPriority: false** - Sidebar or footer

## Database Migration

Run the migrations to create the necessary tables:

```bash
# Create the main collection tables
# src/migrations/1748630659235-CreateProductCollection.ts

# Add priority fields
# src/migrations/1748630659236-AddPriorityToProductCollection.ts
```

## Benefits

1. **Flexible Product Display**: Control exactly what products clients see
2. **Seasonal Campaigns**: Create time-limited collections for sales and promotions
3. **Featured Products**: Highlight specific products or categories
4. **Performance Optimization**: Limit the number of products shown
5. **Easy Management**: Simple admin interface to manage collections
6. **SEO Friendly**: Create targeted product pages for better search rankings

## Simple API - Minimal Required Fields

**Only one field is required**: `categoryIds`, `subCategoryIds`, or `productIds` (or any combination)

### Default Values

- `type`: `"mixed"`
- `status`: `"active"`
- `name`: Auto-generated based on content
- All other fields are optional

### Product Limits

- **Maximum 10 products** per collection when using `productIds`
- **Pagination**: 10 products per page by default
- **Auto-show all products** from categories/subcategories if no specific products selected
- **Product Count**: Shows total number of products in each collection
- **Sample Products**: Shows first 3-5 products as preview in collection response

## Auto-Generated Names

When you don't provide a collection name, the system automatically generates one based on the content:

### Single Item Collections

- **Single Category**: "Men's Clothing Collection"
- **Single Subcategory**: "T-Shirts Collection"
- **Single Product**: "Premium Cotton T-Shirt Collection"

### Multiple Items Collections

- **Multiple Categories**: "Men's Clothing & Women's Clothing Collections"
- **Multiple Subcategories**: "T-Shirts & Jeans Collections"
- **Multiple Products**: "Premium T-Shirt & Designer Jeans Collection"

### Mixed Collections

- **Mixed Content**: "2 Categories + 3 Subcategories + 5 Products Collection"

## Product Display Logic

### Smart Product Inclusion

The system automatically includes products based on your collection setup:

1. **If you add specific products**: Shows only those products
2. **If you add categories only**: Shows ALL products from those categories
3. **If you add subcategories only**: Shows ALL products from those subcategories
4. **If you add both**: Shows ALL products from categories + subcategories

### Collection Response Includes

Every collection response now includes:

- **Product Count**: Total number of products in the collection
- **Sample Products**: First 3-5 products as preview
- **Full Product List**: Available via `/collections/:id/products` endpoint

### Example Response

```json
{
  "id": 1,
  "name": "Men's Clothing Collection",
  "description": "Best men's clothing items",
  "type": "mixed",
  "status": "active",
  "productCount": 25,
  "sampleProducts": [
    {
      "id": 1,
      "name": "Premium Cotton T-Shirt",
      "description": "High quality cotton t-shirt",
      "images": ["/uploads/products/tshirt1.jpg"],
      "imgCover": "/uploads/products/tshirt1-cover.jpg",
      "quantity": 50,
      "sizeDetails": [
        { "size": "S", "price": 29.99, "quantity": 10 },
        { "size": "M", "price": 29.99, "quantity": 15 }
      ],
      "colors": [
        { "name": "White", "imgColor": "/uploads/colors/white.jpg" }
      ],
      "category": { "id": 1, "name": "Men's Clothing" },
      "subCategory": { "id": 5, "name": "T-Shirts" }
    },
    {
      "id": 2,
      "name": "Designer Jeans",
      "description": "Premium designer jeans",
      "images": ["/uploads/products/jeans1.jpg"],
      "imgCover": "/uploads/products/jeans1-cover.jpg",
      "quantity": 30,
      "sizeDetails": [
        { "size": "32", "price": 89.99, "quantity": 8 },
        { "size": "34", "price": 89.99, "quantity": 12 }
      ],
      "colors": [
        { "name": "Blue", "imgColor": "/uploads/colors/blue.jpg" }
      ],
      "category": { "id": 1, "name": "Men's Clothing" },
      "subCategory": { "id": 6, "name": "Jeans" }
    }
  ],
  "categories": [...],
  "subCategories": [...]
}
```

## Implementation Notes

- Collections with status "active" are visible to clients
- Collections respect validity dates if set
- Featured collections can be highlighted on the frontend
- The system automatically handles URL transformations for product images
- Collections support pagination and filtering like regular product APIs
- All admin operations require proper authentication and authorization
- Collection names are auto-generated when not provided
