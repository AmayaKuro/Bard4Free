import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";

import { BackendFetch } from "@/assets/fetch/BE";
import { refreshAccessToken, getCurrentEpochTime } from "@/assets/authenticate/token";
import * as env from "@/assets/env";


const handler = NextAuth({
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) throw new Error("Missing username or password")

                try {
                    const res = await BackendFetch("/login", {
                        method: 'POST',
                        body: {
                            username: credentials?.username,
                            password: credentials?.password,
                        },
                    })

                    if (res.status === 401) throw new Error("Username or password is incorrect")

                    else if (!res.ok) throw new Error("Something went wrong")

                    const data = await res.json()

                    // If no error and we have user data, return it
                    if (res.ok && data) {
                        return data
                    }
                } catch (error) {
                    // Catch-all error
                    if (error instanceof Error) throw error

                    else throw new Error("Something went wrong")
                }
            },
        }),
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,

            token: {
                url: `${env.BACKEND_URL}/oauth/google`,
                params: {
                    scopes: ["openid", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"],
                },
                async request(context) {
                    try {
                        const data = await BackendFetch("/oauth/google", {
                            method: "POST",
                            body: {
                                ...context.checks,
                                ...context.params,
                            },
                        })

                        if (!data.ok) throw new Error("Something went wrong")

                        const tokens = await data.json()

                        return tokens
                    }
                    catch (error) {
                        // Catch-all error
                        if (error instanceof Error) throw error

                        else throw new Error("Something went wrong")
                    }
                }
            },
            async profile(profile, tokens) {
                return {
                    "id": profile.sub,
                    ...tokens,
                } as typeof profile
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.name = user.user.name;
                token.access_token = user.access;
                token.refresh_token = user.refresh;
                // Access token has a lifetime of 29 minutes
                token.access_ref = getCurrentEpochTime() + env.BACKEND_ACCESS_TOKEN_LIFETIME;
                return token;
            }

            // Refresh the backend access token if it has expired
            if (getCurrentEpochTime() > (token.access_ref || 0)) {
                try {
                    const response = await refreshAccessToken(token?.refresh_token);

                    token["access_token"] = response.access;
                    token["access_ref"] = getCurrentEpochTime() + env.BACKEND_ACCESS_TOKEN_LIFETIME;
                } catch (error) {
                    // Add error to token so we can display it in the client        
                    token["error"] = "Session expired, please sign in again";
                }
            }

            return token;
        },

        async session({ token, session }) {
            session.access_token = token?.access_token;
            session.expires = new Date(token?.access_ref || (Date.now() / 1000)).toTimeString();
            session.user.name = token?.name;
            return session;
        },

    },

    events: {
        // Sign out from server when user signs out from client 
        async signOut(messages) {
            BackendFetch("/signout", {
                method: "POST",
                body: {
                    refresh: messages.token["refresh_token"],
                },
            }).then((e) => { if (!e.ok) throw new Error() }).catch(() => { console.log("Access key đã già rồi còn đú signout") });
        },
    },

    pages: {
        signIn: "/login",
    },

    session: {
        strategy: 'jwt',
        maxAge: env.BACKEND_REFRESH_TOKEN_LIFETIME,
    },


    // Enable debug messages in the console if you are having problems
    debug: false,
})


export { handler as GET, handler as POST }