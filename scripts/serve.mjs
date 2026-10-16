// CI/local development only. The deployed site needs no server runtime.
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json'};
createServer(async(req,res)=>{
 try{
  let path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(path==='/terraformunstuck') {res.writeHead(302,{Location:'/terraformunstuck/'});res.end();return;}
  if(!path.startsWith('/terraformunstuck/')){res.writeHead(404);res.end();return;}
  path=resolve(root,path.slice('/terraformunstuck/'.length)||'index.html');
  if(path!==root&&!path.startsWith(root+sep))throw Error('Invalid path');
  if(!(await stat(path)).isFile())throw Error('Not a file');
  res.writeHead(200,{'Content-Type':types[extname(path)]??'application/octet-stream','Cache-Control':'no-store'});res.end(await readFile(path));
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(Number(process.env.PORT??8080),'127.0.0.1',()=>console.log('Serving http://127.0.0.1:8080/terraformunstuck/'));
