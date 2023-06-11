import React from 'react';
import Header from '../header/header';
import Footer from '../footer/footer';
import homeImage from '../../assets/home.jpg';
import '../styles/home.modules.css'

function Home() {
    return (
        <div>
            <Header/>
            <div>
                <div>
                    <div className='home-image-container'>
                        <img src={homeImage} alt="Home" className='home-image'/>
                    </div>
                    <div className='text-on-image'>
                        <h1>Simplify your utilities with our system.</h1>
                        <p>
                            Our company specializes in providing a comprehensive software solution for automating and
                            managing municipal services efficiently.
                        </p>
                    </div>
                </div>
            </div>
            <Footer page="home"/>
        </div>)
    ;
}

export default Home;
