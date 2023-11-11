export const Notifier = ({
    message,
    type,
}: {
    message: string,
    type: string,
}) => {
    
    return (
        <div>
            <div>{message}</div>
        </div>
    );
}