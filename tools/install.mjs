// SPDX-License-Identifier: Apache-2.0
// Optional local installer: NEVER accepts, stores, or prints API Keys.
import {readFile,writeFile,mkdir,rename,lstat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {root,validate} from './release.mjs';
export function merge(existing,fragment,remove=false){
 const out=structuredClone(existing);
 for(const namespace of ['mcpServers','servers','context_servers','mcp'])if(fragment[namespace]){
  out[namespace]??={};if(typeof out[namespace]!=='object'||Array.isArray(out[namespace]))throw Error('Unexpected namespace type');
  if(remove)delete out[namespace]['int-ai'];else {if(Object.hasOwn(out[namespace],'int-ai'))throw Error('int-ai already exists; preview and remove or restore owned configuration first');out[namespace]['int-ai']=fragment[namespace]['int-ai'];}
 }
 if(fragment.inputs&&!remove){out.inputs??=[];if(!Array.isArray(out.inputs))throw Error('Unexpected inputs type');if(out.inputs.some(i=>i.id==='int-ai-api-key'))throw Error('Credential prompt conflict');out.inputs.push(...fragment.inputs);}
 if(fragment.inputs&&remove)out.inputs=(out.inputs??[]).filter(i=>i.id!=='int-ai-api-key');
 return out;
}
export async function install({host,target,apply=false,remove=false}){
 const a=validate(JSON.parse(await readFile(path.join(root,'adapters',host,'adapter.json'),'utf8')));
 if(!['cursor','claude-code','vscode','windsurf','cline','roo-code','zed','opencode','gemini-cli'].includes(host))throw Error('Use official native interface or documented merge for this host');
 const dest=path.resolve(target);let prior='{}\n';let existed=false;
 try{if((await lstat(dest)).isSymbolicLink())throw Error('Refuse symlink config');prior=await readFile(dest,'utf8');existed=true;}catch(e){if(e.code!=='ENOENT')throw e;}
 let doc;try{doc=JSON.parse(prior)}catch{throw Error('JSONC or invalid JSON: use official UI/manual merge; no rewrite attempted');}
 if(!doc||Array.isArray(doc)||typeof doc!=='object')throw Error('Configuration must be an object');
 const receipt=dest+'.int-ai-receipt.json';let saved;
 try{saved=JSON.parse(await readFile(receipt,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
 const owned=remove?(saved?.owned??a.config):a.config;
 if(remove){if(!saved||saved.host!==host||saved.removed)throw Error('No active ownership receipt');const ns=Object.keys(owned).find(k=>['mcpServers','servers','context_servers','mcp'].includes(k));if(JSON.stringify(doc[ns]?.['int-ai'])!==JSON.stringify(owned[ns]['int-ai']))throw Error('Owned entry changed; refuse removing user edits');if(owned.inputs){const prompt=doc.inputs?.find(i=>i.id==='int-ai-api-key');if(JSON.stringify(prompt)!==JSON.stringify(owned.inputs[0]))throw Error('Credential prompt changed; refuse removing user edits');}}
 else if(saved&&!saved.removed)throw Error('Already installed; use immutable package rollback/manual preview');
 const result=JSON.stringify(merge(doc,owned,remove),null,2)+'\n';
 // Dry-run output contains only owned entries, not existing private credentials.
 if(!apply)return {mode:'preview',host,target:dest,action:remove?'remove':'merge',owned:a.config,setup:a.setup};
 await mkdir(path.dirname(dest),{recursive:true});const suffix=createHash('sha256').update(prior).digest('hex').slice(0,12);
 const backup=dest+'.int-ai-backup-'+suffix;
 if(existed){try{await writeFile(backup,prior,{flag:'wx',mode:0o600});}catch(e){if(e.code!=='EEXIST')throw e;}}
 const temp=dest+'.int-ai-tmp';await writeFile(temp,result,{flag:'wx',mode:0o600});await rename(temp,dest);
 await writeFile(receipt,JSON.stringify({host,version:a.version,owned,removed:remove,backup:existed?backup:null},null,2)+'\n',{mode:0o600});
 return {mode:'applied',host,target:dest,backup:existed?backup:null,setup:a.setup};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const [, ,host,target,...flags]=process.argv;
 try{if(!target||!host||!/^[a-z0-9-]+$/.test(host))throw Error('Usage: node tools/install.mjs HOST TARGET [--apply] [--remove]');console.log(JSON.stringify(await install({host,target,apply:flags.includes('--apply'),remove:flags.includes('--remove')}),null,2));}catch(e){console.error(e.message);process.exitCode=1;}
}
