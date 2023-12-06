"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';


export default function AuthenticationLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { data: session } = useSession();
    // Check if user is logged in
    useEffect(() => {
        if (session) {
            router.push('/chats')
        }
    }, [session])

    return (
        <>
            {children}
        </>
    )
}