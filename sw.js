const CACHE_NAME = 'slu-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './ALOC.png',
  './icon-192.png',
  './icon-512.png'
];

// Instalação – armazena os arquivos essenciais no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // ativa o novo worker imediatamente
});

// Ativação – limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => Promise.all(
      keyList.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim(); // toma controle das páginas abertas
});

// Interceptação de requisições – serve do cache ou da rede (fallback)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Retorna do cache se existir, senão busca na rede
      return response || fetch(event.request).catch(() => {
        // Opcional: fallback para página offline (se quiser)
        // return caches.match('./index.html');
        return new Response('Offline – conteúdo não disponível', { status: 503 });
      });
    })
  );
});