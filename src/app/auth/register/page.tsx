import RegisterForm from "@/components/Auth/RegisterForm";
import Link from "next/link";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md p-4">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 text-center mb-8">
        Kayıt Ol
      </h1>
      <Suspense fallback={<div className="animate-pulse">Yükleniyor...</div>}>
        <RegisterForm />
      </Suspense>
      <p className="mt-4 text-center text-slate-600 dark:text-slate-400">
        Zaten hesabınız var mı?{" "}
        <Link href="/auth/login" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50">
          Giriş Yap
        </Link>
      </p>
    </div>
  );
} 