import AccountCircle from "@mui/icons-material/AccountCircle";

import styles from "@/css/main/response/UserMessage.module.css";

const UserMessage: React.FC<{ message?: string }> = ({ message }) => {

    return (
        <div className={styles.container}>
            <AccountCircle fontSize='large' />
            {message
                ? <p>{message}</p>
                : <p className="rainbow_text">~ fetching ~</p>
            }
        </div>
    );
};

export default UserMessage;
