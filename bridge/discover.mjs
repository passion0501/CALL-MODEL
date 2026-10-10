// SPDX-License-Identifier: Apache-2.0
import {existsSync,statSync,readdirSync} from 'node:fs';
import {join,dirname,basename,resolve} from 'node:path';
import {homedir} from 'node:os';
export function discover(env=process.env){
 const local=env.LOCALAPPDATA||join(homedir(),'AppData','Local');
 const roots=env.INT_CLIENT_DATA?[env.INT_CLIENT_DATA]:['INTClientV5','INTClient'].map(n=>join(local,n));
 const candidates=[];
 if(env.INT_AI_CLIENT_EXE){const exe=resolve(env.INT_AI_CLIENT_EXE);let dir=dirname(exe);let root;
  if(basename(dir).toLowerCase()==='app')root=dirname(dir);
  for(let p=dir;!root&&dirname(p)!==p;p=dirname(p))if(basename(p).toLowerCase()==='self')root=dirname(p);
  candidates.push({executable:exe,root:env.INT_CLIENT_DATA||root});
 }
 for(const root of env.INT_AI_CLIENT_EXE?[]:roots){candidates.push({executable:join(root,'app','int-client.exe'),root});
  try{const releases=join(root,'self','releases');const copies=readdirSync(releases,{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>({executable:join(releases,e.name,'int-client.exe'),root,modified:statSync(join(releases,e.name)).mtimeMs})).sort((a,b)=>b.modified-a.modified);candidates.push(...copies);}catch{}
 }
 return candidates.find(c=>c.root&&existsSync(c.executable)&&statSync(c.executable).isFile()&&existsSync(join(c.root,'state','codex-capability.profile')));
}
