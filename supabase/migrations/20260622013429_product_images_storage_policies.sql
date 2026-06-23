
-- Allow public uploads to product-images bucket
CREATE POLICY "storage_insert_product_images" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "storage_select_product_images" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'product-images');

CREATE POLICY "storage_update_product_images" ON storage.objects
  FOR UPDATE TO anon
  USING (bucket_id = 'product-images');
