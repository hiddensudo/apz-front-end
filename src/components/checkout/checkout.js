import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export default function Checkout() {
    const { t } = useTranslation();
    const [order_id, setOrder_id] = useState(null);

    const amount = localStorage.getItem('amount');
    const currency = localStorage.getItem('currency') === '₴' ? 'UAH' : 'USD';
    const name = localStorage.getItem('name');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const building_id = queryParams.get('building_id');

    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 5);

    const start_date = currentDate.toISOString().slice(0, 10);
    const end_date = endDate.toISOString().slice(0, 10);
    const status = t('inProgressStatus');

    const token = localStorage.getItem('access_token');

    const params = {
        version: 3,
        public_key: 'sandbox_i55506891302',
        action: 'pay',
        amount: amount,
        currency: currency,
        description: `user buy ${name}`,
        order_id: order_id,
    };

    const data = btoa(JSON.stringify(params));
    const private_key = 'sandbox_JVhIZqXXOGzRpCxc2F7QLOndgxA6oy5yCCNAY1Bu';
    const sign_string = private_key + data + private_key;
    const signature = CryptoJS.SHA1(sign_string).toString(CryptoJS.enc.Base64);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = '//static.liqpay.ua/libjs/checkout.js';
        script.async = true;
        document.getElementById('liqpay_checkout').appendChild(script);

        window.LiqPayCheckoutCallback = function () {
            window.LiqPayCheckout.init({
                data: data,
                signature: signature,
                embedTo: '#liqpay_checkout',
                language: 'uk',
                mode: 'embed', // embed || popup
            }).on('liqpay.callback', function (data) {
                fetch('http://127.0.0.1:5000/api/order/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        building_id: building_id,
                        start_date: start_date,
                        end_date: end_date,
                        status: status,
                    }),
                })
                    .then(response => response.json())
                    .then(data => {
                        const order_id = data.order_id;
                        setOrder_id(order_id);
                    });
            }).on('liqpay.ready', function (data) {
            }).on('liqpay.close', function (data) {
            });
        };
    }, [data, signature]);

    return (
        <div>
            <div id="liqpay_checkout"></div>
        </div>
    );
}
