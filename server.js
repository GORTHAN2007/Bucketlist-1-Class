const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'db.json');
const data = fs.readFileSync(filePath, 'utf-8');
console.log(JSON.parse(data));