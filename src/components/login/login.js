import React, {useState} from 'react';
import axios from 'axios';
import Header from '../header/header';
import styles from '../styles/login.module.css';
import Footer from "../footer/footer";
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/sunset.css';
import Animation from '../Animation/Animation';


// Додайте стилі для анімації прямо в ваш файл CSS
import '../styles/noty-animation.css';

function Login() {
    const [email, setEmail] = useState('danylo@gmail.com');
    const [password, setPassword] = useState('newpassword123');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/user/login', {
                email,
                password,
            });

            console.log(response.data);
            const notification = new Noty({
                theme: 'sunset',
                text: 'Authorization successful!',
                type: 'success',
                timeout: 3000,
                animation: {
                    open: Animation.open,
                    close: Animation.close,
                },
            });
            notification.show();
        } catch (error) {
            console.error(error);
            new Noty({
                theme: 'sunset',
                text: 'Authorization failed!',
                type: 'error',
                timeout: 3000,
                animation: {
                    open: Animation.open,
                    close: Animation.close,
                },
            }).show();
        }
    };



    return (
        <div>
            <Header/>
            <div className={`${styles.container} container`}>
                <h2>Sign in to your account</h2>
                <form id="login-form" onSubmit={handleSubmit}>
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
                    <button type="submit">Sign In</button>
                </form>
            </div>
            <Footer/>
        </div>
    );
}

export default Login;