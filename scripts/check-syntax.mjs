import {readdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
async function visit(dir){for(const ent of await readdir(dir,{withFileTypes:true})){const path=new URL(ent.name+(ent.isDirectory()?'/':''),dir);if(ent.isDirectory())await visit(path);else if(ent.name.endsWith('.js'))execFileSync(process.execPath,['--check',fileURLToPath(path)],{stdio:'inherit'});}}
await visit(new URL('../dist/assets/js/',import.meta.url));
