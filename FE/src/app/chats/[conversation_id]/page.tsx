"use client"
import { useEffect, useCallback, useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'

import { type FetchResponseProps, useConversation, } from "@/assets/providers/conversation"
import { BackendFetch } from "@/assets/fetch/BE"
import Chat from "@/components/main/chat"
import { CreateResponseLoading } from "@/components/main/CreateResponseLoading"


export default function Chats() {
    const { state: { conversationTitles, responses, createStatus }, dispatch: { setCurrentResponseProps, setResponse } } = useConversation();
    const [hasFetched, setHasFetched] = useState(false);

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
    }, [conversationTitles, responses]);

    useEffect(() => {
        if (hasFetched) return;

        // If the user is creating a new conversation, don't fetch the responses
        if (createStatus.isCreating && createStatus.conversation_id === conversation_id) {
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
                        throw new Error("Failed to fetch responses");
                    }

                    return res.json();
                })
                .then((res: FetchResponseProps[]) => {
                    setResponse(res);
                    setHasFetched(true);
                })
                .catch((err) => {
                    router.push("/chats");
                });
        }
    }, [session?.access_token, hasFetched, createStatus]);


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
