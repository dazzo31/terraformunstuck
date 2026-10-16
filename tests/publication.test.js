import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyAsset} from '../scripts/verify-publication.mjs';
const expected=Buffer.from('export const version="0.4.1";');
const response=(body,status=200)=>new Response(body,{status});
test('publication verification accepts only identical bytes',async()=>{
 await verifyAsset('https://example.test/app.js',expected,{fetcher:async()=>response(expected),attempts:1});
 for(const result of [response('<html>fallback</html>'),response('old code'),response(expected,404)]){
  await assert.rejects(verifyAsset('https://example.test/app.js',expected,{fetcher:async()=>result,attempts:1}),/differs/);
 }
});
test('publication verification retries stale assets and network failures',async()=>{
 let calls=0;
 await verifyAsset('https://example.test/app.js',expected,{attempts:3,pause:async()=>{},fetcher:async url=>{
  assert.ok(url.searchParams.has('verify'));calls++;if(calls===1)throw new Error('network');return response(calls===2?'stale':expected);
 }});assert.equal(calls,3);
});
test('publication verification fails after bounded network retries',async()=>{
 let calls=0;await assert.rejects(verifyAsset('https://example.test/app.js',expected,{attempts:2,pause:async()=>{},fetcher:async()=>{calls++;throw new Error('offline');}}),/missing/);assert.equal(calls,2);
});
