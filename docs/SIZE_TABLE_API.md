# Size Table API Documentation

This document provides a comprehensive guide to working with the Size Table API, including example requests and responses.

## Base URL
```
http://your-api-url/api/size-tables
```

## API Endpoints

### 1. Create a New Size Table
Create a new size table with optional size dimensions.

**Endpoint:** `POST /size-tables`

**Request Body:**
```json
{
  "tableName": "Men's T-Shirt Sizes",
  "dimensions": [
    {
      "sizeName": "Small",
      "fields": [
        {
          "fieldName": "Chest",
          "fieldValue": "36 inches"
        },
        {
          "fieldName": "Length",
          "fieldValue": "27 inches"
        }
      ]
    },
    {
      "sizeName": "Medium",
      "fields": [
        {
          "fieldName": "Chest",
          "fieldValue": "38 inches"
        },
        {
          "fieldName": "Length",
          "fieldValue": "28 inches"
        }
      ]
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "tableName": "Men's T-Shirt Sizes",
  "dimensions": [
    {
      "id": 1,
      "sizeName": "Small",
      "fields": [
        {
          "id": 1,
          "fieldName": "Chest",
          "fieldValue": "36 inches"
        },
        {
          "id": 2,
          "fieldName": "Length",
          "fieldValue": "27 inches"
        }
      ]
    },
    {
      "id": 2,
      "sizeName": "Medium",
      "fields": [
        {
          "id": 3,
          "fieldName": "Chest",
          "fieldValue": "38 inches"
        },
        {
          "id": 4,
          "fieldName": "Length",
          "fieldValue": "28 inches"
        }
      ]
    }
  ]
}
```

### 2. Get All Size Tables
Retrieve a list of all size tables.

**Endpoint:** `GET /size-tables`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "tableName": "Men's T-Shirt Sizes",
    "dimensions": [...]
  },
  {
    "id": 2,
    "tableName": "Women's Dresses",
    "dimensions": [...]
  }
]
```

### 3. Get Size Table by ID
Retrieve a specific size table by its ID.

**Endpoint:** `GET /size-tables/:id`

**Response (200 OK):**
```json
{
  "id": 1,
  "tableName": "Men's T-Shirt Sizes",
  "dimensions": [
    {
      "id": 1,
      "sizeName": "Small",
      "fields": [
        {
          "id": 1,
          "fieldName": "Chest",
          "fieldValue": "36 inches"
        },
        {
          "id": 2,
          "fieldName": "Length",
          "fieldValue": "27 inches"
        }
      ]
    }
  ]
}
```

### 4. Update a Size Table
Update an existing size table.

**Endpoint:** `PUT /size-tables/:id`

**Request Body:**
```json
{
  "tableName": "Updated T-Shirt Sizes"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "tableName": "Updated T-Shirt Sizes",
  "dimensions": [...]
}
```

### 5. Delete a Size Table
Delete a size table by ID.

**Endpoint:** `DELETE /size-tables/:id`

**Response:** `204 No Content`

<!-- ### 6. Add Dimension to Size Table
Add a new size dimension to an existing size table.

**Endpoint:** `POST /size-tables/:id/dimensions`

**Request Body:**
```json
{
  "sizeName": "Large",
  "fields": [
    {
      "fieldName": "Chest",
      "fieldValue": "40 inches"
    },
    {
      "fieldName": "Length",
      "fieldValue": "29 inches"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "sizeName": "Large",
  "fields": [
    {
      "id": 5,
      "fieldName": "Chest",
      "fieldValue": "40 inches"
    },
    {
      "id": 6,
      "fieldName": "Length",
      "fieldValue": "29 inches"
    }
  ]
}
``` -->

## Error Responses

### 404 Not Found
When a size table with the specified ID doesn't exist:
```json
{
  "statusCode": 404,
  "message": "Size table not found",
  "error": "Not Found"
}
```

### 400 Bad Request
When request validation fails:
```json
{
  "statusCode": 400,
  "message": [
    "tableName should not be empty",
    "dimensions.0.sizeName must be a string"
  ],
  "error": "Bad Request"
}
```

## Notes
- All endpoints require authentication
- The API follows RESTful conventions
- All IDs are integers
- Timestamps (createdAt, updatedAt) are included in responses but not shown in examples for brevity
