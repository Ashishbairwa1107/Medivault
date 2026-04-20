// Used for modals taking up the center screen
const Modal = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay show" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div className="modal" style={{ background: 'var(--surface)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 500, boxShadow: 'var(--shadow-lg)', transform: 'scale(1)' }}>
                <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h3 style={{ fontSize: '1.15rem' }}>{title}</h3>
                    <button onClick={onClose} style={{ width: 38, height: 38, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text2)' }}>✕</button>
                </div>
                
                <div className="modal-body">
                    {children}
                </div>
                
                {footer && (
                    <div className="modal-footer" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
