const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');


app.get('/products', (req,res)=>{
    const filePath = path.join(__dirname, 'db.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    res.json(JSON.parse(data));
});

app.listen(3000, ()=>{
    console.log("Server running on port 3000");
});