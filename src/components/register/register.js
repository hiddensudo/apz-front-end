import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../header/header';
import Footer from '../footer/footer';
import styles from '../styles/register.module.css';
import axios from "axios";
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/sunset.css';
import Animation from '../Animation/Animation';
import Button from "@mui/material/Button";

function Register() {
    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            new Noty({
                theme: 'sunset',
                text: t('passwordLengthError'),
                type: 'error',
                timeout: 1000,
                animation: {
                    open: Animation.open,
                    close: Animation.close,
                },
            }).show();
            return;
        }

        if (password !== confirmPassword) {
            new Noty({
                theme: 'sunset',
                text: t('passwordsNotMatchError'),
                type: 'error',
                timeout: 1000,
                animation: {
                    open: Animation.open,
                    close: Animation.close,
                },
            }).show();
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/user/register', {
                first_name: name.split(' ')[0],
                last_name: name.split(' ')[1] || '',
                email,
                password,
            });

            console.log(response.data);
            const notification = new Noty({
                theme: 'sunset',
                text: t('registrationSuccessful'),
                type: 'success',
                timeout: 1000,
                animation: {
                    open: Animation.open,
                    close: Animation.close,
                },
            });
            notification.show();
        } catch (error) {
            console.error(error);
            if (
                error.response &&
                error.response.data &&
                error.response.data.message === 'User already exists'
            ) {
                new Noty({
                    theme: 'sunset',
                    text: t('userExistsError'),
                    type: 'error',
                    timeout: 1000,
                    animation: {
                        open: Animation.open,
                        close: Animation.close,
                    },
                }).show();
            } else {
                new Noty({
                    theme: 'sunset',
                    text: t('registrationFailed'),
                    type: 'error',
                    timeout: 1000,
                    animation: {
                        open: Animation.open,
                        close: Animation.close,
                    },
                }).show();
            }
        }
    };

    return (
        <div className="App">
            <Header />
            <div className={`${styles.container} container`}>
                <h2>{t('createAccountTitle')}</h2>
                <form id="register-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">{t('nameLabel')}</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">{t('emailLabel')}</label>
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
                        <label htmlFor="password">{t('passwordLabel')}</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">{t('confirmPasswordLabel')}</label>
                        <input
                            type="password"
                            id="confirm-password"
                            name="confirm-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {t('signUpButton')}
                    </Button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default Register;
