'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    redirect('/admin/login?error=invalid_credentials')
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // مهم جدًا: يمسح أي كاش لصفحات الأدمن عشان مفيش نسخة قديمة متخزنة
  revalidatePath('/', 'layout')
  redirect('/admin/login')
}