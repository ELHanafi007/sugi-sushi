import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('productId') as string;

    if (!file || !productId) {
      return NextResponse.json({ success: false, error: 'Missing file or product ID' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Storage upload error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return NextResponse.json({ success: true, url: urlData.publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}