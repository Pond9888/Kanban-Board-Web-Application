import { NextResponse } from 'next/server';
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

    return NextResponse.json({ success: true, text });
  } catch (error: any) {
    console.error('Error extracting text:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error', stack: error.stack }, { status: 500 });
  }
}
