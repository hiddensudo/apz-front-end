import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from '../styles/buyGood.module.css';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../header/header';
import Footer from '../footer/footer';
import Button from "@mui/material/Button";
import Noty from 'noty';
import Animation from '../Animation/Animation';

function BuyProduct() {
    const { t, i18n } = useTranslation();
    const [product, setProduct] = useState(null);
    const { id } = useParams();

    const [buildings, setBuildings] = useState([]);

    const [selectedBuilding, setSelectedBuilding] = useState(null);

    const token = localStorage.getItem('access_token');
    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/buildings/get_all_by_user_id', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setBuildings(data);
            })
            .catch(error => {
                const notification = new Noty({
                    theme: 'sunset',
                    text: t('loginRequired'),
                    type: 'error',
                    timeout: 3000,
                    animation: {
                        open: Animation.open,
                        close: Animation.close,
                    },
                });
                notification.show();
            });
    }, [token]);


    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/goods/get_one?id=${id}`)
            .then(response => response.json())
            .then(data => setProduct(data));
    }, [id]);

    if (!product) {
        return <p>Loading...</p>;
    }

    const options = buildings.map(building => ({
        value: building._id.$oid,
        label: building.address
    }));

    const formatPrice = (price) => {
        if (i18n.language === 'uk') {
            // Multiply the price by 36 and add '₴' symbol
            return `${(price * 36).toFixed(0)} ₴`;
        } else {
            // Default format: $ symbol
            return `${price}$`;
        }
    };

    return (
        <div style={{ marginTop: "120px" }}>
            <Header />
            <div className={styles.productPage}>
                <img src={product.image} alt={product.name} className={styles.productImage} />
                <form className={`${styles.buyForm} ${styles.goodsBlock}`}>
                    <h2>{product.name}</h2>
                    <h3>{t('descriptionTitle')}:</h3>
                    <p className={styles.description}>{product.description}</p>
                    <label style={{
                        fontSize: '20px'
                    }} htmlFor="building">{t('chooseBuildingLabel')}:</label>
                    <Select
                        options={options}
                        onChange={selectedOption => setSelectedBuilding(selectedOption)}
                        theme={theme => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                                ...theme.colors,
                                primary25: '#dbecf4',
                                primary: 'black',
                            },
                        })}
                    />
                    <p className={styles.price}>{t('priceLabel')}: {formatPrice(product.price)}</p>
                    <Button
                        onClick={() => {
                            if (!selectedBuilding) {
                                const notification = new Noty({
                                    theme: 'sunset',
                                    text: t('selectBuildingError'),
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

                            localStorage.setItem('amount', i18n.language === 'uk' ? product.price*36 : product.price);
                            localStorage.setItem('currency', i18n.language === 'uk' ? '₴' : '$');
                            localStorage.setItem('name', product.name);
                            localStorage.setItem('building_id', selectedBuilding.value);
                            window.location.href = `/checkout?building_id=${selectedBuilding.value}`;
                        }}
                        style={{
                            backgroundColor: '#dbe0f4',
                            fontSize: '20px',
                            borderRadius: '30px',
                            width: '80%',
                            left: '10%',
                        }}
                    >
                        {t('buyButton')}
                    </Button>
                </form>
            </div>
            <Footer page="home" />
        </div>
    );
}

export default BuyProduct;
