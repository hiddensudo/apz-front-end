import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';

function LanguageSelector() {
    const { i18n } = useTranslation();

    useEffect(() => {
        // Завантажити обрану мову з локального сховища при монтуванні компонента
        const selectedLanguage = localStorage.getItem('language') || 'en';
        i18n.changeLanguage(selectedLanguage);
    }, [i18n]);

    const handleChangeLanguage = (e) => {
        const selectedLanguage = e.target.value;
        // Зберегти обрану мову у локальному сховищі
        localStorage.setItem('language', selectedLanguage);
        i18n.changeLanguage(selectedLanguage);
    };

    return (
        <Form.Select onChange={handleChangeLanguage} value={i18n.language}>
            <option value="en">English</option>
            <option value="uk">Українська</option>
        </Form.Select>
    );
}

export default LanguageSelector;
