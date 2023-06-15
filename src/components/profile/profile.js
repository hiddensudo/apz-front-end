import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Noty from 'noty';
import styles from '../styles/login.module.css';
import Animation from '../Animation/Animation';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import Header from '../header/header';
import Footer from '../footer/footer';

const Profile = () => {
    const { t } = useTranslation();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    useEffect(() => {
        const jwt_access = localStorage.getItem('access_token');

        axios.get('http://127.0.0.1:5000/api/user/get_user', {
            headers: {
                'Authorization': `Bearer ${jwt_access}`
            }
        })
            .then(response => {
                const user = response.data;
                setFirstName(user.first_name);
                setLastName(user.last_name);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleUpdateName = () => {
        if (!firstName || !lastName) {
            const notification = new Noty({
                theme: 'sunset',
                text: t('fillFieldsError'),
                type: 'error',
                timeout: 3000,
                animation: {
                    open: Animation.open,
                    close: Animation.close,
                },
            });
            notification.show();
            return;
        }

        const jwt_access = localStorage.getItem('access_token');

        axios.put('http://127.0.0.1:5000/api/user/update_name', {
            first_name: firstName,
            last_name: lastName
        }, {
            headers: {
                'Authorization': `Bearer ${jwt_access}`
            }
        })
            .then(response => {
                const notification = new Noty({
                    theme: 'sunset',
                    text: t('nameSurnameChanged'),
                    type: 'success',
                    timeout: 1000,
                    animation: {
                        open: Animation.open,
                        close: Animation.close,
                    },
                });
                notification.show();
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleUpdatePassword = () => {
        if (!newPassword) {
            const notification = new Noty({
                theme: 'sunset',
                text: t('fillFieldsError'),
                type: 'error',
                timeout: 3000,
                animation: {
                    open: Animation.open,
                    close: Animation.close,
                },
            });
            notification.show();
            return;
        }

        if (newPassword.length < 8) {
            const notification = new Noty({
                theme: 'sunset',
                text: t('passwordLengthError'),
                type: 'error',
                timeout: 3000,
                animation: {
                    open: Animation.open,
                    close: Animation.close,
                },
            });
            notification.show();
            return;
        }

        if (newPassword !== repeatPassword) {
            const notification = new Noty({
                theme: 'sunset',
                text: t('passwordsNotMatchError'),
                type: 'error',
                timeout: 3000,
                animation: {
                    open: Animation.open,
                    close: Animation.close,
                },
            });
            notification.show();
            return;
        }

        const jwt_access = localStorage.getItem('access_token');

        axios.put('http://127.0.0.1:5000/api/user/update_password', {
            new_password: newPassword
        }, {
            headers: {
                'Authorization': `Bearer ${jwt_access}`
            }
        })
            .then(response => {
                const notification = new Noty({
                    theme: 'sunset',
                    text: t('passwordChanged'),
                    type: 'success',
                    timeout: 1000,
                    animation: {
                        open: Animation.open,
                        close: Animation.close,
                    },
                });
                notification.show();
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div>
            <Header />
            <div style={{
                marginTop: '50px',
            }} className={`${styles.container} container`}>
                <h1>{t('profileTitle')}</h1>
                <form>
                    <label htmlFor="firstName">{t('firstNameLabel')}:</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        required
                    />
                    <br />
                    <label htmlFor="lastName">{t('lastNameLabel')}:</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        required
                    />
                    <br />
                    <Button
                        onClick={handleUpdateName}
                        style={{
                            backgroundColor: '#dbe0f4',
                            fontSize: '15px',
                            borderRadius: '30px',
                            width: '80%',
                            left: '10%',
                            marginTop: '10px',
                        }}
                    >
                        {t('changeNameSurnameButton')}
                    </Button>
                </form>
                <br />
                <form>
                    <label htmlFor="newPassword">{t('newPasswordLabel')}:</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                    />
                    <br />
                    <label htmlFor="repeatPassword">{t('repeatPasswordLabel')}:</label>
                    <input
                        type="password"
                        id="repeatPassword"
                        value={repeatPassword}
                        onChange={e => setRepeatPassword(e.target.value)}
                        required
                    />
                    <br />
                    <Button
                        onClick={handleUpdatePassword}
                        style={{
                            backgroundColor: '#dbe0f4',
                            fontSize: '15px',
                            borderRadius: '30px',
                            width: '60%',
                            left: '20%',
                            marginTop: '10px',
                        }}
                    >
                        {t('changePasswordButton')}
                    </Button>
                </form>
            </div>
            <div style={{
                marginTop: '100px'
            }}>
                <Footer />
            </div>
        </div>
    );
};

export default Profile;
