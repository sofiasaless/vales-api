import admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";
import { Role } from "../types/roles.type";

export function authMiddleware(requiredRole?: Role) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = getTokenFromHeaders(req);

      const decoded = await admin.auth().verifyIdToken(token);

      req.user = {
        uid: decoded.uid,
        email: decoded.email,
        role: decoded.role,
      };

      if (verifyRole(decoded.role, requiredRole)) {
        return next()
      } else {
        return res.status(403).json({ message: "Acesso negado." });
      }
    } catch (err: any) {
      return res.status(401).json({ message: err.message });
    }
  };
}

function getTokenFromHeaders(req: Request) {
  const header = req.headers.authorization

  if (!header) throw new Error("Token não identificado")

  const [, token] = header.split(" ");
  return token
}

function verifyRole(tokenRole: Role, requiredRole?: Role): boolean {
  if (!requiredRole) return false;

  if (requiredRole === tokenRole) return true;
  if (requiredRole === 'assistant' && (tokenRole === 'admin' || tokenRole === 'manager')) return true;
  if (requiredRole === 'manager' && tokenRole === 'admin') return true;

  return false;
}