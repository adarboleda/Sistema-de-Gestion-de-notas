import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de alerta Bootstrap reutilizable
 * @param {string} type - Tipo de alerta (success, danger, warning, info)
 * @param {string} message - Mensaje a mostrar
 * @param {boolean} show - Controla la visibilidad
 * @param {function} onClose - Callback al cerrar
 * @param {number} duration - Duración en ms antes de auto-cerrar (0 = no auto-cerrar)
 */
export default function AlertNotification({
  type = 'info',
  message,
  show,
  onClose,
  duration = 5000,
}) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show || !message) return null;

  const icons = {
    success: '✅',
    danger: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const titles = {
    success: 'Éxito',
    danger: 'Error',
    warning: 'Advertencia',
    info: 'Información',
  };

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999, maxWidth: '400px' }}>
      <div className={`alert alert-${type} alert-dismissible fade show shadow-lg`} role="alert">
        <strong>
          {icons[type]} {titles[type]}:{' '}
        </strong>
        {message}
        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
      </div>
    </div>
  );
}

AlertNotification.propTypes = {
  type: PropTypes.oneOf(['success', 'danger', 'warning', 'info']).isRequired,
  message: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};
