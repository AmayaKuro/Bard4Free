"use client";
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from "@mui/material/Button"
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircularProgress from '@mui/material/CircularProgress';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import GitHubIcon from '@mui/icons-material/GitHub';


import styles from '@/css/navbar/footer.module.css'


const FooterComponent = () => {
    const { data: session } = useSession();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={styles.container}>
            <Button
                id={styles.infoButton}
                aria-controls={open ? styles.menu : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                startIcon={<AccountCircleIcon />}
                endIcon={<MoreHorizIcon />}
                onClick={handleClick}
            >
                {session?.user?.name
                    ? <div className={styles.name}>{session?.user?.name}</div>
                    : <span />
                }
            </Button>
            <Menu
                id={styles.menu}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                MenuListProps={{
                    'aria-labelledby': styles.infoButton,
                }}
            >
                <MenuItem
                    onClick={e => {
                        handleClose();
                        window.open("https://github.com/AmayaKuro/CS50w/tree/main/FinalProject")
                    }}
                >
                    <ListItemIcon>
                        <GitHubIcon />
                    </ListItemIcon>

                    <ListItemText>
                        This project's Github repository
                    </ListItemText>
                </MenuItem>

                <MenuItem onClick={() => signOut()}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>

                    <ListItemText>
                        Logout
                    </ListItemText>
                </MenuItem>
            </Menu>
        </div >
    );
};

export default FooterComponent;
