// SPDX-License-Identifier: Apache-2.0
import {spawn} from 'node:child_process';import{fileURLToPath}from'node:url';import{discover}from'./discover.mjs';
const found=discover();if(!found){console.error('Open V5 and configure an account first. Custom installs may set INT_AI_CLIENT_EXE or INT_CLIENT_DATA.');process.exit(1);}
const exe=fileURLToPath(new URL('./int-ai-v5-proxy.exe',import.meta.url));
const child=spawn(exe,[],{stdio:['pipe','pipe','inherit'],env:{...process.env,INT_CLIENT_DATA:found.root},windowsHide:true});
process.stdin.pipe(child.stdin);child.stdout.pipe(process.stdout);
child.on('error',()=>{console.error('V5 remote bridge unavailable; no automatic legacy fallback.');process.exit(1);});child.on('exit',c=>process.exit(c??1));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>child.kill(signal));
