export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ec2-54-206-95-255.ap-southeast-2.compute.amazonaws.com/api";

export const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "https://bard4free.vercel.app";

export const BACKEND_ACCESS_TOKEN_LIFETIME = parseInt(process.env.BACKEND_ACCESS_TOKEN_LIFETIME || "1740");

export const BACKEND_REFRESH_TOKEN_LIFETIME = parseInt(process.env.BACKEND_REFRESH_TOKEN_LIFETIME || "86340");