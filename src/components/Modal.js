import React, { useEffect, useRef } from 'react';

const Modal = ({ open, title, children, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    // Focus the dialog so keyboard users land inside.
    if (dialogRef.current) dialogRef.current.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <button className="modal__overlay" type="button" onClick={onClose} aria-label="Close modal" />
      <div className="modal__dialog" ref={dialogRef} tabIndex={-1}>
        <div className="modal__head">
          <h2 className="modal__title">{title}</h2>
          <button className="button button--small button--ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

