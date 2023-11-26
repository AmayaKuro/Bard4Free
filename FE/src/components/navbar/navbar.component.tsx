"use client";
import React, { useState, useEffect, useMemo } from 'react';

import TitleContainer from './title.container.component';
import FooterComponent from './footer.component';

import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { motion } from 'framer-motion';

import styles from '@/css/navbar/navbar.module.css';


const Navbar: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [open, setOpen] = useState(true);

    const desktopAnimation = useMemo(() => {
        return {
            x: open ? 0 : -325,
            width: open ? 325 : 0,
            opacity: open ? 1 : 0,
            paddingLeft: open ? "30px" : 0,
        };
    }, [open]);

    const mobileNavBarAnimation = useMemo(() => {
        return {
            display: "grid",
            x: open ? 0 : -300,
            width: open ? "100%" : "0%",
            opacity: open ? 1 : 0,
            paddingLeft: open ? "30px" : 0,
            
            transitionEnd: {
                display: (open ? "grid" : "none") as React.CSSProperties["display"],
            }
        };
    }, [open]);

    const containerPosition = useMemo(() => {
        return {
            mobile: {
                width: open ? "100%" : "min-content",
                transition: {
                    duration: open ? 0 : 0.5,
                },
                transitionEnd: {
                    position: (open ? "absolute" : "relative") as React.CSSProperties["position"],
                }
            },
            desktop: {
                width: "min-content",
                position: "relative" as "relative",
            },
        }
    }, [open]);

    // Set isMobile state and add event listener to window 
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        // Close navbar if window initialized in mobile
        if (window.innerWidth < 768) setOpen(false);

        const handleWindowResize = () => setIsMobile(window.innerWidth < 768);

        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    return (
        <motion.div
            className={styles.navContainer}
            variants={containerPosition}
            animate={isMobile ? "mobile" : "desktop"}
        >
            <motion.nav className={styles.navbar}
                animate={isMobile ? mobileNavBarAnimation : desktopAnimation}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.navHeader}>
                    <img src="/favicon.ico" alt="logo" />
                </div>

                <div className={styles.navBody}>
                    <TitleContainer />
                </div>

                <div className={styles.navFooter}>
                    <FooterComponent />
                </div>
            </motion.nav>

            <div className={styles.navToggle}>
                <IconButton children={open ? <MenuIcon fontSize="large" /> : <MenuOpenIcon fontSize="large" />} onClick={() => setOpen((perv) => !perv)} />
            </div>
        </motion.div >
    );
};

export default Navbar;
