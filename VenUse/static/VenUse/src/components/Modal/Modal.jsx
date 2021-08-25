function Modal({ children, onClose, title }) {
    return (
        <div className="VENUE_modal">
            <div className="VENUE_modal_content">
                <button className="VENUE_close_modal" onClick={onClose}>
                    <strong>X</strong>
                </button>
                <div className="VENUE_modal_title">{title}</div>
                {children}
            </div>
        </div>
    );
}

export default Modal;
