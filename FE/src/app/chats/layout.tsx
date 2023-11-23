import { ConversationProvider } from '@/assets/providers/conversation'
import Navbar from '@/components/navbar'
import ChatInput from '@/components/main/chatInput'

import styles from '@/css/main/layout.module.css'


export default function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <ConversationProvider>
            <div className={styles.layout}>
                <Navbar />

                <main className={styles.mainContainer}>
                    <div className={styles.pageContainer}>
                        {children}
                    </div>
                    <div className={styles.ChatInputContainer}>
                        <ChatInput />
                    </div>
                </main>
            </div>
        </ConversationProvider>
    )
}