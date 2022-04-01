import fetch from 'node-fetch';

const response = await fetch('https://httpbin.org/post', {method: 'POST', body: 'a=1'});
const data = await response.json();

console.log(data);