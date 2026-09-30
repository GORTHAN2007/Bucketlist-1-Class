const fs = require('fs/promises');
const express = require('express');
const app = express();
const path = require('path');
const { read } = require('fs');
const filePath = path.join(__dirname, 'db.json');

async function readData() {
    let data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
};



app.get('/products', async (req,res)=>{
    let products = await readData();
    res.json(products);
});

app.listen(3000, ()=>{
    console.log("Server running on port 3000");
});