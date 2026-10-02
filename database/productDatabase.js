const fs = require('fs/promises');
const path = require('path');
const filePath = path.join(__dirname, '../db.json');

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

module.exports = {
    readData,
    writeData
};
