"use client"
import { useEffect, useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'


import { type FetchResponseProps, useConversation, } from "@/assets/providers/conversation"
import { useAlert } from "@/assets/providers/alert"

import { BackendFetch } from "@/assets/fetch/BE"

import Chat from "@/components/main/chat"
import { CreateResponseLoading } from "@/components/main/CreateResponseLoading"

// This is for code highlighting
import "highlight.js/styles/github-dark.css";

export default function Chats() {
    const { state, dispatch: { setCurrentResponseProps, setResponse } } = useConversation();
    // This is to prevent re-rendering
    const conversationTitles = useMemo(() => state.conversationTitles, [state.conversationTitles]);
    const responses = useMemo(() => state.responses, [state.responses]);
    const createStatus = useMemo(() => state.createStatus, [state.createStatus]);

    const [hasFetched, setHasFetched] = useState(false);

    const { dispatch: { setAlertMessage, setSeverity } } = useAlert();
    const { data: session } = useSession();

    const param = useParams();
    const conversation_id = (param as { conversation_id: string }).conversation_id;
    const router = useRouter();

    
    // This will always set current response props to the last response when responses state changes
    useEffect(() => {
        // Match the current conversation_id to the conversation title
        const conversation = conversationTitles.find((conversationTitle) => conversationTitle.conversation_id === conversation_id);
        if (conversation && responses.length > 0) {
            // Set the current response props to the last response
            setCurrentResponseProps({
                conversation_id: conversation.conversation_id,
                response_id: responses[responses.length - 1].response_id,
                choice_id: responses[responses.length - 1].choice_id,
            });
            document.title = `Chat: ${conversation.title}`;
        }
    }, [conversationTitles, conversation_id, responses]);

    useEffect(() => {
        if (hasFetched) return;

        // If the user is creating a new conversation, don't fetch the responses
        if (createStatus.conversation_id === conversation_id) {
            setHasFetched(true);

            return;
        }

        if (session?.access_token) {
            BackendFetch(`/response?conversation_id=${conversation_id}`, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        setHasFetched(true);
                        setAlertMessage("Unable to get responses");
                        setSeverity("error");
                    }

                    return res.json();
                })
                .then((res: FetchResponseProps[]) => {
                    setResponse(res);
                    setHasFetched(true);
                })
                .catch((err) => {
                    setAlertMessage(err.message);
                    setSeverity("error");

                    router.push("/chats");
                });
        }
    }, [session?.access_token, hasFetched, createStatus.conversation_id, conversation_id]);


    return (
        <>
            {!hasFetched ? <CreateResponseLoading />
                : <Chat responses={responses} />}
            {(createStatus.isCreating && hasFetched && createStatus.conversation_id === conversation_id)
                ? <CreateResponseLoading message={createStatus.message} />
                : null
            }
        </>

    )
}
