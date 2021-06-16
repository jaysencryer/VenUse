function Modal({ children, onClose }) {
    return (
        <div className="VENUE_modal">
            <div className="VENUE_modal_content">
                {children}
                <button className="VENUE_close_modal" onClick={onClose}><strong>X</strong></button>
            </div>
        </div>
    );
}

export default Modal;
