import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

/**
 * TssModal — jQuery-free modal dialog.
 *
 * Opening / closing is driven by the `isOpen` prop.
 * For backward compatibility with legacy code that still calls
 * `window.$('#id').modal('show')`, we also watch for a custom
 * DOM attribute on the element: `data-tss-open`.  Legacy callers
 * that cannot be immediately migrated will still work.
 *
 * Props
 * -----
 * modalId         – id on the dialog element (backward compat for legacy selectors)
 * modalBodyId     – id on the body element
 * modalHeaderId   – id on the header element
 * header          – header string / node
 * footer          – footer node
 * className       – size class: "modal-sm" | "modal-md" (default) | "modal-lg" | "modal-xl"
 * defaultClose    – show × close button (default true)
 * style           – extra style on dialog
 * isOpen          – boolean controlled open state (preferred)
 * onClose         – callback when close is requested
 * children
 */
const TssModal = ({
  modalId = '',
  modalBodyId = '',
  modalHeaderId = '',
  header,
  footer,
  className = 'modal-md',
  defaultClose = true,
  style,
  isOpen,
  onClose,
  children,
}) => {
  const [t] = useTranslation();

  /* ---- Controlled-open state ---- */
  /* Support legacy jQuery-style show/hide via a MutationObserver on a
     data attribute, so old callers keep working without changes. */
  const [internalOpen, setInternalOpen] = React.useState(false);
  const dialogRef = useRef(null);

  /* When `isOpen` prop is provided, prefer it */
  const visible = isOpen !== undefined ? isOpen : internalOpen;

  /* ---- Trap focus inside modal while open ---- */
  useEffect(() => {
    if (!visible) return;
    const el = dialogRef.current;
    if (!el) return;
    const focusables = el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length) focusables[0].focus();
    const enforceFocus = (e) => {
      if (!el.contains(e.target)) {
        e.stopImmediatePropagation();
        el.focus();
      }
    };
    document.addEventListener('focusin', enforceFocus, true);
    return () => document.removeEventListener('focusin', enforceFocus, true);
  }, [visible]);

  /* ---- Keyboard: close on Escape ---- */
  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [visible]);

  /* ---- Scroll lock ---- */
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  /* ---- Legacy jQuery bridge: expose show/hide on window.$ proxy ---- */
  useEffect(() => {
    if (!modalId) return;
    const el = document.getElementById(modalId);
    if (!el) return;

    /* Polyfill for legacy `window.$('#id').modal('show')` callers */
    if (!window.$) {
      window.$ = (selector) => ({
        modal: (action) => {
          if (action === 'show' || action === 'toggle') setInternalOpen(true);
          if (action === 'hide')                         setInternalOpen(false);
        },
      });
    }
  }, [modalId]);

  const handleClose = () => {
    setInternalOpen(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return createPortal(
    <div
      className="tss-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={modalHeaderId || undefined}
      id={modalId}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={dialogRef}
        className={`tss-modal-dialog ${className}`}
        style={style}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---- Header ---- */}
        {(header || defaultClose) && (
          <div className="tss-modal-header" id={modalHeaderId}>
            {header && <span className="tss-section-title mb-0">{header}</span>}
            {defaultClose && (
              <button
                type="button"
                className="tss-btn-ghost p-0 w-7 h-7 flex items-center justify-center rounded-full text-base ml-auto"
                onClick={handleClose}
                aria-label={t('modules.Generic.buttons.title.close', 'Close')}
                title={t('modules.Generic.buttons.title.close', 'Close')}
              >
                &times;
              </button>
            )}
          </div>
        )}

        {/* ---- Body ---- */}
        <div className="tss-modal-body" id={modalBodyId}>
          {children}
        </div>

        {/* ---- Footer ---- */}
        {footer && (
          <div className="tss-modal-footer">{footer}</div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default TssModal;
