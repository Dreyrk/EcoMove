"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import LoginForm from "@/components/login/login-form";
import RegisterForm from "@/components/login/register-form";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const router = useRouter();

  const onRegisterSuccess = () => {
    toast.success("Inscription réussie !", { description: "Vous pouvez vous connecter" });
    setMode("login");
  };

  const onLoginSuccess = () => {
    toast.success("Connexion réussie !", { description: "Vous allez être redirigé vers votre dashboard" });

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">EcoMove Challenge</CardTitle>
          <CardDescription>Connexion ou inscription</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue={mode}
            value={mode}
            onValueChange={(value) => setMode(value as "login" | "register")}
            className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onLoginSuccess={onLoginSuccess} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm onRegisterSuccess={onRegisterSuccess} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
