const productService = require('../services/productService');
const { clearCache } = require('../middleware/cacheMiddleware');

async function getProducts(req, res) {
    try {
        const data = await productService.getAllProducts();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error reading file" });
    }
}

async function getProductById(req, res) {
    try {
        const productId = Number(req.params.id);
        const product = await productService.getProductById(productId);
        if (!product) {
            return res.status(404).json({
                error: "Product not found"
            });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({
            error: "Error reading file"
        });
    }
}

async function createProduct(req, res) {
    try {
        const { name, price } = req.body;
        const newData = await productService.createProduct({ name, price });
        clearCache();

        return res.status(201).json(newData);
    } catch (err) {
        return res.status(500).json({ error: "Failed to create a new product" });
    }
}

async function updateProduct(req, res) {
    try {
        const productId = Number(req.params.id);
        const { name, price } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({ error: "Name and price required. Please provide them." });
        }

        const updated = await productService.updateProduct(productId, { name, price });
        if (!updated) {
            return res.status(404).json({ error: "Product not Found!" });
        }

        clearCache();
        return res.json(updated);
    } catch (err) {
        return res.status(500).json({ error: "Failed to update product" });
    }
}

async function patchProduct(req, res) {
    try {
        const productId = Number(req.params.id);
        const { name, price } = req.body;

        const updated = await productService.patchProduct(productId, { name, price });
        if (!updated) {
            return res.status(404).json({ error: "Product not found" });
        }

        clearCache();
        return res.json(updated);
    } catch (err) {
        return res.status(500).json({ error: "Failed to update product" });
    }
}

async function deleteProduct(req, res) {
    try {
        const productId = Number(req.params.id);
        const deletedProduct = await productService.deleteProduct(productId);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        clearCache();
        return res.json({ message: "Product deleted successfully", product: deletedProduct });
    } catch (err) {
        return res.status(500).json({ error: "Failed to delete product" });
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct
};
