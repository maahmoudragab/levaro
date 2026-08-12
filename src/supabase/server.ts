// بنستورد createServerClient من مكتبة Supabase.
// ده اللي بيعمل لنا Supabase Client يشتغل على السيرفر.
import { createServerClient } from "@supabase/ssr";

// cookies بتخلينا نقرأ ونكتب الـ cookies الخاصة بالـ user.
// ودي مهمة جدًا عشان Supabase Auth يحافظ على تسجيل دخول الـ Admin.
import { cookies } from "next/headers";


// دي Function هنستدعيها كل ما نحتاج نتعامل مع Supabase من السيرفر.
export async function createClient() {

  // بنجيب الـ cookies الخاصة بالـ request الحالي.
  // في Next.js الحديثة cookies() بقت async، عشان كده بنستخدم await.
  const cookieStore = await cookies();


  // هنا بننشئ Supabase Client خاص بالسيرفر.
  return createServerClient(

    // رابط مشروع Supabase.
    // موجود في ملف .env.local
    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    // الـ Publishable Key بتاع Supabase.
    // برضه موجود في .env.local
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,

    {
      cookies: {

        // Supabase محتاج يقدر يقرأ الـ cookies.
        // خصوصًا الـ session بتاعة المستخدم اللي عامل Login.
        getAll() {
          return cookieStore.getAll();
        },


        // Supabase ممكن يحتاج يحدث الـ cookies
        // لما الـ session تتغير أو تتجدد.
        setAll(cookiesToSet) {

          try {

            // بنلف على كل Cookie Supabase عايز يحطها
            // ونضيفها للـ response.
            cookiesToSet.forEach(
              ({ name, value, options }) => {

                cookieStore.set(
                  name,
                  value,
                  options
                );

              }
            );

          } catch {
            // أحيانًا Next.js Server Component
            // بيكون غير مسموح له بتعديل الـ cookies مباشرة.
            //
            // في الحالة دي بنسيب الموضوع للـ Proxy
            // اللي هنعمله بعد شوية.
          }
        },
      },
    }
  );
}