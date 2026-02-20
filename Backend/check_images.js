require('dotenv').config();
const { Sequelize } = require('sequelize');

const seq = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
});

async function run() {
    await seq.authenticate();
    const [rows] = await seq.query("SELECT id, name, image FROM Products");
    console.log("=== PRODUCTS TABLE ===");
    rows.forEach(r => {
        console.log(`name: "${r.name}" | image: "${r.image}"`);
    });
    await seq.close();
}
run().catch(e => { console.error(e.message); process.exit(1); });
