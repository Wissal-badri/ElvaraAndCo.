require('dotenv').config();
const { Sequelize } = require('sequelize');

const seq = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    logging: false,
});

async function fixImages() {
    try {
        await seq.authenticate();
        const [results, meta] = await seq.query(
            "UPDATE Products SET image = NULL WHERE image IS NOT NULL AND image NOT LIKE 'http%'"
        );
        console.log(`✅ Fixed ${meta.affectedRows} product(s) with invalid image paths.`);
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await seq.close();
    }
}

fixImages();
