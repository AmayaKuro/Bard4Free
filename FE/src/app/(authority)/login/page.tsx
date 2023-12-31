"use client"
import { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn } from "next-auth/react";

import { TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { motion } from "framer-motion";

import styles from '@/css/authenticate.module.css'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const login = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Prevent empty fields
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        setError('');
        setLoading(true);

        const res = await signIn('credentials', {
            username: username,
            password: password,
            redirect: false,
        });

        // Nextauth doesn't return error, so we thrown catch-all sentence
        if (res?.error) {
            setError(res.error);
            setLoading(false);
        }
        else {
            setLoading(false);
            router.push('/chats')
        }

    }, [username, password])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.title}>
                        <h2>Log in</h2>
                    </div>
                    <form onSubmit={login}>
                        <div className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="username">Username:</label>
                                <TextField type="text" name="username" placeholder="Username" className={styles.formInput} id="username" value={username} onChange={e => setUsername(e.target.value)} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="password">Password:</label>
                                <TextField
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className={styles.formInput}
                                    id="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                            {error !== "" && <div className={styles.formGroup} style={{ color: "#f53e3e" }}>
                                {error}
                            </div>}
                            <LoadingButton
                                className={styles.formGroup}
                                type="submit"
                                loading={loading}
                                disabled={!username || !password}>
                                Log in
                            </LoadingButton>
                        </div>
                    </form>
                    <div className={styles.footer}>
                        <p>
                            Doesn&apos;t have an account?
                        </p>
                        <p>
                            Register <Link href="/register">here</Link>
                        </p>
                    </div>
                    <div className={styles.social}>
                        <hr style={{ minWidth: "80%" }} />
                        <p>
                            Or log in with
                        </p>

                        <Image
                            src="https://authjs.dev/img/providers/google.svg"
                            width={30}
                            height={30}
                            alt="Google"
                            onClick={() => signIn('google', { redirect: false })}
                            className={styles.socialIcon} />
                    </div>
                </div>
            </main>
        </motion.div>
    )
}