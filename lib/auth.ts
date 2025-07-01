import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Temps actuel en secondes
    return decoded.exp > currentTime; // Vérifier si le token n'a pas expiré
  } catch (error) {
    return false;
  }
};