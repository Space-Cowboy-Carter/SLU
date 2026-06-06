const CACHE_NAME = 'slu-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './ALOC.png'
];

// Instalação – armazena arquivos essenciais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // ativa o novo worker imediatamente
});

// Ativação – limpa caches antigos e toma controle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => Promise.all(
      keyList.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

// Interceptação de requisições – serve do cache ou da rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});