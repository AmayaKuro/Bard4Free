"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import InputBase from '@mui/material/InputBase';
import IconButton from "@mui/material/IconButton";
import SendIcon from '@mui/icons-material/Send';

import { type FetchResponseProps, useConversation } from "@/assets/providers/conversation";
import { useAlert } from "@/assets/providers/alert";

import { BackendFetch } from "@/assets/fetch/BE";

import styles from "@/css/main/chatInput.module.css";


export default function ChatInput() {
    const [message, setMessage] = useState("");
    const isEmpty = useMemo(() => message.trim() === "", [message]);

    const conv = useConversation();
    const { state: { currentResponseProps, createStatus, initMessage }, dispatch: { setResponse, setCreateStatus, setConversationTitles, setInitMessage } } = conv;
    const { dispatch: { setAlertMessage, setSeverity } } = useAlert();
    const sess = useSession();
    const { data: session } = sess;
    const router = useRouter();


    const sendMessage = useCallback(async (callbackMessage?: string) => {
        if ((isEmpty && callbackMessage === "") || !session?.access_token) return;

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
            const fetchResponse = await res.json() as unknown as FetchResponseProps;

            // Add new response and update the create status
            setResponse((prev) => (prev.concat({
                ...fetchResponse,
                message: sendMessage,
            })))

            setCreateStatus(({
                isCreating: false,
                conversation_id: fetchResponse.conversation_id,
                message: sendMessage,
            }));

            // Send the user to the new conversation if it's a new conversation
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

        } catch (e: any) {
            setCreateStatus((prev) => ({
                ...prev,
                isCreating: false,
            }))

            setAlertMessage(e?.message || "Unable to send message");
            setSeverity("error");
        }

    }, [message, sess, conv]);


    // This is used for sending a message when the user choose and head start prompt
    // If initMessage is not empty, send it as a new conversation
    useEffect(() => {
        if (initMessage !== "") {
            // remove the init message after reading
            setInitMessage("");
            sendMessage(initMessage);
        }
    }, [conv]); //this is the culprit


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
                onKeyDown={(e) => {
                    // Send the message if the user press enter
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        // Prevent the user from sending empty message 
                        if (!isEmpty) {
                            sendMessage();
                        }
                    }
                }}
            />
            <IconButton
                className={styles.submitButton}
                onClick={() => sendMessage()}
                disabled={isEmpty || createStatus.isCreating}
            >
                <SendIcon />
            </IconButton>

        </div>

    )
}