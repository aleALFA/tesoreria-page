if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,c)=>{const f=e||("document"in self?document.currentScript.src:"")||location.href;if(i[f])return;let o={};const d=e=>n(e,f),s={module:{uri:f},exports:o,require:d};i[f]=Promise.all(r.map((e=>s[e]||d(e)))).then((e=>(c(...e),o)))}}define(["./workbox-3625d7b0"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"android-chrome-192x192.png",revision:"7c70f614d4ac77ed7b33e31b350d74f3"},{url:"android-chrome-512x512.png",revision:"b06f19d849b308282265f29ce9a842c2"},{url:"apple-touch-icon.png",revision:"53f2d6e06663d5bf6c06dc9e85afdb3f"},{url:"assets/index-588f96ce.js",revision:null},{url:"assets/index-87e20e46.css",revision:null},{url:"favicon-16x16.png",revision:"1b17b8270d7a4c78cee99fee539c5beb"},{url:"favicon-32x32.png",revision:"a47de9f1ad34c2eb190893f65fc1ca85"},{url:"favicon.ico",revision:"c45adb58e788021d14081194a6ac6487"},{url:"index.html",revision:"ffe5f9b9f1e0299b98f55107d079fe49"},{url:"mstile-150x150.png",revision:"fcfdff9ead9651542b17aecda2d08b52"},{url:"registerSW.js",revision:"3ffa73d93bb40726e099691336523fa0"},{url:"vite.svg",revision:"8e3a10e157f75ada21ab742c022d5430"},{url:"favicon.ico",revision:"c45adb58e788021d14081194a6ac6487"},{url:"favicon-16x16.png",revision:"1b17b8270d7a4c78cee99fee539c5beb"},{url:"android-chrome-192x192.png",revision:"7c70f614d4ac77ed7b33e31b350d74f3"},{url:"android-chrome-512x512.png",revision:"b06f19d849b308282265f29ce9a842c2"},{url:"favicon-32x32.png",revision:"a47de9f1ad34c2eb190893f65fc1ca85"},{url:"manifest.webmanifest",revision:"fd63843fe4e8c5fde66a449ef19a64df"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
