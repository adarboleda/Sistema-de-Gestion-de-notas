import PropTypes from 'prop-types';

/**
 * Modal de confirmación Bootstrap reutilizable (sin dependencia de Bootstrap JS)
 */
export default function ConfirmModal({
  show,
  onConfirm,
  onCancel,
  title = '¿Confirmar acción?',
  message = '¿Está seguro de realizar esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
}) {
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onCancel}></div>

      {/* Modal */}
      <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {variant === 'danger' && '⚠️ '}
                {variant === 'warning' && '⚡ '}
                {variant === 'info' && 'ℹ️ '}
                {title}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onCancel}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">{message}</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                {cancelText}
              </button>
              <button type="button" className={`btn btn-${variant}`} onClick={onConfirm}>
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  variant: PropTypes.oneOf(['danger', 'warning', 'info', 'primary']),
};
