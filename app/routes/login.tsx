import { useState } from "react";
import { Form, redirect, useNavigation, useActionData, Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Eye, EyeOff, Loader2, Wifi } from "lucide-react";
import { createClient } from "~/lib/server";
import type { Route } from "./+types/login";

export function meta() {
  return [
    { title: "Login — Mahaga FieldOps & Expense Manager" },
    { name: "description", content: "Sign in to manage field operations and expenses" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const { supabase, headers } = createClient(request);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  return redirect("/", { headers });
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createClient(request);
  const { data: { session } } = await supabase.auth.getSession();
  if (session) return redirect("/");
  return null;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Gradient blur blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 border border-white/20">
              <Wifi className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            Mahaga FieldOps
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
            Platform terpusat untuk manajemen operasional lapangan dan pengajuan dana (CARF) teknisi jaringan.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            {[
              { label: "Teknisi Aktif", value: "48+" },
              { label: "Transaksi", value: "1,200+" },
              { label: "Area Coverage", value: "12 Prov" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="rounded-2xl bg-slate-900 p-3">
              <Wifi className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Selamat datang kembali</h2>
              <p className="text-slate-500 mt-1 text-sm">
                Masuk ke akun Anda untuk melanjutkan
              </p>
            </div>

            <Form method="post" className="space-y-5">
              {actionData?.error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {actionData.error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-700 text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@mahaga.com"
                  className="h-11"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700 text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Lupa password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="h-11 pr-11"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-sm font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>
            </Form>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-xs text-center text-slate-400">
                &copy; {new Date().getFullYear()} PT Mahaga Pratama. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
