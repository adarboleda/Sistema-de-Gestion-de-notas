import { useState } from 'react';

/**
 * Hook personalizado para manejar alertas
 */
export function useAlert() {
  const [alert, setAlert] = useState({
    show: false,
    type: 'info',
    message: '',
  });

  const showAlert = (type, message, duration = 5000) => {
    setAlert({ show: true, type, message });
    if (duration > 0) {
      setTimeout(() => {
        hideAlert();
      }, duration);
    }
  };

  const hideAlert = () => {
    setAlert({ show: false, type: 'info', message: '' });
  };

  const showSuccess = (message) => showAlert('success', message);
  const showError = (message) => showAlert('danger', message);
  const showWarning = (message) => showAlert('warning', message);
  const showInfo = (message) => showAlert('info', message);

  return {
    alert,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}

/**
 * Hook personalizado para manejar modales de confirmación
 */
export function useConfirmModal() {
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
    variant: 'danger',
  });

  const showConfirm = (title, message, onConfirm, variant = 'danger') => {
    setModal({
      show: true,
      title,
      message,
      onConfirm,
      variant,
    });
  };

  const hideModal = () => {
    setModal({
      show: false,
      title: '',
      message: '',
      onConfirm: null,
      variant: 'danger',
    });
  };

  const handleConfirm = () => {
    if (modal.onConfirm) {
      modal.onConfirm();
    }
    hideModal();
  };

  return {
    modal,
    showConfirm,
    hideModal,
    handleConfirm,
  };
}
