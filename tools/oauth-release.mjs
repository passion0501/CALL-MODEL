// SPDX-License-Identifier: Apache-2.0
// Independent OAuth adapter builder. Does not mutate legacy Key/V5 packages.
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath}from'node:url';
import {createHash}from'node:crypto';
import {root}from'./release.mjs';
import {zip}from'./zip.mjs';
export async function oauthAdapters(){const result=[];for(const id of(await readdir(path.join(root,'adapters'))).sort())try{result.push(JSON.parse(await readFile(path.join(root,'adapters',id,'oauth.json'),'utf8')))}catch(e){if(e.code!=='ENOENT')throw e}return result}
export function validateOAuth(a){
 if(!/^[a-z0-9-]+-oauth$/.test(a.module)||!/^\d+\.\d+\.\d+$/.test(a.version)||a.auth!=='oauth-pkce'||a.realClientTested!==false||!a.sources?.length||a.instructions?.length<4)throw Error('Invalid OAuth module');
 const text=typeof a.config==='string'?a.config:JSON.stringify(a.config);
 if(!text.includes('https://mcp.yqstai.cn/mcp')||/Authorization|bearer_token_env_var|INT_AI_API_KEY|client_secret/.test(text))throw Error('OAuth config must use native discovery without static credentials');
 return a;
}
export async function buildOAuth(host){
 const a=validateOAuth((await oauthAdapters()).find(a=>a.host===host)??{});
 // Pin execution instructions to the already immutable shared Skill artifact.
 const execute=await readFile(path.join(root,'skills/int-ai-model-call/SKILL.md'));
 if(createHash('sha256').update(execute).digest('hex')!=='04893874e5f8d4561aa12d2ddc5d33ff169d85eb309152c89317b31b5963ffd6')throw Error('Pinned execution Skill changed: bump module dependencies deliberately');
 const setup=await readFile(path.join(root,'skills/oauth-setup/SKILL.md'));
 const logo=await readFile(path.join(root,'assets/client-logo.png'));
 const files={
  'adapter.json':Buffer.from(JSON.stringify(a,null,2)+'\n'),
  [a.configFile]:Buffer.from(typeof a.config==='string'?a.config:JSON.stringify(a.config,null,2)+'\n'),
  'skills/int-ai-model-call/SKILL.md':execute,'skills/oauth-setup/SKILL.md':setup,
  'assets/client-logo.png':logo,
  'README.md':Buffer.from(`# INT-AI · ${a.name} · OAuth\n\n模块 ${a.module}@${a.version}，执行 Skill 0.1.4，授权 Skill 0.1.2。当前状态：${a.status}。未完成客户端实机验收，不能当作生产安装已成功。\n\n${a.instructions.map((s,i)=>`${i+1}. ${s}`).join('\n')}\n\n[连接与账号说明](https://mcp.yqstai.cn/setup?host=${a.host})。使用现有 INT-AI 账号登录并选择自己的 Key；IDE 不获取原始 Key。手动 Key 包为备用，不发到聊天。仅查询工具列表检查连接，不提交付费测试。\n\n${a.sources.map(s=>`- ${s}`).join('\n')}\n`),
 };
 if(host==='codex'){
  files['.mcp.json']=Buffer.from(JSON.stringify(a.pluginConfig,null,2)+'\n');
  files['.codex-plugin/plugin.json']=Buffer.from(JSON.stringify({name:'int-ai-model-call',version:a.version,description:'INT-AI 模型调用：独立远程 OAuth 连接，不依赖 V5',skills:'./skills/',mcpServers:'./.mcp.json',interface:{displayName:'模型调用（INT-AI）',shortDescription:'按完整模型名调用 INT-AI 模型',composerIcon:'./assets/client-logo.png',logo:'./assets/client-logo.png'},extensions:{'com.openai':{onboardingSkill:'./skills/oauth-setup/SKILL.md'}}},null,2)+'\n');
 }
 if(host==='cursor')files['.cursor-plugin/plugin.json']=Buffer.from(JSON.stringify({name:'int-ai-model-call',version:a.version,description:'INT-AI exact-model tools with native OAuth',skills:'./skills/',mcpServers:'./mcp.json'},null,2)+'\n');
 if(host==='workbuddy'){
  const meta=JSON.parse(await readFile(path.join(root,'adapters/workbuddy/connector-meta.json')));delete meta.auth_mode;meta.version=a.version;
  files['connector-meta.json']=Buffer.from(JSON.stringify(meta,null,2)+'\n');
  files['icon.svg']=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><image width="256" height="256" href="data:image/png;base64,${logo.toString('base64')}"/></svg>\n`);
 }
 if(host==='gemini-cli')files['gemini-extension.json']=Buffer.from(JSON.stringify({name:'int-ai-model-call',version:a.version,mcpServers:a.config.mcpServers},null,2)+'\n');
 if(host==='claude-code')files['.claude-plugin/plugin.json']=Buffer.from(JSON.stringify({name:'int-ai-model-call',version:a.version,description:'INT-AI exact-model tools with native OAuth'},null,2)+'\n');
 for(const n of ['LICENSE','NOTICE'])files[n]=await readFile(path.join(root,n));
 const hashes=Object.fromEntries(Object.entries(files).sort(([a],[b])=>a.localeCompare(b)).map(([n,b])=>[n,createHash('sha256').update(b).digest('hex')]));
 files['release.json']=Buffer.from(JSON.stringify({module:a.module,version:a.version,dependencies:{service:'>=0.2.1 <1.0.0',skill:'0.1.4',oauthSetup:'0.1.2'},files:hashes},null,2)+'\n');
 const output=path.join(root,'dist',a.module,a.version);for(const[n,b]of Object.entries(files)){const dest=path.join(output,n);await mkdir(path.dirname(dest),{recursive:true});try{if(!(await readFile(dest)).equals(b))throw Error('Immutable OAuth module changed; bump only this module version')}catch(e){if(e.code!=='ENOENT')throw e;await writeFile(dest,b,{flag:'wx'})}}
 const archive=zip(files),sha=createHash('sha256').update(archive).digest('hex');const dest=path.join(root,'dist',`${a.module}-${a.version}.zip`);
 try{if(!(await readFile(dest)).equals(archive))throw Error('Immutable OAuth archive changed')}catch(e){if(e.code!=='ENOENT')throw e;await writeFile(dest,archive,{flag:'wx'})}
 await writeFile(dest+'.sha256',sha+'\n');return {module:a.module,version:a.version,sha256:sha,files:hashes};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const target=process.argv[2];if(target==='all'){for(const a of await oauthAdapters())console.log(JSON.stringify(await buildOAuth(a.host)))}else console.log(JSON.stringify(await buildOAuth(target)))}
