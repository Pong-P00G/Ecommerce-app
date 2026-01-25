import db from './src/database/dbpool.js';

/**
 * Update product images with real working URLs
 * This script updates the product_images table with valid image URLs
 */

const productImages = {
    1: { // Black T-Shirt
        product_id: 1,
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
        is_main: 1
    },
    2: { // Running Shoes
        product_id: 2,
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        is_main: 1
    },
    3: { // T-Shirt
        product_id: 3,
        image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
        is_main: 1
    }
};

async function updateProductImages() {
    try {
        console.log('🔄 Starting product image update...\n');

        for (const [productId, imageData] of Object.entries(productImages)) {
            const { product_id, image_url, is_main } = imageData;

            // Check if product has existing images
            const [existingImages] = await db.query(
                'SELECT image_id FROM product_images WHERE product_id = ?',
                [product_id]
            );

            if (existingImages.length > 0) {
                // Update existing image
                const imageId = existingImages[0].image_id;
                await db.query(
                    'UPDATE product_images SET image_url = ?, is_main = ? WHERE image_id = ?',
                    [image_url, is_main, imageId]
                );
                console.log(`✅ Updated image for product ID ${product_id} (Image ID: ${imageId})`);
            } else {
                // Insert new image
                const [result] = await db.query(
                    'INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, ?)',
                    [product_id, image_url, is_main]
                );
                console.log(`✅ Added new image for product ID ${product_id} (Image ID: ${result.insertId})`);
            }
        }

        console.log('\n✨ All product images updated successfully!');
        console.log('📸 Image URLs:');
        for (const [productId, imageData] of Object.entries(productImages)) {
            console.log(`   Product ${productId}: ${imageData.image_url}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating product images:', error.message);
        console.error(error);
        process.exit(1);
    }
}

// Run the update
updateProductImages();
