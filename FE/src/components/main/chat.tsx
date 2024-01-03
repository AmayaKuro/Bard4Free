"use client";
import Markdown from 'markdown-to-jsx';
import hljs from "highlight.js/lib/common";

import { useState, useCallback } from 'react';

import { type ResponseProps } from "@/assets/providers/conversation";
import Wrapper from './response/Wrapper';
import UserMessage from './response/UserMessage';

// This is for the markdown theme
import "highlight.js/styles/github-dark.css";

import styles from "@/css/main/chat.module.css";


const Chat: React.FC<{ response: ResponseProps, isLast: Boolean, }> = ({ response, isLast }) => {
    const [hasHighlight, sethasHighlight] = useState(false);

    // This is to highlight code block in chat block
    const highlightElement = useCallback((el: HTMLDivElement | null) => {
        // This is to scroll to the bottom of the chat
        if (el && isLast && hasHighlight) {
            el.scrollIntoView({ behavior: "smooth" });
        }

        // If highlight is already done, don't do it again
        if (!el || hasHighlight) return;

        try {
            el.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block as HTMLElement);
            });

            el.querySelectorAll('p code').forEach((block) => {
                hljs.highlightElement(block as HTMLElement);
            });
            sethasHighlight(true);
        }
        // Ignore when el.querySelector('pre code') is null
        catch (error) { }

    }, [hasHighlight]);


    return (
        <div
            className={styles.container}
            ref={(el) => highlightElement(el)}
        >
            <UserMessage message={response.message} />

            <Wrapper >
                <Markdown>
                    {response.log}
                </Markdown>
            </Wrapper>
        </div >

    );
};

export default Chat;
