const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express()
const PORT = 3000
const PRODUCTS_FILE = path.join(__dirname, "products.json")

app.use(express.json())


function readProducts() {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2))
      return []
    }
    const data = fs.readFileSync(PRODUCTS_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading products:", error.message)
    return []
  }
}


function writeProducts(products) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2))
    return true
  } catch (error) {
    console.error("Error writing products:", error.message)
    return false
  }
}


function getNextId(products) {
  if (products.length === 0) return 1
  return Math.max(...products.map((p) => p.id)) + 1
}


app.get("/products", (req, res) => {
  try {
    const products = readProducts()
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving products",
      error: error.message,
    })
  }
})

app.get("/products/instock", (req, res) => {
  try {
    const products = readProducts()
    const inStockProducts = products.filter((p) => p.inStock === true)
    res.status(200).json({
      success: true,
      count: inStockProducts.length,
      data: inStockProducts,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving in-stock products",
      error: error.message,
    })
  }
})

app.post("/products", (req, res) => {
  try {
    const { name, price, inStock } = req.body

    
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      })
    }

    if (price === undefined || price === null || isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required and must be non-negative",
      })
    }

    if (inStock === undefined || typeof inStock !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "inStock must be a boolean value",
      })
    }

    const products = readProducts()
    const newProduct = {
      id: getNextId(products),
      name: name.trim(),
      price: Number.parseFloat(price),
      inStock,
    }

    products.push(newProduct)

    if (writeProducts(products)) {
      res.status(201).json({
        success: true,
        message: "Product added successfully",
        data: newProduct,
      })
    } else {
      res.status(500).json({
        success: false,
        message: "Error saving product to file",
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message,
    })
  }
})

app.put("/products/:id", (req, res) => {
  try {
    const productId = Number.parseInt(req.params.id)

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      })
    }

    const { name, price, inStock } = req.body
    const products = readProducts()
    const productIndex = products.findIndex((p) => p.id === productId)

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${productId} not found`,
      })
    }

    if (name !== undefined) {
      if (name.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Product name cannot be empty",
        })
      }
      products[productIndex].name = name.trim()
    }

    if (price !== undefined) {
      if (isNaN(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid non-negative number",
        })
      }
      products[productIndex].price = Number.parseFloat(price)
    }

    if (inStock !== undefined) {
      if (typeof inStock !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "inStock must be a boolean value",
        })
      }
      products[productIndex].inStock = inStock
    }

    if (writeProducts(products)) {
      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: products[productIndex],
      })
    } else {
      res.status(500).json({
        success: false,
        message: "Error saving updated product",
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    })
  }
})


app.delete("/products/:id", (req, res) => {
  try {
    const productId = Number.parseInt(req.params.id)

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      })
    }

    const products = readProducts()
    const productIndex = products.findIndex((p) => p.id === productId)

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${productId} not found`,
      })
    }

    const deletedProduct = products.splice(productIndex, 1)

    if (writeProducts(products)) {
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: deletedProduct[0],
      })
    } else {
      res.status(500).json({
        success: false,
        message: "Error deleting product",
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    })
  }
})

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err)
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  })
})


app.listen(PORT, () => {
  console.log(`Product API server running on http://localhost:${PORT}`)
  console.log("Available endpoints:")
  console.log("  GET    /products")
  console.log("  GET    /products/instock")
  console.log("  POST   /products")
  console.log("  PUT    /products/:id")
  console.log("  DELETE /products/:id")
})
