/**
 * CONFIRMATION DIALOG COMPONENT
 * --------------------------------------------------------------------------
 * Used before sensitive actions such as product deletion, order cancellation,
 * or staff suspension.
 */

import Button from './Button.jsx';
import Modal from './Modal.jsx';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm action',
  message = 'Are you sure you want to continue?',
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <p className="text-sm text-[#4B5563] leading-relaxed">{message}</p>
      <div className="mt-6 flex items-center justify-end gap-3">
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={confirmVariant}
          size="sm"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
