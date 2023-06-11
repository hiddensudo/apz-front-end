import React from 'react';
import '../styles/header.css'; // Імпортуйте глобальні стилі
import { Link } from 'react-router-dom'; // Імпортуйте компонент Link

function Header() {
    return (
        <header className="header"> {/* Додайте клас стилю */}
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li> {/* Замініть посилання на компонент Link */}
                    <li><Link to="/buy-sensors">Buy Sensors</Link></li> {/* Замініть посилання на компонент Link */}
                    <li><Link to="/about-us">About Us</Link></li> {/* Замініть посилання на компонент Link */}
                </ul>
                <ul className="right">
                    <li><Link to="/login">Login</Link></li> {/* Замініть посилання на компонент Link */}
                    <li><Link to="/register">Register</Link></li> {/* Замініть посилання на компонент Link */}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
