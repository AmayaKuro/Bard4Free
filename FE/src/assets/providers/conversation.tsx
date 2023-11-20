"use client";
import { useContext, useState, useMemo, Dispatch, SetStateAction, createContext } from 'react';


// Base response props
export type ResponseProps = {
    response_id: string;
    choice_id: string;
    message: string;
    log: string;
};

// This is used for the chat fetching
// title is not provided when continuing a conversation
export type FetchResponseProps = {
    conversation_id: string;
    title?: string;
} & ResponseProps;

// This is used for title display
export type ConversationTitleProps = {
    title: string;
    conversation_id: string;
};

// This is used for passing context to the chatInput
export type CreateResponseProps = {
    conversation_id: string;
    response_id: string;
    choice_id: string;
};

// This is used to indicate the loading state when creating a new response for specific conversation
export type CreateStatus = {
    isCreating: boolean;
    conversation_id: string;
    message: string;
};

type ConversationContextType = {
    state: {
        conversationTitles: ConversationTitleProps[];
        currentResponseProps: CreateResponseProps;
        responses: ResponseProps[];
        createStatus: CreateStatus;
        initMessage: string;
    };
    dispatch: {
        setConversationTitles: Dispatch<SetStateAction<ConversationTitleProps[]>>;
        setCurrentResponseProps: Dispatch<SetStateAction<CreateResponseProps>>;
        setResponse: Dispatch<SetStateAction<ResponseProps[]>>;
        setCreateStatus: Dispatch<SetStateAction<CreateStatus>>;
        setInitMessage: Dispatch<SetStateAction<string>>;
    };
};


export const ConversationContext = createContext({} as ConversationContextType);

export const useConversation = () => useContext(ConversationContext);

export const ConversationProvider = ({ children }: { children: React.ReactNode }) => {
    // Ex: [{title: "title", conversation_id: "conversation_id"}]
    const [conversationTitles, setConversationTitles] = useState<ConversationTitleProps[]>([]);
    const [currentResponseProps, setCurrentResponseProps] = useState<CreateResponseProps>({ conversation_id: "", response_id: "", choice_id: "" });
    const [responses, setResponse] = useState<ResponseProps[]>([]);
    // This indicate if the new response is loading
    const [createStatus, setCreateStatus] = useState<CreateStatus>({ isCreating: false, message: "", conversation_id: "" });
    // This is used for home recommend message     
    const [initMessage, setInitMessage] = useState("");

    // Use memo to prevent unnecessary re-render for the Provider
    const value = useMemo(() => ({
        state: {
            conversationTitles: conversationTitles,
            currentResponseProps: currentResponseProps,
            responses: responses,
            createStatus: createStatus,
            initMessage: initMessage,
        },
        dispatch: { setConversationTitles, setCurrentResponseProps, setResponse, setCreateStatus, setInitMessage }
    }), [conversationTitles, currentResponseProps, responses, createStatus, initMessage]);

    return (
        <ConversationContext.Provider value={value}>
            {children}
        </ConversationContext.Provider>
    );
}
