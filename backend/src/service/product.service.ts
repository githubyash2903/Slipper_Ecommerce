import pool from '../database/db';
import { AppError } from '../utils/errors';

export async function createProduct(data: any) {
  const {
    name, description, price, wholesalePrice, bulkThreshold, stock,
    category, gender, image, images, sizes, colors, isNew, isSale, salePercent
  } = data;

  const { rows } = await pool.query(
    `INSERT INTO products 
    (name, description, price, wholesale_price, bulk_threshold, stock, category, gender, image_url, images, sizes, colors, is_new, is_sale, sale_percent)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *`,
    [
      name, description, price, wholesalePrice || 0, bulkThreshold || 0, stock,
      category, gender, image, images || [], sizes || [], colors || [],
      isNew || false, isSale || false, salePercent || 0
    ]
  );
  return rows[0];
}

export async function getAllProducts() {
  const { rows } = await pool.query(
    `SELECT * FROM products ORDER BY created_at DESC`
  );
  
  return rows.map(mapToFrontend);
}

export async function getProductById(id: string) {
  const { rows } = await pool.query(`SELECT * FROM products WHERE id = $1`, [id]);
  if (!rows.length) throw new AppError('Product not found', 404);
  return mapToFrontend(rows[0]);
}

export async function updateProduct(id: string, data: any) {
  const fields = [];
  const values = [];
  let index = 1;

  const fieldMap: any = {
    name: 'name', description: 'description', price: 'price', 
    wholesalePrice: 'wholesale_price', bulkThreshold: 'bulk_threshold', stock: 'stock',
    category: 'category', gender: 'gender', image: 'image_url', images: 'images',
    sizes: 'sizes', colors: 'colors', isNew: 'is_new', isSale: 'is_sale', salePercent: 'sale_percent'
  };

  for (const key in data) {
    if (fieldMap[key]) {
      fields.push(`${fieldMap[key]} = $${index}`);
      values.push(data[key]);
      index++;
    }
  }

  if (fields.length === 0) return await getProductById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE products SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${index} RETURNING *`,
    values
  );

  return mapToFrontend(rows[0]);
}

export async function deleteProduct(id: string) {
  const { rowCount } = await pool.query(`DELETE FROM products WHERE id = $1`, [id]);
  if (rowCount === 0) throw new AppError('Product not found', 404);
}

function mapToFrontend(row: any) {
  return {
    ...row,
    wholesalePrice: row.wholesale_price,
    bulkThreshold: row.bulk_threshold,
    image: row.image_url,
    isNew: row.is_new,
    isSale: row.is_sale,
    salePercent: row.sale_percent
  };
}