import React, {useState, useEffect} from 'react';
import {
    MDBNavbar,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBNavbarToggler,
    MDBContainer,
    MDBIcon,
    MDBCollapse,
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import Noty from 'noty';
import Animation from '../Animation/Animation';
import LanguageSelector from './LanguageSelector'; // Імпортуємо компонент LanguageSelector.js
import { Link } from 'react-router-dom';
import {useTranslation} from "react-i18next";


export default function Header() {
    const { t } = useTranslation();
    const [showBasic, setShowBasic] = useState(true);
    const [opacity, setOpacity] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');

    useEffect(() => {
        setOpacity(1);
        const accessToken = localStorage.getItem('access_token');
        setIsLoggedIn(!!accessToken);

        const storedLanguage = localStorage.getItem('selectedLanguage');
        if (storedLanguage) {
            setSelectedLanguage(storedLanguage);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        const notification = new Noty({
            theme: 'sunset',
            text: 'Log out successful!',
            type: 'success',
            timeout: 1000,
            animation: {
                open: Animation.open,
                close: Animation.close,
            },
        });
        notification.show();
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
        setIsLoggedIn(false);
    };

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
        localStorage.setItem('selectedLanguage', language);
    };

    return (
        <header style={{ opacity: opacity, transition: 'opacity 1s' }}>
            <MDBNavbar expand="lg" light bgColor="white" fixed="top" style={{ zIndex: 9999 }}>
                <MDBContainer fluid>
                    <MDBNavbarToggler
                        aria-controls="navbarExample01"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        onClick={() => setShowBasic(!showBasic)}
                    >
                        <MDBIcon fas icon="bars" />
                    </MDBNavbarToggler>
                    <MDBCollapse show={showBasic}>
                        <MDBNavbarNav right className="mb-2 mb-lg-0">
                            <MDBNavbarItem active>
                                <Link to="/" className="nav-link">
                                    {t('navbar.home')}
                                </Link>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <Link to="/goods" className="nav-link">
                                    {t('navbar.goods')}
                                </Link>
                            </MDBNavbarItem>
                            {isLoggedIn ? (
                                <MDBNavbarItem>
                                    <Link to="/profile" className="nav-link">
                                        {t('navbar.profile')}
                                    </Link>
                                </MDBNavbarItem>
                            ) : (
                                <></>
                            )}
                            <MDBNavbarItem></MDBNavbarItem>
                            {isLoggedIn ? (
                                <MDBNavbarItem>
                                    <MDBNavbarLink onClick={handleLogout}>{t('navbar.logout')}</MDBNavbarLink>
                                </MDBNavbarItem>
                            ) : (
                                <>
                                    <MDBNavbarItem>
                                        <Link to="/login" className="nav-link">
                                            {t('navbar.login')}
                                        </Link>
                                    </MDBNavbarItem>
                                    <MDBNavbarItem>
                                        <Link to="/register" className="nav-link">
                                            {t('navbar.register')}
                                        </Link>
                                    </MDBNavbarItem>
                                </>
                            )}
                        </MDBNavbarNav>
                    </MDBCollapse>
                    {/* Move LanguageSelector outside of MDBCollapse */}
                    <div className="d-flex">
                        <LanguageSelector
                            selectedLanguage={selectedLanguage}
                            onLanguageChange={handleLanguageChange}
                        />
                    </div>
                </MDBContainer>
            </MDBNavbar>
        </header>
    );
}
