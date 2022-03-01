import React from 'react'
import Modal from 'react-bootstrap/Modal';

type PropTypes = {
    isOpen: boolean,
    onClose?: () => void,
    onSuccess?: (item?: any) => void,
    title?: string,
  }
const ModalDeleteCollection = ({ isOpen = false, ...props }: PropTypes) => {
    
    return (
        <Modal
        show={isOpen}
        centered
        keyboard={true}
        onHide={() => {
          props?.onClose && props.onClose()
        }}
        fullscreen="sm-down"
        className="modal-collection modal-delete">
        <Modal.Header className="justify-content-start" >
          <Modal.Title className="text-capitalize">Confirm Removing</Modal.Title>
          <button
            onClick={() => props?.onClose && props.onClose()}
            type="button"
            className="close mt-2"
          >
            <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.9999 12.4199L17.6799 20.0999L19.5999 18.1799L11.9199 10.4999L19.5999 2.8199L17.6799 0.899902L9.9999 8.5799L2.3199 0.899902L0.399902 2.8199L8.0799 10.4999L0.399902 18.1799L2.3199 20.0999L9.9999 12.4199Z" fill="#6D7588" />
            </svg>
          </button>
        </Modal.Header>
        <Modal.Body className="customScroll">
            {props.title}
        </Modal.Body>
        <Modal.Footer>
            <div className="modal-delete-footer d-flex">
                <div className="btn btn-cancel"
                    onClick={() => props?.onClose && props.onClose()}
                >
                  Cancel
                </div>
                <div className="btn btn-confirm"
                onClick={() =>props.onSuccess && props.onSuccess()}>
                 Yes, remove
                </div>
            </div>
        </Modal.Footer>
      </Modal>
    )
}

export default ModalDeleteCollection
