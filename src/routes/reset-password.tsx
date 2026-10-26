import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Redefinir senha — PrevTI" },
      { name: "description", content: "Defina uma nova senha para sua conta PrevTI." },
      { property: "og:title", content: "Redefinir senha — PrevTI" },
      { property: "og:description", content: "Defina uma nova senha para sua conta PrevTI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.location.hash.includes("type=recovery")) setReady(true);
    const { data } = supabase.auth.onAuthStateChange((e) => {
      if (e === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) return toast.error("A senha precisa ter ao menos 8 caracteres.");
    if (pw !== pw2) return toast.error("As senhas não conferem.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Senha atualizada!");
    navigate({ to: "/admin" });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-hero px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo light /></div>
        <Card>
          <CardHeader><CardTitle>Nova senha</CardTitle></CardHeader>
          <CardContent>
            {!ready ? (
              <p className="text-sm text-muted-foreground">Abra esta página pelo link enviado ao seu e-mail.</p>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1.5"><Label>Nova senha</Label><Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
                <div className="space-y-1.5"><Label>Confirmar senha</Label><Input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>
                <Button className="w-full" disabled={loading}>Salvar nova senha</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
