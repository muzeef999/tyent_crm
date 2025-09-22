// hooks/useAuth.ts
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  customer?: string;
  designation: string;
  exp: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  return { user, isLoggedIn: !!user };
};
