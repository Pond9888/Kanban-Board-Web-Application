import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { records } = body;
    
    if (!records || !Array.isArray(records)) {
      return NextResponse.json({ error: 'Invalid records format' }, { status: 400 });
    }

    // Convert string arrays back to JSON or proper formats if needed
    // Supabase handles JS arrays fine for vector(384)

    // Insert into Supabase
    const { error } = await supabase.from('knowledge_base').insert(records);
    
    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving records:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
