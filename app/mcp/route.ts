import { checkOrigin, readLibrary, saveLibrary, userId, StoreError } from '@/lib/flashcard-store';
export const dynamic = 'force-dynamic';
const tools = [
 {name:'list_flashcard_sets',description:'List the signed-in user’s private class folders and flashcard sets. Call before choosing a destination.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true}},
 {name:'read_flashcard_set',description:'Read cards in one of the signed-in user’s sets.',inputSchema:{type:'object',properties:{set_id:{type:'string'}},required:['set_id'],additionalProperties:false},annotations:{readOnlyHint:true}},
 {name:'save_flashcards',description:'Save study cards to the signed-in user’s private library. Creates the named class folder and topic set if needed, or appends to the matching set. Existing identical question/answer pairs are skipped. Never infer personal information or invent facts; use the user’s supplied material. Returns the set ID and number added.',inputSchema:{type:'object',properties:{folder_name:{type:'string',description:'Optional class folder name, at most 120 characters'},set_name:{type:'string',description:'Topic set name, at most 120 characters'},cards:{type:'array',minItems:1,maxItems:200,items:{type:'object',properties:{front:{type:'string'},back:{type:'string'}},required:['front','back'],additionalProperties:false}}},required:['set_name','cards'],additionalProperties:false},annotations:{readOnlyHint:false,destructiveHint:false,idempotentHint:true}},
];
export async function POST(request:Request){
 let id:unknown=null;
 try{
  checkOrigin(request);const raw=await request.text();if(raw.length>1_500_000)return new Response('Request too large',{status:413});const message=JSON.parse(raw);id=message.id??null;
  const reply=(result:unknown)=>Response.json({jsonrpc:'2.0',id,result},{headers:{'Cache-Control':'no-store'}});
  if(message.method==='initialize')return reply({protocolVersion:'2025-03-26',capabilities:{tools:{listChanged:false}},serverInfo:{name:'Lillian Zheng Flashcards',version:'1.0.0'},instructions:'Private flashcards saved at https://lillian-zheng.com/flashcards. Use list_flashcard_sets to find destinations; save_flashcards creates folders and sets as needed.'});
  if(message.method?.startsWith('notifications/'))return new Response(null,{status:202});
  if(message.method==='ping')return reply({});
  if(message.method==='tools/list')return reply({tools});
  if(message.method!=='tools/call')return Response.json({jsonrpc:'2.0',id,error:{code:-32601,message:'Method not found'}});
  const user=userId(request);const {name,arguments:a={}}=message.params??{};const state=await readLibrary(user);let result:unknown;
  if(name==='list_flashcard_sets')result={folders:state.library.folders,sets:state.library.sets.map(s=>({id:s.id,name:s.name,folderId:s.folderId,cardCount:s.cards.length}))};
  else if(name==='read_flashcard_set'){const set=state.library.sets.find(s=>s.id===a.set_id);if(!set)throw new StoreError('Set not found.',404);result=set;}
  else if(name==='save_flashcards'){
   if(typeof a.set_name!=='string'||!a.set_name.trim()||a.set_name.length>120||!Array.isArray(a.cards)||!a.cards.length||a.cards.length>200||a.cards.some((c:any)=>typeof c.front!=='string'||typeof c.back!=='string'||!c.front.trim()||!c.back.trim()))throw new StoreError('Provide a set name and 1–200 nonempty front/back cards.');
   let folderId:string|null=null;
   if(a.folder_name!==undefined){if(typeof a.folder_name!=='string'||!a.folder_name.trim()||a.folder_name.length>120)throw new StoreError('Invalid folder name.');let f=state.library.folders.find(f=>f.name.toLowerCase()===a.folder_name.trim().toLowerCase());if(!f){f={id:crypto.randomUUID(),name:a.folder_name.trim()};state.library.folders.push(f);}folderId=f.id;}
   let set=state.library.sets.find(s=>s.folderId===folderId&&s.name.toLowerCase()===a.set_name.trim().toLowerCase());if(!set){set={id:crypto.randomUUID(),name:a.set_name.trim(),folderId,cards:[],updatedAt:new Date().toISOString()};state.library.sets.push(set);}
   let added=0;for(const c of a.cards){const front=c.front.trim(),back=c.back.trim();if(!set.cards.some(x=>x.front===front&&x.back===back)){set.cards.push({id:crypto.randomUUID(),front,back});added++;}}
   set.updatedAt=new Date().toISOString();await saveLibrary(user,state.library,state.revision);result={set_id:set.id,set_name:set.name,added,total:set.cards.length,url:'https://lillian-zheng.com/flashcards'};
  }else return Response.json({jsonrpc:'2.0',id,error:{code:-32602,message:'Unknown tool'}});
  return reply({content:[{type:'text',text:JSON.stringify(result)}],isError:false});
 }catch(e){if(e instanceof StoreError&&(e.status===401||e.status===403))return Response.json({error:e.message},{status:e.status});return Response.json({jsonrpc:'2.0',id,result:{content:[{type:'text',text:e instanceof StoreError?e.message:'Unable to complete this action. Retry after refreshing your library.'}],isError:true}});}
}
export async function GET(){return new Response(null,{status:405,headers:{Allow:'POST'}});}
