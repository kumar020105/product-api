# Express.js Product Inventory API

A simple REST API built with Express.js that manages a product inventory using a local JSON file for storage. No external database required.

## Features

- ✅ GET all products
- ✅ GET in-stock products only (bonus)
- ✅ POST new products with auto-incremented IDs
- ✅ PUT to update existing products
- ✅ DELETE products
- ✅ File-based storage (products.json)
- ✅ Comprehensive error handling
- ✅ Input validation

## Installation

1. **Extract the zip file** to your desired location
2. **Open the folder in VS Code**
3. **Open the terminal** in VS Code (Ctrl + `)
4. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

## Running the Server

In the VS Code terminal, run:

\`\`\`bash
npm start
\`\`\`

The server will start on `http://localhost:3000`

You should see:
\`\`\`
Product API server running on http://localhost:3000
Available endpoints:
  GET    /products
  GET    /products/instock
  POST   /products
  PUT    /products/:id
  DELETE /products/:id
\`\`\`

## API Endpoints

### 1. GET /products
Returns all products in the inventory.

**Request:**
\`\`\`bash
curl http://localhost:3000/products
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "price": 60000,
      "inStock": true
    },
    {
      "id": 2,
      "name": "Mouse",
      "price": 800,
      "inStock": true
    }
  ]
}
\`\`\`

### 2. GET /products/instock
Returns only products that are in stock (bonus endpoint).

**Request:**
\`\`\`bash
curl http://localhost:3000/products/instock
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "price": 60000,
      "inStock": true
    },
    {
      "id": 2,
      "name": "Mouse",
      "price": 800,
      "inStock": true
    }
  ]
}
\`\`\`

### 3. POST /products
Add a new product to the inventory. The ID is auto-incremented.

**Request:**
\`\`\`bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Keyboard",
    "price": 1500,
    "inStock": true
  }'
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Product added successfully",
  "data": {
    "id": 3,
    "name": "Keyboard",
    "price": 1500,
    "inStock": true
  }
}
\`\`\`

### 4. PUT /products/:id
Update an existing product's details.

**Request:**
\`\`\`bash
curl -X PUT http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 55000,
    "inStock": false
  }'
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "name": "Laptop",
    "price": 55000,
    "inStock": false
  }
}
\`\`\`

### 5. DELETE /products/:id
Remove a product from the inventory.

**Request:**
\`\`\`bash
curl -X DELETE http://localhost:3000/products/2
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "id": 2,
    "name": "Mouse",
    "price": 800,
    "inStock": true
  }
}
\`\`\`

## Error Handling

The API handles various error scenarios:

- **Missing required fields:** Returns 400 with validation error
- **Invalid data types:** Returns 400 with type error
- **Non-existent product ID:** Returns 404 with not found error
- **Invalid ID format:** Returns 400 with invalid ID error
- **File system errors:** Returns 500 with error details

### Example Error Response:
\`\`\`json
{
  "success": false,
  "message": "Product with ID 999 not found"
}
\`\`\`

## Testing with Postman or cURL

You can test all endpoints using:
- **Postman** - Import the endpoints and test manually
- **cURL** - Use the examples provided above
- **VS Code REST Client** - Create a `.rest` file with the requests

## File Structure

\`\`\`
express-product-api/
├── app.js              # Main Express server
├── products.json       # Product data storage
├── package.json        # Dependencies
└── README.md          # This file
\`\`\`

## Notes

- All data is stored in `products.json`
- The file is automatically created if it doesn't exist
- IDs are auto-incremented based on the highest existing ID
- All responses include a `success` field for easy error checking
- The API uses standard HTTP status codes (200, 201, 400, 404, 500)

## Troubleshooting

**Port 3000 already in use?**
Edit `app.js` and change `const PORT = 3000;` to another port number.

**Module not found error?**
Make sure you ran `npm install` in the terminal.

**Changes not reflecting?**
Restart the server by pressing Ctrl+C and running `npm start` again.
