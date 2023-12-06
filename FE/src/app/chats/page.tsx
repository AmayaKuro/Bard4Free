"use client"
import { useSession } from "next-auth/react"
import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation";

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Button from "@mui/material/Button";

import { useConversation } from "@/assets/providers/conversation"
import { CreateResponseLoading } from "@/components/main/CreateResponseLoading"
import Wrapper from "@/components/main/response/Wrapper"

import styles from "@/css/main/home.module.css"




export default function Home() {
    const { state: { createStatus, conversationTitles }, dispatch: { setCurrentResponseProps, setInitMessage } } = useConversation();

    const router = useRouter();

    useEffect(() => {
        setCurrentResponseProps({
            conversation_id: "",
            response_id: "",
            choice_id: "",
        });
    }, []);

    const initMessage = useCallback((message: string | null) => {
        setInitMessage(message || "");
    }, []);


    return (
        <div>
            {(createStatus.isCreating && createStatus.conversation_id === "")
                ? <CreateResponseLoading message={createStatus.message} />
                : (
                    <Wrapper className={styles.wrapper}>
                        <div className={styles.headers}>
                            <h1 className="rainbow_text">Bard4Free</h1>
                            <i>&quot;Welcome to Bard4Free, a web app that helps you generate messages using Palm model of Bard AI&quot;</i>
                        </div>
                        <div className={styles.actionContainer}>
                            <div>
                                <p>Doesn&apos;t know where to start? Try these:</p>
                                <ul>
                                    <li>
                                        <Button onClick={(e) => initMessage(e.currentTarget.textContent)}>Hi, how are you?</Button>
                                    </li>
                                    <li>
                                        <Button onClick={(e) => initMessage(e.currentTarget.textContent)}>What&apos;s the weather like today?</Button>
                                    </li>
                                    <li>
                                        <Button onClick={(e) => initMessage(e.currentTarget.textContent)}>Can you recommend a good restaurant?</Button>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <p>Or continue where you left off:</p>
                                {conversationTitles.slice(0, 3).map((conversationTitle) =>
                                    <Button
                                        key={conversationTitle.conversation_id}
                                        startIcon={<ChatBubbleOutlineIcon />}
                                        onClick={() => router.push(`/chats/${conversationTitle.conversation_id}`)}
                                    >
                                        <span >
                                            {conversationTitle.title}
                                        </span>
                                    </Button>)}
                            </div>
                        </div>

                        <div style={{ width: "100%", fontSize: ".5rem", textAlign: "center", marginBlock: "1rem" }}>
                            DISCLAIMER: This is a disclaimer or watermark.
                        </div>
                    </Wrapper>
                )
            }
        </div >
    )
}
