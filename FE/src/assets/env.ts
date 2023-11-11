export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000/api";

export const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const BACKEND_ACCESS_TOKEN_LIFETIME = parseInt(process.env.BACKEND_ACCESS_TOKEN_LIFETIME || "1740");

export const BACKEND_REFRESH_TOKEN_LIFETIME = parseInt(process.env.BACKEND_REFRESH_TOKEN_LIFETIME || "86340");