import LoginForm from "@/components/Auth/LoginForm";
import Link from "next/link";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md p-4">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 text-center mb-8">
        Giriş Yap
      </h1>
      <Suspense fallback={<div className="animate-pulse">Yükleniyor...</div>}>
        <LoginForm />
      </Suspense>
      <p className="mt-4 text-center text-slate-600 dark:text-slate-400">
        Hesabınız yok mu?{" "}
        <Link href="/auth/register" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50">
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
} 