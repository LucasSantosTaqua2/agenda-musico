// service-worker.js

// Este evento é acionado quando o service worker é instalado.
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalado');
  // Força o novo service worker a se tornar ativo imediatamente.
  self.skipWaiting();
});

// Este evento é acionado quando o service worker é ativado.
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Ativado');
  // Garante que o service worker tome controle da página imediatamente.
  event.waitUntil(self.clients.claim());
});

// Este evento é crucial e lida com o que acontece quando o usuário clica em uma notificação.
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notificação clicada');
  
  // Fecha a notificação.
  event.notification.close();
  
  // Abre a janela do aplicativo ou foca nela se já estiver aberta.
  event.waitUntil(
    clients.openWindow('/')
  );
});
