
-- Products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 12.00,
  image_url text NOT NULL DEFAULT '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg',
  category text NOT NULL DEFAULT 'jewelry',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select_public" ON products FOR SELECT
  TO anon USING (active = true);
CREATE POLICY "products_insert_admin" ON products FOR INSERT
  TO anon WITH CHECK (true);
CREATE POLICY "products_update_admin" ON products FOR UPDATE
  TO anon USING (true) WITH CHECK (true);
CREATE POLICY "products_delete_admin" ON products FOR DELETE
  TO anon USING (true);

-- Orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  paypal_transaction_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_insert_public" ON orders FOR INSERT
  TO anon WITH CHECK (true);
CREATE POLICY "orders_select_admin" ON orders FOR SELECT
  TO anon USING (true);
CREATE POLICY "orders_update_admin" ON orders FOR UPDATE
  TO anon USING (true) WITH CHECK (true);
CREATE POLICY "orders_delete_admin" ON orders FOR DELETE
  TO anon USING (true);

-- Order items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  product_name text NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_insert_public" ON order_items FOR INSERT
  TO anon WITH CHECK (true);
CREATE POLICY "order_items_select_admin" ON order_items FOR SELECT
  TO anon USING (true);
CREATE POLICY "order_items_update_admin" ON order_items FOR UPDATE
  TO anon USING (true) WITH CHECK (true);
CREATE POLICY "order_items_delete_admin" ON order_items FOR DELETE
  TO anon USING (true);

-- Seed 15 products
INSERT INTO products (name, description, price, image_url, category) VALUES
  ('Cadena Trenzada Dorada', 'Elegante cadena trenzada en acero inoxidable chapada en oro. Impermeable e hipoalergénica.', 12.00, '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg', 'cadenas'),
  ('Cadena Trenzada Plateada', 'Cadena trenzada de acero inoxidable plateado. Resistente al agua, ideal para uso diario.', 12.00, '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg', 'cadenas'),
  ('Pulsera Elegante Dorada', 'Pulsera de eslabones dorados con cierre de seguridad. Diseño minimalista y atemporal.', 12.00, '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg', 'pulseras'),
  ('Pulsera Elegante Plateada', 'Pulsera de acero inoxidable plateado con acabado brillante. Cómoda y duradera.', 12.00, '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg', 'pulseras'),
  ('Collar Minimalista Dorado', 'Collar fino dorado con dije de estrella. Perfecto para cualquier ocasión especial.', 12.00, '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg', 'collares'),
  ('Collar Minimalista Plateado', 'Collar de plata con diseño delicado. Hipoalergénico y resistente al agua.', 12.00, '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg', 'collares'),
  ('Aretes de Argolla Dorados', 'Aretes de argolla dorados de acero inoxidable. Ligeros y elegantes para el día a día.', 12.00, '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg', 'aretes'),
  ('Aretes de Argolla Plateados', 'Argollas plateadas de alta calidad. Diseño clásico que combina con todo.', 12.00, '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg', 'aretes'),
  ('Anillo Minimalista Dorado', 'Anillo de banda dorada en acero inoxidable. Simple, elegante y sin complicaciones.', 12.00, '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg', 'anillos'),
  ('Anillo Minimalista Plateado', 'Anillo de acero inoxidable plateado. Diseño fino y moderno para cualquier estilo.', 12.00, '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg', 'anillos'),
  ('Set de Pulseras Doradas', 'Conjunto de 3 pulseras doradas de distintos diseños. El regalo perfecto para ella.', 12.00, '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg', 'sets'),
  ('Collar con Dije Corazón', 'Collar dorado con dije de corazón. Símbolo de amor eterno en acero inoxidable.', 12.00, '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg', 'collares'),
  ('Pulsera Trenzada Bicolor', 'Pulsera trenzada en dos tonos: dorado y plateado. Única y llamativa.', 12.00, '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg', 'pulseras'),
  ('Aretes Pendientes Dorados', 'Aretes colgantes dorados con detalle de gota. Elegantes para ocasiones especiales.', 12.00, '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg', 'aretes'),
  ('Set de Joyas Mixto', 'Set completo: collar, pulsera y aretes dorados. El regalo ideal para cualquier celebración.', 12.00, '/images/WhatsApp_Image_2026-06-21_at_9.17.55_PM_(1).jpeg', 'sets');
