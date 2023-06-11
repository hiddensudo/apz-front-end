import React from 'react';
import Login from './components/login/login'; // Імпорт компонента Login
import Home from "./components/home/home";
import Register from './components/register/register'
import {BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
