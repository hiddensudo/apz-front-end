import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../header/header';
import Footer from '../footer/footer';
import utilities from '../../assets/utilities.jpg';
import money from '../../assets/money-save.jpg';
import '../styles/home.modules.css';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

function Home() {
    const { t } = useTranslation();

    return (
        <div style={{
            marginTop: '0px'
        }}>
            <Header />
            <div>
                <div>
                    <div className='home-image-container'>
                    </div>
                    <div className='text-on-image'>
                        <h1>{t('simplifyUtilities')}</h1>
                        <p>
                            {t('companyDescription')}
                        </p>
                    </div>
                </div>
                <div className="image-util-container">
                    <img src={utilities} alt="util" className="util-image" />
                    <p className="text-util">{t('conservationResources')}</p>
                </div>
                <div className="image-money-container">
                    <p className="text-money">{t('financialBenefit')}</p>
                    <img src={money} alt="money" className="money-image" />
                </div>
                <div style={{
                    display: "flex",
                    marginTop: '50px',
                    flexDirection: "column"
                }}>
                    <p className="text-buy">
                        {t('startSaving')}
                    </p>
                    <Link to={`/goods`}>
                        <Button style={{
                            backgroundColor: '#dbe0f4',
                            fontSize: '30px',
                            borderRadius: '30px',
                            width: '20%',
                            left: '40%'
                        }}>
                            {t('buyNow')}
                        </Button>
                    </Link>
                </div>
            </div>
            <Footer page='home' />
        </div>
    );
}

export default Home;
