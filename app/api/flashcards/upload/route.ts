import { checkOrigin, failure, runtime, userId } from '@/lib/flashcard-store';
export async function POST(request: Request) {
  try {
    checkOrigin(request); const user = userId(request);
    if (Number(request.headers.get('content-length')) > 11_000_000) return Response.json({error:'Choose a file under 10 MB.'},{status:413});
    const form = await request.formData(); const file = form.get('file');
    if (!(file instanceof File) || file.size > 10_000_000 || !/\.(pdf|docx|txt|md|csv|tsv|json)$/i.test(file.name)) return Response.json({error:'Use a PDF, DOCX, TXT, Markdown, CSV, TSV, or JSON file under 10 MB.'},{status:400});
    const id = crypto.randomUUID(); await runtime().BUCKET.put(`${user}/${id}`, await file.arrayBuffer(), {httpMetadata:{contentType:'application/octet-stream'}});
    return Response.json({id,name:file.name,size:file.size,createdAt:new Date().toISOString()});
  } catch(e) { return failure(e); }
}
export async function DELETE(request: Request) { try { checkOrigin(request); const user = userId(request); const id = new URL(request.url).searchParams.get('id'); if(!id || !/^[\w-]{1,100}$/.test(id)) return new Response(null,{status:400}); await runtime().BUCKET.delete(`${user}/${id}`); return Response.json({ok:true}); } catch(e) { return failure(e); } }
