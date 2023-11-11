"use client";
import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import InputBase from '@mui/material/InputBase';
import IconButton from "@mui/material/IconButton";
import SendIcon from '@mui/icons-material/Send';

import { type FetchResponseProps, useConversation } from "@/assets/providers/conversation";
import { BackendFetch } from "@/assets/fetch/BE";

import styles from "@/css/main/chatInput.module.css";


export default function ChatInput() {
    const { state: { currentResponseProps, createStatus, initMessage }, dispatch: { setResponse, setCreateStatus, setConversationTitles } } = useConversation();
    const [message, setMessage] = useState("");

    const { data: session } = useSession();
    const router = useRouter();


    // If initMessage is not empty, send it as a new conversation
    useEffect(() => {
        if (initMessage !== "") {
            sendMessage(initMessage);
        }
    }, [initMessage]);


    const sendMessage = useCallback(async (callbackMessage?: string) => {
        if ((message === "" && callbackMessage === "") || !session?.access_token) return;

        const sendMessage = callbackMessage || message;

        // Set the creating status to true, the message to the current message
        // and reset the message once the message is sent
        setCreateStatus({
            isCreating: true,
            conversation_id: currentResponseProps.conversation_id,
            message: sendMessage,
        });

        setMessage("");

        try {
            var res
            if (currentResponseProps.conversation_id === "") {
                res = await BackendFetch(`/conversation`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${session?.access_token}`
                    },
                    body: {
                        message: sendMessage,
                    },
                })

                // Remove old response since it's a new conversation
                setResponse([]);
            }
            else {
                res = await BackendFetch("/response", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${session?.access_token}` },
                    body: {
                        message: sendMessage,
                        ...currentResponseProps
                    }
                })
            }

            if (!res.ok) {
                throw new Error(res.statusText);
            }

            // IDK wtf is going on here (actually I does understand some), but it works
            const fetchResponse = res.json() as unknown as FetchResponseProps;

            setResponse((prev) => (prev.concat({
                ...fetchResponse,
                message: sendMessage,
            })))

            setCreateStatus(({
                isCreating: false,
                conversation_id: fetchResponse.conversation_id,
                message: sendMessage,
            }));

            if (currentResponseProps.conversation_id === "") {
                // Add the new conversation to the begin of conversation titles
                setConversationTitles((prev) => [
                    {
                        conversation_id: fetchResponse.conversation_id,
                        title: fetchResponse.title ?? "",
                    },
                    ...prev,
                ]);

                // Push to the new conversation before turn off isCreating
                router.push(`/chats/${fetchResponse.conversation_id}`);
            }

        } catch (e) {
            setCreateStatus((prev) => ({
                // TODO: might want to add a error message here
                ...prev,
                isCreating: false,
            }))
        }
        
    }, [message, session?.access_token, currentResponseProps]);


    return (
        <div className={styles.inputHolder}>
            <InputBase
                value={message}
                placeholder="Type a message"
                multiline
                maxRows={5}
                minRows={2}
                className={styles.textField}
                autoComplete="true"
                onChange={(e) => setMessage(e.currentTarget.value)}
            />
            <IconButton
                children={<SendIcon />}
                className={styles.submitButton}
                onClick={() => sendMessage()}
                disabled={message === "" || createStatus.isCreating}
            />

        </div>

    )
}