import { useState, useEffect } from 'react';
import Modal from 'react-modal';


function ReactModal({ modalOpenState, contentLabelInput, modalFact, modalStyle, children }) {

    return (
        <div>
            <Modal
                isOpen={modalOpenState}
                contentLabel = {contentLabelInput}
                appElement= {modalFact}
                style={modalStyle}
            >
                {children}
            </Modal>
        </div>
    );
}

export default ReactModal;