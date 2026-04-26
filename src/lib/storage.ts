import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseStorage = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadProductImage(file: File, productId: string): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${productId}-${Date.now()}.${fileExt}`;

  const { data, error } = await supabaseStorage.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  const { data: urlData } = supabaseStorage.storage
    .from('product-images')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function deleteProductImage(imageUrl: string): Promise<boolean> {
  const urlParts = imageUrl.split('/');
  const fileName = urlParts[urlParts.length - 1];

  const { error } = await supabaseStorage.storage
    .from('product-images')
    .remove([fileName]);

  if (error) {
    console.error('Error deleting image:', error);
    return false;
  }

  return true;
}

export function getPublicImageUrl(path: string): string {
  const { data } = supabaseStorage.storage
    .from('product-images')
    .getPublicUrl(path);
  return data.publicUrl;
}