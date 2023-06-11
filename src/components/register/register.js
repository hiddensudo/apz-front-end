import React, {useState} from 'react';
import Header from '../header/header';
import Footer from '../footer/footer';
import styles from '../styles/register.module.css';
import axios from "axios";
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/sunset.css';
import Animation from '../Animation/Animation';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            // Пароль менше 8 символів
            new Noty({
                theme: 'sunset',
                text: 'Password less than 8 characters!',
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
            // Паролі не співпадають
            new Noty({
                theme: 'sunset',
                text: 'Passwords do not match!',
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

            // Обробка відповіді після успішного запиту на реєстрацію
            console.log(response.data);
            const notification = new Noty({
                theme: 'sunset',
                text: 'Registration successful!',
                type: 'success',
                timeout: 1000,
                animation: {
                    open: Animation.open,
                    close: Animation.close,
                },
            });
            notification.show();
        } catch (error) {
            // Обробка помилки під час запиту на реєстрацію
            console.error(error);
            if (
                error.response &&
                error.response.data &&
                error.response.data.message === 'User already exists'
            ) {
                new Noty({
                    theme: 'sunset',
                    text: 'User already exists!',
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
                    text: 'Registration failed!',
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
            <Header/>
            <div className={`${styles.container} container`}>
                <h2>Create an account</h2>
                <form id="register-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
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
                        <label htmlFor="email">Email:</label>
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
                        <label htmlFor="password">Password:</label>
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
                        <label htmlFor="confirm-password">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirm-password"
                            name="confirm-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
            </div>
            <Footer/>
        </div>
    );
}

export default Register;
