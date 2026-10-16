import {readdir,readFile} from 'node:fs/promises';
import {resolve,relative,sep} from 'node:path';
import {pathToFileURL} from 'node:url';

export async function verifyAsset(url,expected,{fetcher=fetch,attempts=8,delay=5000,pause=ms=>new Promise(r=>setTimeout(r,ms))}={}){
 for(let attempt=0;attempt<attempts;attempt++){
  try{
   const request=new URL(url);request.searchParams.set('verify',`${Date.now()}-${attempt}`);
   const response=await fetcher(request,{cache:'no-store',signal:AbortSignal.timeout(10000)});
   if(response.ok&&Buffer.from(await response.arrayBuffer()).equals(expected))return;
  }catch{/* Retry transient network errors; exhaustion must fail deployment verification. */}
  if(attempt+1<attempts)await pause(delay);
 }
 throw new Error(`Published asset is missing or differs from the deployment: ${url}`);
}
export async function verifyPublication(pageURL,directory='dist'){
 const root=new URL(pageURL);if(!root.pathname.endsWith('/'))root.pathname+='/';
 root.search='';root.hash='';
 const base=resolve(directory),files=[];
 async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const path=resolve(dir,entry.name);if(entry.isDirectory())await walk(path);else if(entry.isFile())files.push(path);}}
 await walk(base);if(!files.length)throw new Error('No deployment files found');
 // Include the directory entry point as well as the explicit index.html asset.
 const jobs=files.map(path=>({path,url:new URL(relative(base,path).split(sep).join('/'),root)}));
 jobs.push({path:resolve(base,'index.html'),url:root});
 const queue=[...jobs];
 await Promise.all(Array.from({length:4},async()=>{while(queue.length){const {path,url}=queue.shift();await verifyAsset(url,await readFile(path));}}));
 console.log(`Verified exact bytes of ${files.length} published assets and the directory entry point.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 if(!process.env.PAGE_URL)throw new Error('PAGE_URL is required');
 await verifyPublication(process.env.PAGE_URL);
}
