import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';
const source=fs.readFileSync(new URL('../js/public-profile.js',import.meta.url),'utf8');
function browser(initial={},blocked=false){
  const saved=new Map(Object.entries(initial));const documentEvents=new Map();const windowEvents=new Map();const events=[];
  const controls=['style','mode'].map(type=>({dataset:{publicProfileSelect:type},value:'',listeners:new Map(),addEventListener(name,fn){this.listeners.set(name,fn)}}));
  const root={dataset:{},style:{}};
  const context={document:{documentElement:root,querySelectorAll:()=>controls,addEventListener:(name,fn)=>documentEvents.set(name,fn)},window:{dispatchEvent:event=>events.push(event.type),addEventListener:(name,fn)=>windowEvents.set(name,fn)},localStorage:{getItem:key=>{if(blocked)throw Error('denied');return saved.get(key)},setItem:(key,value)=>{if(blocked)throw Error('denied');saved.set(key,value)}},Event:class{constructor(type){this.type=type}}};
  vm.runInNewContext(source,context);documentEvents.get('DOMContentLoaded')();
  return {root,controls,saved,events,windowEvents};
}
test('saved choices initialize both fields and controls before interactions',()=>{
 const b=browser({'buffit-public-design-style':'estet','buffit-public-mode':'dark'});
 assert.equal(b.root.dataset.buffitDesignStyle,'estet');assert.equal(b.root.dataset.buffitMode,'dark');assert.equal(b.controls[1].value,'dark');
});
test('a mode change preserves style and survives a subsequent page',()=>{
 const b=browser({'buffit-public-design-style':'estet'});b.controls[1].value='dark';b.controls[1].listeners.get('change')();
 const next=browser(Object.fromEntries(b.saved));assert.equal(next.root.dataset.buffitDesignStyle,'estet');assert.equal(next.root.dataset.buffitMode,'dark');assert.ok(b.events.includes('buffit:public-profile-change'));
});
test('invalid saved input falls back and denied storage does not block controls',()=>{
 const invalid=browser({'buffit-public-design-style':'legacy','buffit-public-mode':'warm'});assert.equal(invalid.root.dataset.buffitDesignStyle,'logik');assert.equal(invalid.root.dataset.buffitMode,'light');
 const denied=browser({},true);denied.controls[1].value='dark';assert.doesNotThrow(()=>denied.controls[1].listeners.get('change')());assert.equal(denied.root.dataset.buffitMode,'dark');
});
test('a storage change from another tab updates the current page',()=>{
 const b=browser();b.saved.set('buffit-public-mode','dark');b.windowEvents.get('storage')({key:'buffit-public-mode'});assert.equal(b.root.dataset.buffitMode,'dark');
});
