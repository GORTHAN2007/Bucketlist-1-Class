const { readData, writeData } = require('../database/productDatabase');

async function getAllProducts() {
    return await readData();
}

async function getProductById(id) {
    const data = await readData();
    const product = data.find((p) => p.id === id);
    return product || null;
}

async function createProduct({ name, price }) {
    const data = await readData();
    const newData = {
        id: data.length + 1,
        name,
        price: Number(price)
    };
    data.push(newData);
    await writeData(data);
    return newData;
}

async function updateProduct(id, { name, price }) {
    const data = await readData();
    const idx = data.findIndex((p) => p.id === id);
    if (idx === -1) {
        return null;
    }
    data[idx] = {
        id,
        name,
        price: Number(price)
    };
    await writeData(data);
    return data[idx];
}

async function patchProduct(id, { name, price }) {
    const data = await readData();
    const index = data.findIndex((p) => p.id === id);
    if (index === -1) {
        return null;
    }
    if (name !== undefined) {
        data[index].name = name;
    }
    if (price !== undefined) {
        data[index].price = Number(price);
    }
    await writeData(data);
    return data[index];
}

async function deleteProduct(id) {
    const data = await readData();
    const index = data.findIndex((p) => p.id === id);
    if (index === -1) {
        return null;
    }
    const deletedProduct = data.splice(index, 1)[0];
    await writeData(data);
    return deletedProduct;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct
};
