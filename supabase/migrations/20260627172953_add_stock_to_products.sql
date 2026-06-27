-- Add stock column to products
ALTER TABLE products ADD COLUMN stock integer NOT NULL DEFAULT 10;

-- Update each product with a unique Pexels jewelry image and stock
UPDATE products SET image_url = 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=800', stock = 15 WHERE name = 'Cadena Trenzada Dorada';
UPDATE products SET image_url = 'https://images.pexels.com/photos/1616096/pexels-photo-1616096.jpeg?auto=compress&cs=tinysrgb&w=800', stock = 12 WHERE name = 'Cadena Trenzada Plateada';
UPDATE products SET image_url = 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=800', stock = 20 WHERE name = 'Pulsera Elegante Dorada';
UPDATE products SET image_url = 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=800', stock = 18 WHERE name = 'Pulsera Elegante Plateada';
UPDATE products SET image_url = 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800', stock = 10 WHERE name = 'Collar Minimalista Dorado';
UPDATE products SET image_url = 'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=800', stock = 14 WHERE name = 'Collar Minimalista Plateado';
UPDATE products SET image_url = 'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg?auto=compress&cs=tinysrgb&w=800', stock = 25 WHERE name = 'Aretes de Argolla Dorados';
UPDATE products SET image_url = 'https://images.pexels.com/photos/1232459/pexels-photo-1232459.jpeg?auto=compress&cs=tinysrgb&w=800', stock = 22 WHERE name = 'Aretes de Argolla Plateados';
UPDATE products SET image_url = 'https://images.pexels.com/photos/1009925/pexels-photo-1009925.jpeg?auto=compress&cs=tinysrgb&w=800', stock = 30 WHERE name = 'Anillo Minimalista Dorado';
UPDATE products SET image_url = 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=800', stock = 28 WHERE name = 'Anillo Minimalista Plateado';
UPDATE products SET image_url = 'https://images.pexels.com/photos/1458671/pexels-photo-1458671.jpeg?auto=compress&cs=tinysrgb&w=800', stock = 8 WHERE name = 'Set de Pulseras Doradas';
UPDATE products SET image_url = 'https://images.pexels.com/photos/1191536/pexels-photo-1191536.jpeg?auto=compress&cs=tinysrgb&w=800', stock = 16 WHERE name = 'Collar con Dije Corazón';
UPDATE products SET image_url = 'https://images.pexels.com/photos/1372134/pexels-photo-1372134.jpeg?auto=compress&cs=tinysrgb&w=800', stock = 11 WHERE name = 'Pulsera Trenzada Bicolor';
UPDATE products SET image_url = 'https://images.pexels.com/photos/1413417/pexels-photo-1413417.jpeg?auto=compress&cs=tinysrgb&w=800', stock = 19 WHERE name = 'Aretes Pendientes Dorados';
UPDATE products SET image_url = 'https://images.pexels.com/photos/1616097/pexels-photo-1616097.jpeg?auto=compress&cs=tinysrgb&w=800', stock = 6 WHERE name = 'Set de Joyas Mixto';
