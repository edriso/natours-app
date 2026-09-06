const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('public/tour.html', 'utf8');
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].find(match => match[1].includes('mapToken'))[1];
const mapElement = {textContent:''};
vm.runInNewContext(script, { document: {querySelector:()=>({content:''}), getElementById:()=>mapElement} });
assert.match(mapElement.textContent, /configure/i);
let maps=0, markers=0;
class Chain {setLngLat(){return this} addTo(){return this} setHTML(){return this} extend(){return this}}
const mapboxgl = {Map:class {constructor(){maps++} fitBounds(){} on(event,fn){fn()} addLayer(){}}, LngLatBounds:Chain, Marker:class extends Chain {constructor(){super();markers++}}, Popup:Chain};
vm.runInNewContext(script, {mapboxgl, document:{querySelector:()=>({content:'pk.offline-test-placeholder'}),createElement:()=>({})}});
assert.equal(maps,1);assert.equal(markers,4);
console.log('PASS blank token fallback and configured map markers');
