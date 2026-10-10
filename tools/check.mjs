// SPDX-License-Identifier: Apache-2.0
import {fileURLToPath}from'node:url';import path from'node:path';
export async function check({origin='https://mcp.yqstai.cn',key=process.env.INT_AI_API_KEY,allowLocal=false}={}){
 const url=new URL(origin);if(url.username||url.password||url.search||url.hash||url.pathname!=='/'||(url.protocol!=='https:'&&!(allowLocal&&url.protocol==='http:'&&['127.0.0.1','localhost'].includes(url.hostname))))throw Error('Untrusted connection origin');
 if(!key||/\s/.test(key)||key.length>4096)return {state:'missing_key',guide:'https://mcp.yqstai.cn/setup'};
 const headers={Authorization:`Bearer ${key}`};
 const response=await fetch(new URL('/api/check',url),{method:'POST',headers,redirect:'error',signal:AbortSignal.timeout(15000)});
 const body=await response.json();const states=['ready','insufficient_balance','missing_key','invalid_or_forbidden','unavailable'];
 if(!states.includes(body.state))throw Error('Unexpected authorization response');
 if(!['ready','insufficient_balance'].includes(body.state))return {state:body.state,guide:'https://mcp.yqstai.cn/setup'};
 async function rpc(method,params,id){const resp=await fetch(new URL('/mcp',url),{method:'POST',headers:{...headers,'Content-Type':'application/json',Accept:'application/json, text/event-stream','MCP-Protocol-Version':'2025-06-18'},body:JSON.stringify({jsonrpc:'2.0',id,method,params}),redirect:'error',signal:AbortSignal.timeout(15000)});if(resp.status!==200)throw Error('MCP connection rejected');const value=await resp.json();if(value.error)throw Error('MCP protocol check failed');return value.result;}
 await rpc('initialize',{protocolVersion:'2025-06-18',capabilities:{},clientInfo:{name:'int-ai-install-check',version:'0.1.0'}},1);
 const result=await rpc('tools/list',{},2);const expected=['int_ai_search_models','int_ai_get_model_execution','int_ai_execute_model','int_ai_get_request_result'];const names=result.tools?.map(t=>t.name)??[];if(expected.some(n=>!names.includes(n)))throw Error('Expected tools not discovered');
 return {state:body.state,protocol:'2025-06-18',tools:expected,paidModelCalls:0};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{console.log(JSON.stringify(await check(),null,2));}catch{console.error('Connection check failed. No paid model task was submitted. Check endpoint, network and local credential configuration.');process.exitCode=1;}
}
