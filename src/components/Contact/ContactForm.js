import React, { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('idle');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add form submission logic here (e.g., API call)
        console.log('Form submitted:', formData);
        setFormData({ name: '', email: '', message: '' }); // Reset form
        setStatus('sent');
        window.setTimeout(() => setStatus('idle'), 4000);
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            {status === 'sent' && (
                <p className="form__success" role="status">
                    Message captured (check the console). Hook this up to an API when you are ready.
                </p>
            )}
            <div className="field">
                <label className="field__label" htmlFor="name">Name</label>
                <input
                    className="field__input"
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="field">
                <label className="field__label" htmlFor="email">Email</label>
                <input
                    className="field__input"
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="field">
                <label className="field__label" htmlFor="message">Message</label>
                <textarea
                    className="field__input field__input--textarea"
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                />
            </div>
            <button className="button" type="submit">Send</button>
        </form>
    );
};

export default ContactForm;
