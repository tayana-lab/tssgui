import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const TssModal = ({modalId="", modalBodyId="",modalHeaderId="", header, footer, className="modal-md",defaultClose=true,style,children  }) => {

        const [t] = useTranslation();

 	useEffect(() => {
			const modalEl = document.getElementById(modalId);
			if (!modalEl) return;


			const enforceFocusHandler = (e) => {
			if (modalEl.contains(e.target)) return;
			e.stopImmediatePropagation();
			modalEl.focus();
			};

			document.addEventListener('focusin', enforceFocusHandler, true);

			return () => {
				document.removeEventListener('focusin', enforceFocusHandler, true);
			};
		}, [modalId]);

	const handleTssModalClose = () => {
		const modalBody = document.getElementById(modalBodyId);
		if (!modalBody) return;

		if (modalBody.querySelector('.p-datatable-table')) {
			window.$ && window.$(`#${modalId}`).modal('hide');
		} else {
			window.$ && window.$(`#${modalId}`).modal('hide');
		}
        };

  return (
        // <div className="modal tss-modal" id={modalId} data-backdrop="static">
        //  <div className={`modal-dialog ${className}`} style={style} >
        //   <div className="modal-content tss-modal-content">

        //    {(header || defaultClose) && (
        //     <div className="modal-header tss-modal-header" id={modalHeaderId}>
        //       {header && <div><h4>{header}</h4></div>}
        //       {defaultClose && (
        //               <span className="close" style={{cursor:'pointer'}}  data-dismiss="modal" aria-label="Close" title={t('modules.Generic.buttons.title.close')} >&times;</span>
        //       )}
        //     </div>
        //   )}

        //     {children && <div className="modal-body tss-modal-body" id={modalBodyId}>{children}</div>}
        //     {footer && <div className="modal-footer tss-modal-footer">{footer}</div>}
        //   </div>
        //  </div>
        // </div>
      <div className="modal fade tss-modal" id={modalId} data-backdrop="static" tabIndex="-1" role="dialog" aria-labelledby={modalHeaderId} aria-hidden="true">
      <div className={`modal-dialog ${className}`} role="document" style={style}>
        <div className="modal-content">
          {(header || defaultClose) && (
            <div className="modal-header tss-modal-header">
              {header && <h5 className="modal-title" id={modalHeaderId}>{header}</h5>}
              {defaultClose && (
                <button type="button" className="close"  data-dismiss="modal"   onClick={handleTssModalClose}  aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              )}
            </div>
          )}
          <div className="modal-body" id={modalBodyId}>
            {children}
          </div>
          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
};
export default TssModal;
