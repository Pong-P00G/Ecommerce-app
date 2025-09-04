import pool  from "../db.js";

// Get all product
export const getAllProduct = async () => {
    const result = await pool.query('SELECT * FROM products');
    return result.rows;
}

export const getAllProductById = async (id) => {
    const result = await pool.query('SELECT * FROM products WHERE productid = $1', [id]);
    return result.rows[0];
}

// Create product 
export const createProduct = async (productData) => {
    const { productname, productsize, productcolor, productprice, productdiscount, productcategory } = productData;

    await pool.query(
        'SELECT INSERT INTO products($1, $2, $3, $4, $5, $6)'
        [productname, productsize, productcolor, productprice, productdiscount, productcategory || 'products']
    );

    const result = await pool.query('SELECT & FROM product WHERE products = $1', [productname]);
    return result.rows[0];
}

export const updateProduct = async (id, productData) => {
    const { productname, productsize, productcolor, productprice, productdiscount, productcategory } = productData;

    const updateQuery = `
        UPDATE products
        SET productname = $1,
            productsize = $2,
            productcolor = $3,
            productprice = $4,
            productdiscount = $5,
            productcategory = $6
        WHERE productid = $7
        RETURNING *;
    `;

    const values = [
        productname,
        productsize,
        productcolor,
        productprice,
        productdiscount,
        productcategory || 'products',
        id
    ];

    const result = await pool.query(updateQuery, values);
    return result.rows[0];
};

// Delete product
export const deleteProduct = async (id) => {
    const result = await pool.query('DELETE FROM products WHERE productid = $1 RETURNING *', [id]);
    return result.rows[0];
}