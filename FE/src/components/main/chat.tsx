import Markdown from 'markdown-to-jsx';
import hljs from 'highlight.js/lib/common';

import { type ResponseProps } from "@/assets/providers/conversation";
import Wrapper from './response/Wrapper';
import UserMessage from './response/UserMessage';

import styles from "@/css/main/chat.module.css";


const Chat: React.FC<{ responses: ResponseProps[] }> = ({ responses }) => {
    // this will run when the responses get added, and will highlight the code
        hljs.highlightAll();
    return (
        <>
            {responses.map((response) => (
                <div key={response.response_id} className={styles.container}>
                    <UserMessage message={response.message} />

                    <Wrapper>
                        <Markdown children={response.log} />
                    </Wrapper>
                </div>
            ))}
        </>
    );
};

export default Chat;
