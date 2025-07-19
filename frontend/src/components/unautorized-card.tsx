import { AlertCircle, LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

export default function UnautorizedCard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">401 - Non autorisé</CardTitle>
          <CardDescription className="text-gray-600">
            Vous devez être connecter pour avoir accès à cette page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500 text-center">Connecter-vous avec vos identifiants pour continuer</p>
          <Button asChild className="w-full">
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Se connecter
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
