# Catalog Service

## Overview
Product catalog, categories, and search. Manages the master product list, retailer-specific catalog entries (Extended Reference Pattern), and category tree (Materialized Path).

## Port
3003

## Tech
- MongoDB (Mongoose) for product data
- Redis for caching popular listings (5min TTL)
- S3 for product images
- RabbitMQ for publishing `catalog.product.updated` events

## Key Schemas
- **Product**: Master product with text index (name:10, description:5, brand:3, tags:2). tariffCode is mandatory 8-digit NCM (RCQ-001).
- **RetailerProduct**: Extended Reference Pattern linking retailer to product with snapshot, price, stock, serviceRegions. Unique compound index on {productId, retailerId}.
- **Category**: Tree Pattern using materialized path (e.g., "FARM_INPUTS.FERTILIZERS.NPK").

## API Endpoints
- `GET /v1/products` - Search/list with filters (category, stateProvince, isRuralCreditEligible, q)
- `GET /v1/products/:id` - Get product detail
- `POST /v1/products` - Create product (RETAILER, requires x-user-id header)
- `PATCH /v1/products/:id` - Update product (RETAILER owner)
- `POST /v1/products/:id/images` - Upload images (multipart)
- `POST /v1/retailers/:id/catalog` - Add product to retailer catalog
- `GET /v1/retailers/:id/catalog` - List retailer catalog
- `PATCH /v1/retailers/:id/catalog/:productId` - Update retailer product entry
- `GET /v1/categories` - List categories
- `POST /v1/categories` - Create category
- `GET /v1/categories/tree` - Get category tree
- `PATCH /v1/categories/:id` - Update category

## Events Published
- `catalog.product.updated` - When name, tariffCode, or category changes

## Commands
```bash
npm run build
npm run start:dev
npm test
```
