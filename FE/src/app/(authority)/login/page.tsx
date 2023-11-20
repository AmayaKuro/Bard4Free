"use client"
import { signIn } from "next-auth/react";
import { useState, useCallback } from 'react'
import Link from 'next/link'

import { TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { motion } from "framer-motion";

import styles from '@/css/authenticate.module.css'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

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
                                <TextField type="text" name="username" placeholder="Username" className={styles.formInput} id="username" onChange={e => setUsername(e.target.value)} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="password">Password:</label>
                                <TextField
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className={styles.formInput}
                                    id="password"
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
                            Doesn't have an account?
                        </p>
                        <p>
                            Register <Link href="/register">here</Link>
                        </p>
                    </div>
                </div>
            </main>
        </motion.div>
    )
}