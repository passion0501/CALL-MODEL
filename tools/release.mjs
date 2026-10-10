// SPDX-License-Identifier: Apache-2.0
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {zip} from './zip.mjs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export const root=fileURLToPath(new URL('../',import.meta.url));
export async function adapters(){return Promise.all((await readdir(path.join(root,'adapters'))).sort().map(async id=>JSON.parse(await readFile(path.join(root,'adapters',id,'adapter.json'),'utf8'))));}
export function validate(a){
 if(!/^[a-z0-9-]+$/.test(a.id)||!/^\d+\.\d+\.\d+$/.test(a.version))throw Error('Invalid module identity');
 if(a.setup!==`https://mcp.yqstai.cn/setup?host=${a.id}`||!a.sources?.length||!a.instructions?.length||!a.auth||a.realClientTested!==false)throw Error('Missing verified onboarding or inaccurate acceptance status');
 const text=typeof a.config==='string'?a.config:JSON.stringify(a.config);
 if(!text.includes('https://mcp.yqstai.cn/mcp')||!text.includes('INT_AI_API_KEY')&&!text.includes('REPLACE_LOCALLY_WITH_KEY')&&!text.includes('input:int-ai-api-key'))throw Error('Missing credential mechanism');
 return a;
}
export async function build(id){
 const a=validate((await adapters()).find(a=>a.id===id)??{});
 const versions=JSON.parse(await readFile(path.join(root,'skills/version.json'),'utf8'));
 // Only this adapter and the pinned skill contribute to this immutable payload.
 const skill=await readFile(path.join(root,'skills/int-ai-model-call/SKILL.md'),'utf8');
 const files={'adapter.json':JSON.stringify(a,null,2)+'\n','README.md':`# INT-AI · ${a.name}\n\n适配器 ${a.version}；Skill 固定版本 ${versions.version}。官方文档核对及配置检查不等于真实客户端验收。\n\n账号注册：https://api.yqstai.cn/register\n充值：https://api.yqstai.cn/console/topup\n创建 Key：https://api.yqstai.cn/console/token\n模型广场：https://api.yqstai.cn/pricing\n[账号与连接说明](${a.setup})（普通文档，不是 IDE 内嵌界面）\n\n${a.instructions.map((s,i)=>`${i+1}. ${s}`).join('\n')}\n\n只接受用户指定的完整模型名。不匹配则停止并给出模型广场链接，无模糊选型、候选序号或确认状态。模型调用按平台规则计费。\n\n连接检查：在原生 MCP 设置确认连接和工具列表，或安全设置本机 INT_AI_API_KEY 后运行 node tools/check.mjs（Node 20+）；只检查授权与工具发现，不调用模型。没有原生凭据表单的客户端，通过其私有配置或本机环境变量提供 Key；不要发到聊天或写入源码。\n\n官方来源：\n${a.sources.map(s=>`- ${s}`).join('\n')}\n`,'tools/check.mjs':await readFile(path.join(root,'tools/check.mjs'),'utf8'),[a.format==='toml'?'config.toml':'mcp.json']:typeof a.config==='string'?a.config:JSON.stringify(a.config,null,2)+'\n'};
 if(a.skill){files['skills/int-ai-model-call/SKILL.md']=skill;files['skills/setup/SKILL.md']=await readFile(path.join(root,'skills/setup/SKILL.md'),'utf8');}
 if(id==='workbuddy')for(const f of ['connector-meta.json','token-schema.json'])files[f]=await readFile(path.join(root,'adapters',id,f),'utf8');
 if(id==='workbuddy'){
  const meta=JSON.parse(files['connector-meta.json']);meta.version=a.version;files['connector-meta.json']=JSON.stringify(meta,null,2)+'\n';
  files['icon.svg']=await readFile(path.join(root,'assets/icon.svg'),'utf8');
 }
 if(id==='cursor')files['.cursor-plugin/plugin.json']=JSON.stringify({name:'int-ai',version:a.version,description:'INT-AI native model tools',skills:'./skills/',mcpServers:'./mcp.json'},null,2)+'\n';
 if(id==='codex'){
  files['.codex-plugin/plugin.json']=JSON.stringify({name:'int-ai',version:a.version,description:'INT-AI exact-model tools',skills:'./skills/',mcpServers:'./.mcp.json',interface:{displayName:'INT-AI',shortDescription:'按完整模型名调用 INT-AI',composerIcon:'./assets/icon.svg',logo:'./assets/icon.svg'},extensions:{'com.openai':{onboardingSkill:'./skills/setup/SKILL.md'}}},null,2)+'\n';
  files['.mcp.json']=JSON.stringify({mcpServers:{'int-ai':{type:'http',url:'https://mcp.yqstai.cn/mcp',bearer_token_env_var:'INT_AI_API_KEY'}}},null,2)+'\n';
 }
 if(id==='gemini-cli')files['gemini-extension.json']=JSON.stringify({name:'int-ai',version:a.version,mcpServers:a.config.mcpServers},null,2)+'\n';
 if(id==='claude-code')files['.claude-plugin/plugin.json']=JSON.stringify({name:'int-ai',version:a.version,description:'INT-AI native model tools'},null,2)+'\n';
 return emit(id,a.version,files,a.skill?versions.version:null);
}
async function emit(id,version,files,skill){
 for(const f of ['LICENSE','NOTICE'])files[f]=await readFile(path.join(root,f),'utf8');
 files['assets/icon.svg']=await readFile(path.join(root,'assets/icon.svg'),'utf8');
 const checksums=Object.fromEntries(Object.keys(files).sort().map(f=>[f,createHash('sha256').update(files[f]).digest('hex')]));
 const release={module:id,version,dependencies:{service:'>=0.1.1 <1.0.0',skill},files:checksums};
 const output=path.join(root,'dist',id,version);
 let present=false;try{const old=await readFile(path.join(output,'release.json'),'utf8');if(old!==JSON.stringify(release,null,2)+'\n')throw Error('Immutable release differs: bump module version');present=true;}catch(e){if(e.code!=='ENOENT')throw e;}
 if(present){for(const [name,hash]of Object.entries(checksums))if(createHash('sha256').update(await readFile(path.join(output,name))).digest('hex')!==hash)throw Error('Immutable release corrupted');return release;}
 for(const [name,text]of Object.entries(files)){const dest=path.join(output,name);await mkdir(path.dirname(dest),{recursive:true});await writeFile(dest,text,{flag:'wx'});}
 files['release.json']=JSON.stringify(release,null,2)+'\n';await writeFile(path.join(output,'release.json'),files['release.json'],{flag:'wx'});
 const archive=zip(files);const dest=path.join(root,'dist',`${id}-${version}.zip`);await writeFile(dest,archive,{flag:'wx'});await writeFile(dest+'.sha256',createHash('sha256').update(archive).digest('hex')+'\n',{flag:'wx'});return release;
}
export async function buildShared(id){
 const v=JSON.parse(await readFile(path.join(root,'skills/version.json'),'utf8')).version;
 const files={};for(const name of ['setup','int-ai-model-call'])files[`skills/${name}/SKILL.md`]=await readFile(path.join(root,'skills',name,'SKILL.md'),'utf8');
 files['tools/check.mjs']=await readFile(path.join(root,'tools/check.mjs'),'utf8');
 if(id==='portable')for(const f of ['plugin.json','mcp.json','README.md'])files[f]=await readFile(path.join(root,'packages/portable',f),'utf8');
 return emit(id,v,files,v);
}
async function bump(id,version){
 if(!/^[a-z0-9-]+$/.test(id)||!/^\d+\.\d+\.\d+$/.test(version))throw Error('Invalid version');
 const file=path.join(root,'adapters',id,'adapter.json');const a=JSON.parse(await readFile(file,'utf8'));if(version===a.version) return;
 const newer=version.split('.').map(Number),older=a.version.split('.').map(Number);const first=newer.findIndex((n,i)=>n!==older[i]);if(first<0||newer[first]<older[first])throw Error('Version must increase');
 a.version=version;await writeFile(file,JSON.stringify(a,null,2)+'\n');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const cmd=process.argv[2];if(cmd==='bump')await bump(process.argv[3],process.argv[4]);else if(cmd==='all'){for(const a of await adapters())console.log(JSON.stringify(await build(a.id)));for(const id of ['portable','skills'])console.log(JSON.stringify(await buildShared(id)));}else if(['portable','skills'].includes(cmd))console.log(JSON.stringify(await buildShared(cmd)));else console.log(JSON.stringify(await build(cmd)));
}
