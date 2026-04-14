"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  phone?: string;
  addresses: Array<{
    type: "home" | "work" | "other";
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }>;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<boolean>;
  signOut: () => void;
  updateUser: (userData: Partial<User>) => void;
  login: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && data.requiresVerification) {
          toast({
            title: "Verification Required",
            description: "Please verify your account to continue.",
          });
          router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`);
          return false;
        }

        toast({
          title: "Login Failed",
          description: data.error || "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }

      setUser(data.user);
      setToken(data.token);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.name}!`,
      });

      let redirectPath = "/dashboard";
      if (data.user.role === "admin") {
        redirectPath = "/admin";
      } else {
        // Redirect to checkout if cart has items
        try {
          const cartItem = localStorage.getItem("cart");
          if (cartItem) {
            const parsedCart = JSON.parse(cartItem);
            if (Array.isArray(parsedCart) && parsedCart.length > 0) {
              redirectPath = "/checkout";
            }
          }
        } catch (e) {}
      }
      
      router.push(redirectPath);

      return true;
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Registration Failed",
          description: data.error || "Failed to create account",
          variant: "destructive",
        });
        return false;
      }

      if (data.requiresVerification) {
        toast({
          title: "Verification Required",
          description: "A verification code has been sent to your email.",
        });
        router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`);
        return false;
      }

      setUser(data.user);
      setToken(data.token);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Registration Successful",
        description: `Welcome, ${data.user.name}! Your account has been created.`,
      });

      let redirectPath = "/dashboard";
      if (data.user.role === "admin") {
        redirectPath = "/admin";
      } else {
        // Redirect to checkout if cart has items
        try {
          const cartItem = localStorage.getItem("cart");
          if (cartItem) {
            const parsedCart = JSON.parse(cartItem);
            if (Array.isArray(parsedCart) && parsedCart.length > 0) {
              redirectPath = "/checkout";
            }
          }
        } catch (e) {}
      }
      
      router.push(redirectPath);

      return true;
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast({
      title: "Signed Out",
      description: "You have been successfully signed out",
    });

    router.push("/");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const login = (userData: User, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateUser,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
