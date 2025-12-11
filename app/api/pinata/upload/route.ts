import { NextRequest, NextResponse } from 'next/server';
import { PinataSDK } from 'pinata';

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY!,
});

// POST requests for direct uploads
// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get('file') as File;
    
//     if (!file) {
//       return NextResponse.json(
//         { error: 'No file provided' },
//         { status: 400 }
//       );
//     }
    
//     console.log("Uploading file:", file.name, "Size:", file.size, "bytes");
    
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
    
//     const uploadResult = await pinata.upload.public.file(buffer);
    
//     console.log("✅ Upload successful! CID:", uploadResult.cid);
    

//     return NextResponse.json({ 
//       success: true,
//       cid: uploadResult.cid,
//       url: `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${uploadResult.cid}`,
//       size: file.size,
//       timestamp: new Date().toISOString()
//     });
    
//   } catch (error: any) {
//     console.error("❌ Upload error:", error);
//     return NextResponse.json(
//       { 
//         error: 'Upload failed',
//         details: error.message,
//         suggestion: 'Check file size limits and Pinata account status'
//       },
//       { status: 500 }
//     );
//   }
// }

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    console.log("fileName:", fileName);
    
    const url = await pinata.upload.public.createSignedURL({
      expires: 300,
      name: fileName || 'untitled',
    });
    console.log("Generated signed URL:", url);

    return NextResponse.json({ url: url }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create upload URL' },
      { status: 500 }
    );
  }
}