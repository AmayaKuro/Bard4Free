import LinearProgress from '@mui/material/LinearProgress';

import UserMessage from './response/UserMessage';
import Wrapper from './response/Wrapper';

export const CreateResponseLoading: React.FC<{ message?: string }> = ({ message }) => {

    return (
        <div style={{ marginBottom: "2rem" }} >
            <UserMessage message={message} />
            <Wrapper>
                <LinearProgress color="info" style={{ borderRadius: "1rem", height: ".315rem" }} />
            </Wrapper>
        </div>

    );
};

