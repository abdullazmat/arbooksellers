import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET =
  process.env.JWT_SECRET || "islamic-books-jwt-secret-key-2024-very-secure";

export interface DecodedToken {
  userId: string;
  email: string;
  role: string;
}

export interface AuthResult {
  userId: string;
  email: string;
  role: string;
}

export async function verifyToken(token: string): Promise<DecodedToken | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function generateToken(payload: {
  userId: string;
  email: string;
  role: string;
}): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAuth(request: NextRequest): AuthResult | null {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return null;
    }

    // For API routes, we need to verify the token synchronously
    // Since this is a server-side function, we can use the synchronous version
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
      return null;
    }
  } catch (error) {
    return null;
  }
}
