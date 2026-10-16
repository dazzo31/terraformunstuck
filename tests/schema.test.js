import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import Ajv from 'ajv';
import {lessons,recipes,workflows} from '../dist/assets/js/content.js';
import {exercises} from '../dist/assets/js/exercises.js';
const schema=JSON.parse(await readFile(new URL('../data/content-schema.json',import.meta.url)));
const validate=new Ajv({allErrors:true,strict:false}).compile(schema);
const content={lessons,recipes,workflows,exercises};
test('canonical learning and troubleshooting content satisfies the schema',()=>assert.ok(validate(content),JSON.stringify(validate.errors)));
test('schema rejects missing stop conditions and unexplained command effects',()=>{
 const invalid=structuredClone(content);delete invalid.recipes[0].stop;delete invalid.workflows[0].steps[0].effect;
 assert.equal(validate(invalid),false);assert.ok(validate.errors.some(x=>x.params.missingProperty==='stop'));assert.ok(validate.errors.some(x=>x.params.missingProperty==='effect'));
});
