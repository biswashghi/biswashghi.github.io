import React, { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const subject = encodeURIComponent(`Website note from ${formData.name}`);
        const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
        );
        window.location.href = `mailto:ghi.biswash@gmail.com?subject=${subject}&body=${body}`;
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
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
            <p className="muted form__hint">
                Submitting opens your default email app with these details filled in.
            </p>
            <button className="button" type="submit">Compose email</button>
        </form>
    );
};

export default ContactForm;
