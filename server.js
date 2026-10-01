const fs = require('fs/promises');
const express = require('express');
const app = express();
app.use(express.json());
const path = require('path');
const { throwDeprecation } = require('process');
const filePath = path.join(__dirname, 'db.json');

const cache = {};
async function readData() {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function writeData(data) {
    try{
        await fs.writeFile(filePath, JSON.stringify(data,null,2), "utf-8");
    }catch(err){
        console.log(err);
    };  
};

function clearCache() {
    for (const key in cache) {
        delete cache[key];
    };
};

app.get("/products", async (req, res) => {
    try {
        const key = req.url;
        if (cache[key]) {
            return res.json(cache[key]);
        }
        const data = await readData();
        cache[key] = data;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error reading file" });
    }
});

app.get("/products/:id", async (req, res) => {
    try {
        const key = req.url;
        if (cache[key]) {
            return res.json(cache[key]);
        }
        const data = await readData();
        const productId = Number(req.params.id);
        const product = data.find((p) => p.id === productId);
        if (!product) {
            return res.status(404).json({
                error: "Product not found"
            });
        }
        cache[key] = product;
        res.json(product);
    } catch (err) {
        res.status(500).json({
            error: "Error reading file"
        });
    }
});

app.post("/products", async (req,res)=> {
    try{
        const {name,price} = req.body;
        const data = await readData();
        const newData = {
            id: data.length + 1,
            name,
            price: Number(price)
        };
        data.push(newData);
        await writeData(data);
        clearCache();

        return res.status(201).json(newData);

    }catch(err){
        return res.status(500).json({error: "Failed to create a new product"});

    };
});

app.put("/products/:id", async (req,res)=>{
    try{
        const productId = Number(req.params.id);
        const {name,price} = req.body;

        if(!name || price === undefined){
            return res.status(400).json({error: "Name and price required. Please provide them."});
        };
        
        const data = await readData();
        const idx = data.findIndex((p)=> p.id === productId);
        if(idx===-1){
            return res.status(404).json({error : "Product not Found!"});
        };
        data[idx] = {
            id : productId,
            name,
            price: Number(price)
        };
        await writeData(data);
        clearCache();
        
        return res.json(data[idx]);
    }catch(err){
        return res.status(500).json({error : "Failed to update product"});
    };
});

app.patch("/products/:id", async (req, res) => {
    try {
        const productId = Number(req.params.id);
        const { name, price } = req.body;

        const data = await readData();
        const index = data.findIndex(p => p.id === productId);
        if (index === -1) {
            return res.status(404).json({ error: "Product not found" });
        };
        if(name !== undefined){
            data[index].name = name;
        };
        if(price !== undefined){
            data[index].price = Number(price);
        };


        await writeData(data);
        clearCache();
        return res.json(data[index]);
    } catch (err) {
        return res.status(500).json({ error: "Failed to update product" });
    }
});

app.delete("/products/:id", async (req, res) => {
    try {
        const productId = Number(req.params.id);
        const data = await readData();
        const index = data.findIndex(p => p.id === productId);

        if (index === -1) {
            return res.status(404).json({ error: "Product not found" });
        };

        const deletedProduct = data.splice(index, 1)[0];
        await writeData(data);
        clearCache();
        return res.json({ message: "Product deleted successfully", product: deletedProduct });
    } catch (err) {
        return res.status(500).json({ error: "Failed to delete product" });
    }
});


app.listen(3000, ()=>{
    console.log("Server running on port 3000");
});