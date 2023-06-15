import React, { useState, useEffect } from 'react';
import styles from '../styles/goods.module.css';
import Button from "@mui/material/Button";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../header/header';
import Footer from '../footer/footer';

function ProductsList() {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/goods/get_all')
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setProducts(data)
            });
    }, []);

    const formatPrice = (price) => {
        if (i18n.language === 'uk') {
            // Multiply the price by 36 and add '₴' symbol
            return `${(price * 36).toFixed(0)} ₴`;
        } else {
            // Default format: $ symbol
            return `${price}$`;
        }
    };

    const getPriceLabel = () => {
        if (i18n.language === 'uk') {
            return t('priceLabelUkr');
        } else {
            return t('priceLabel');
        }
    };

    return (
        <div style={{ marginTop: '100px' }}>
            <Header />
            <div className={styles.productsList}>
                {products.map((product, index) => (
                    <div key={product._id.$oid} className={`${styles.goodsBlock} ${styles.enterAnimation}`}>
                        <img src={product.image} alt={product.name} className={styles.productImage} />
                        <h2>{product.name}</h2>
                        <p>{product.brief_description}</p>
                        <p>{getPriceLabel()}: {formatPrice(product.price)}</p>
                        <Link to={`/buyGood/${product._id.$oid}`}>
                            <Button style={{
                                backgroundColor: '#dbe0f4',
                                fontSize: '20px',
                                borderRadius: '10px',
                                width: '100%'
                            }}>
                                {t('buyNow')}
                            </Button>
                        </Link>
                    </div>
                ))}
            </div>
            <Footer page='home' />
        </div>
    );
}

export default ProductsList;
