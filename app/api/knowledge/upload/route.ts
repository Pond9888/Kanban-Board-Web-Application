import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateEmbedding, chunkText } from '@/lib/embedding';
const pdfParse = require('pdf-parse');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Extract text from PDF
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;
    
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'No text could be extracted from this PDF.' }, { status: 400 });
    }

    // Chunk text
    const chunks = chunkText(text);
    const fileId = `pdf-${Date.now()}`;
    const fileName = file.name;

    console.log(`Processing ${chunks.length} chunks for ${fileName}...`);

    const records = [];
    // Process chunks and generate embeddings
    for (let i = 0; i < chunks.length; i++) {
      const chunkContent = chunks[i];
      const embedding = await generateEmbedding(chunkContent);
      
      records.push({
        source_type: 'pdf',
        source_id: fileId,
        title: fileName,
        content: chunkContent,
        embedding: embedding
      });
    }

    // Insert into Supabase
    const { error } = await supabase.from('knowledge_base').insert(records);
    
    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    return NextResponse.json({ success: true, message: `Successfully processed ${fileName} into ${chunks.length} chunks.` });
  } catch (error: any) {
    console.error('Error processing upload:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
