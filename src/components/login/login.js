import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Header from '../header/header';
import styles from '../styles/login.module.css';
import Footer from '../footer/footer';
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/sunset.css';
import Animation from '../Animation/Animation';

import '../styles/noty-animation.css';
import Button from "@mui/material/Button";

function Login() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('danylo@gmail.com');
    const [password, setPassword] = useState('klik1234');
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [headerVisible, setHeaderVisible] = useState(true);
    const [footerVisible, setFooterVisible] = useState(true);

    useEffect(() => {
        if (isLoggedOut) {
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        }
    }, [isLoggedOut]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/user/login', {
                email,
                password,
            });

            localStorage.setItem('access_token', response.data.access_token);
            console.log(response.data.access_token);

            const notification = new Noty({
                theme: 'sunset',
                text: t('loginSuccess'),
                type: 'success',
                timeout: 1000,
                animation: {
                    open: Animation.open,
                    close: Animation.close,
                },
            });
            notification.show();

            setHeaderVisible(false);
            setFooterVisible(false);

            setIsLoggedOut(true);
        } catch (error) {
            console.error(error);

            try {
                const adminResponse = await axios.post('http://127.0.0.1:5000/api/admin/login', {
                    email,
                    password,
                });

                localStorage.setItem('admin_access', adminResponse.data.access_token);
                console.log(adminResponse.data.access_token);

                const notification = new Noty({
                    theme: 'sunset',
                    text: t('loginSuccess'),
                    type: 'success',
                    timeout: 1000,
                    animation: {
                        open: Animation.open,
                        close: Animation.close,
                    },
                });
                notification.show();

                setHeaderVisible(false);
                setFooterVisible(false);

                setIsLoggedOut(true);

                window.location.href = '/admin';
            } catch (adminError) {
                console.error(adminError);
                new Noty({
                    theme: 'sunset',
                    text: t('loginFailed'),
                    type: 'error',
                    timeout: 3000,
                    animation: {
                        open: Animation.open,
                        close: Animation.close,
                    },
                }).show();
            }
        }
    };


    return (
        <div>
            {headerVisible && <Header />}
            <div className={`${styles.container} container`}>
                <h2>{t('loginTitle')}</h2>
                <form id="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">{t('emailLabel')}:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">{t('passwordLabel')}:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button
                        type="submit"
                        style={{
                            backgroundColor: '#dbe0f4',
                            fontSize: '15px',
                            borderRadius: '30px',
                            width: '60%',
                            left: '20%',
                        }}
                    >
                        {t('loginButton')}
                    </Button>
                </form>
            </div>
            {footerVisible && <Footer />}
        </div>
    );
}

export default Login;
