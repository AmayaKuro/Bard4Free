"use client";
import { useState, useEffect, forwardRef } from 'react';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { useAlert } from '@/assets/providers/alert';


const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AlertPopUp: React.FC = () => {
    const { state: { alertMessage, severity }, dispatch: { setAlertMessage } } = useAlert();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (alertMessage !== "") {
            setOpen(true);
        }
    }, [alertMessage]);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setAlertMessage("");
    };

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {alertMessage}
            </Alert>
        </Snackbar>
    );
}

export default AlertPopUp;