import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/login/login';
import Home from './components/home/home';
import Register from './components/register/register';
import Goods from './components/goods/goods';
import BuyGood from './components/goods/buyGood';
import Checkout from './components/checkout/checkout';
import Profile from './components/profile/profile';
import Admin from './components/admin/admin';

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/goods" element={<Goods />} />
                <Route path="/buyGood/:id" element={<BuyGood />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </div>
    );
}

export default App;
