import AuthForm from "../components/auth/auth-form";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  // Redirect away if NOT auth

  useEffect(() => {
    getSession().then((session) => {
      console.log("session", session);
      if (session) {
        router.replace("/");
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  return <AuthForm />;
}

export default AuthPage;