import React from 'react';
import Header from '../header/header';
import Footer from "../footer/footer";

function Home() {
    return (
        <div className="App">
            <Header/>
            <div>
                <h1>Welcome to our system</h1>
                <p>Our system is designed to help you manage your tasks and projects in an efficient and organized
                    manner. With our system, you can:</p>
                <ul>
                    <li>Create and manage tasks and projects</li>
                    <li>Collaborate with your team members</li>
                    <li>Track your progress and deadlines</li>
                    <li>And much more!</li>
                </ul>
            </div>
            <Footer/>
        </div>
    );
}

export default Home;
