import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Acesso Técnico — PrevTI" },
      { name: "description", content: "Área restrita da equipe técnica PrevTI." },
      { property: "og:title", content: "Acesso Técnico — PrevTI" },
      { property: "og:description", content: "Área restrita da equipe técnica PrevTI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(8, "Mínimo de 8 caracteres").max(72),
});

type Mode = "login" | "signup" | "forgot";

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [noAdmin, setNoAdmin] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
    supabase.rpc("admin_exists").then(({ data }) => setNoAdmin(data === false));
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setNotice("");
    if (mode === "forgot") {
      const r = z.string().email().safeParse(email.trim());
      if (!r.success) { toast.error("E-mail inválido"); return; }
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(r.data, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      setNotice("Se o e-mail existir, você receberá um link para redefinir a senha.");
      return;
    }
    const loginEmail = mode === "login" && !email.includes("@") ? `${email.trim().toLowerCase()}@prevti.com.br` : email;
    const parsed = schema.safeParse({ email: loginEmail, password });
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Dados inválidos"); return; }
    setLoading(true);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        ...parsed.data,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      if (!data.session) {
        setNotice("Conta criada! Confirme pelo link enviado ao seu e-mail e depois faça login.");
        setMode("login");
      } else navigate({ to: "/admin" });
      return;
    }
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) { toast.error("E-mail ou senha incorretos."); return; }
    navigate({ to: "/admin" });
  }

  const titles = {
    login: ["Acesso Técnico", "Entre com sua conta da equipe PrevTI."],
    signup: ["Criar conta do administrador", "A primeira conta criada recebe acesso de administrador."],
    forgot: ["Recuperar senha", "Enviaremos um link de redefinição para seu e-mail."],
  }[mode];

  return (
    <div className="grid min-h-screen place-items-center bg-hero px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex justify-center"><Logo light /></Link>
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>{titles[0]}</CardTitle>
            <CardDescription>{titles[1]}</CardDescription>
          </CardHeader>
          <CardContent>
            {notice && <p className="mb-4 rounded-md bg-success/10 p-3 text-sm text-success">{notice}</p>}
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">{mode === "login" ? "Usuário ou e-mail" : "E-mail"}</Label>
                <Input id="email" type={mode === "login" ? "text" : "email"} autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <Label htmlFor="pw">Senha</Label>
                  <div className="relative"><Input id="pw" className="pr-10" type={showPw ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" aria-label={showPw ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPw((s) => !s)} className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground">{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Aguarde..." : mode === "login" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar link"}
              </Button>
            </form>
            <div className="mt-4 flex flex-col gap-2 text-center text-sm">
              {mode === "login" ? (
                <button className="text-primary hover:underline" onClick={() => setMode("forgot")}>Esqueci minha senha</button>
              ) : (
                <button className="text-primary hover:underline" onClick={() => setMode("login")}>Voltar ao login</button>
              )}
              {noAdmin && mode === "login" && (
                <div className="mt-2 rounded-md border border-border bg-muted p-3 text-muted-foreground">
                  Primeiro acesso? Nenhum administrador foi configurado.{" "}
                  <button className="font-medium text-primary hover:underline" onClick={() => setMode("signup")}>Criar conta inicial</button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
