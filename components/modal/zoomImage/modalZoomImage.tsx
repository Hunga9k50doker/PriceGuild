import React  from 'react'
import Modal from 'react-bootstrap/Modal';

type PropTypes = {
    isOpen: boolean,
    onClose?: (isOpenReport?: boolean) => void,
    onSuccess?: (item?: any) => void,
    title?: string,
    src?: string,
    imageDefaultZoom?: any,
}

const ModalZoomImage = ({ isOpen = false, ...props }: PropTypes) => {
    const openReportError = () => {
        props?.onClose && props.onClose(true)
    }
    return (
        <>
         
        <Modal
            show={isOpen}
            centered
            keyboard={true}
            restoreFocus={false}
            onHide={() => {
            props?.onClose && props.onClose(false)
            }}
            className="modal-zoom"
            >
            <button className="btn btn-close--zoom" onClick={() => props?.onClose && props.onClose(false)}>
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.9996 22.6799L33.7196 37.3999L37.3996 33.7199L22.6796 18.9999L37.3996 4.27985L33.7196 0.599854L18.9996 15.3199L4.27961 0.599854L0.599609 4.27985L15.3196 18.9999L0.599609 33.7199L4.27961 37.3999L18.9996 22.6799Z" fill="white"/>
                </svg>
            </button>
            <Modal.Body className="modal-body-zoom">
                <div className="modal-body-img">
                    <img src={props?.src} alt="image"
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        if (props.imageDefaultZoom) {
                        currentTarget.src=props.imageDefaultZoom;
                        }
                    }}
                    />
                </div>
                <span className="cursor-pointer" onClick={() => openReportError()}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.87402 1.63445C4.35843 1.63445 1.50848 4.48441 1.50848 8C1.50848 11.5156 4.35843 14.3655 7.87402 14.3655C11.3896 14.3655 14.2396 11.5156 14.2396 8C14.2396 4.48441 11.3896 1.63445 7.87402 1.63445ZM0.374023 8C0.374023 3.85786 3.73189 0.5 7.87402 0.5C12.0162 0.5 15.374 3.85786 15.374 8C15.374 12.1421 12.0162 15.5 7.87402 15.5C3.73189 15.5 0.374023 12.1421 0.374023 8Z" fill="#E9F1FF" fill-opacity="0.6"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.6634 9.2605L8.8194 3.58824H6.92865L7.08465 9.2605H8.6634Z" fill="#E9F1FF" fill-opacity="0.6"/>
                        <path d="M8.8194 11.4664C8.8194 11.9885 8.39614 12.4118 7.87402 12.4118C7.35191 12.4118 6.92865 11.9885 6.92865 11.4664C6.92865 10.9443 7.35191 10.521 7.87402 10.521C8.39614 10.521 8.8194 10.9443 8.8194 11.4664Z" fill="#E9F1FF" fill-opacity="0.6"/>
                    </svg>
                    Report an Error
                </span>
             
            </Modal.Body>
        </Modal>
        </>
    
    )
}

export default React.memo(ModalZoomImage)
