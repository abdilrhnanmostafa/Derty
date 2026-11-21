# تفعيل إشعارات الخلفية (مرة واحدة)

الإشعارات في الخلفية تحتاج 3 أشياء على Supabase (غير موجودة في ملفات الواجهة):

1. **الجدول:** شغّل `push-setup.sql` في Supabase ← SQL Editor.
2. **مفاتيح VAPID:** المفتاح العام داخل index.html (`VAPID_PUBLIC_KEY`). إن كان عندك المفتاح الخاص المطابق له فاستخدمه، وإلا ولّد زوجاً جديداً:
   `npx web-push generate-vapid-keys`
   ثم ضع **العام** في index.html مكان `VAPID_PUBLIC_KEY` (سيعيد التطبيق الاشتراك تلقائياً عند الفتح التالي).
3. **الدالة:** انسخ `send-push-index.ts` إلى `supabase/functions/send-push/index.ts` ثم:
   ```
   supabase secrets set VAPID_PUBLIC_KEY=... VAPID_PRIVATE_KEY=... VAPID_SUBJECT=mailto:you@example.com
   supabase functions deploy send-push
   ```

على الأندرويد: افتح التطبيق من Chrome (https) واضغط «تفعيل» عند السؤال.
على الآيفون: يجب «إضافة إلى الشاشة الرئيسية» (iOS 16.4+) ثم فتح التطبيق من الأيقونة وتفعيل الإشعارات.
ارفع مع index.html الملفات: sw.js و manifest.json و icon-192.png و icon-512.png.
