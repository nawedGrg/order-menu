
-- Create storage bucket for menu item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true);

-- Allow anyone to upload images to the menu-images bucket
CREATE POLICY "Anyone can upload menu images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'menu-images');

-- Allow anyone to view menu images
CREATE POLICY "Anyone can view menu images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'menu-images');

-- Allow anyone to update menu images
CREATE POLICY "Anyone can update menu images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'menu-images');

-- Allow anyone to delete menu images
CREATE POLICY "Anyone can delete menu images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'menu-images');
