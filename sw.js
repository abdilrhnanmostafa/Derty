// Service Worker — الدوحة المحمدية (استقبال الإشعارات في الخلفية)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { data = { title: 'الدوحة المحمدية', body: event.data ? event.data.text() : '' }; }
  const title = data.title || 'الدوحة المحمدية';
  const options = {
    body: data.body || '',
    lang: 'ar',
    dir: 'rtl',
    vibrate: [200, 100, 200, 100, 200],
    tag: 'dawha-' + (data.ts || Date.now()),
    renotify: true,
    requireInteraction: false,
    silent: false,
    data: { url: data.url || self.registration.scope }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || self.registration.scope;
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if ('focus' in c) { try { await c.focus(); return; } catch (e) {} }
    }
    if (self.clients.openWindow) await self.clients.openWindow(target);
  })());
});

// معالج fetch مطلوب ليعتبر Chrome التطبيق قابلاً للتثبيت. لا نخزّن شيئاً، فقط صفحة بسيطة عند انقطاع الإنترنت.
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => new Response(
        '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body dir="rtl" style="font-family:sans-serif;text-align:center;padding:48px 20px;background:#0a1a0c;color:#f5e7c4"><h2>لا يوجد اتصال بالإنترنت</h2><p>تحقق من الاتصال ثم أعد فتح التطبيق.</p>',
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      ))
    );
  }
});
