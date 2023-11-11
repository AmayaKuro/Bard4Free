import React, { ReactNode } from 'react';

import TitleContainer from './title.container.component';
import FooterComponent from './footer.component';

import styles from '@/css/navbar/navbar.module.css';


const Navbar: React.FC = () => {
    return (
        <nav id={styles.navbar}>
            <div className={styles.navHeader}>
                <img src="/favicon.ico" alt="logo" />
            </div>

            <div className={styles.navBody}>
                <TitleContainer />
            </div>

            <div className={styles.navFooter}>
                <FooterComponent />
            </div>
        </nav>
    );
};

export default Navbar;
