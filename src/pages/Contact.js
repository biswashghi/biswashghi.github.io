import React from 'react';
import ContactForm from '../components/Contact/ContactForm';

const Contact = () => {
    return (
        <div className="page">
            <header className="page__header">
                <h1 className="page__title">Contact</h1>
                <p className="page__lede">
                    Want to chat? Drop a note. (This form currently logs to the console; you can wire it to an API later.)
                </p>
            </header>

            <div className="grid grid--contact">
                <div className="card">
                    <h2 className="section-title">Details</h2>
                    <div className="contact-list">
                        <a className="contact-item" href="mailto:ghi.biswash@gmail.com">
                            <span className="contact-item__k">Email</span>
                            <span className="contact-item__v">ghi.biswash@gmail.com</span>
                        </a>
                        <a className="contact-item" href="tel:+15178991751">
                            <span className="contact-item__k">Phone</span>
                            <span className="contact-item__v">(517) 899-1751</span>
                        </a>
                        <a
                            className="contact-item"
                            href="https://www.linkedin.com/in/ghimire-biswash"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className="contact-item__k">LinkedIn</span>
                            <span className="contact-item__v">linkedin.com/in/ghimire-biswash</span>
                        </a>
                    </div>
                </div>

                <div className="card">
                    <h2 className="section-title">Send A Note</h2>
                <ContactForm />
                </div>
            </div>
        </div>
    );
};

export default Contact;
