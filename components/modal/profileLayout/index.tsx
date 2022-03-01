import React from 'react'
import Modal from 'react-bootstrap/Modal';
import { formatNumber } from "utils/helper";
type PropTypes = {
    isOpen: boolean,
    onClose?: () => void,
    data: Array<any>,
    your_points?: number,
    upload_points?: number,
    error_points?: number,
  }
const ModalProfileLayout = ({ isOpen = false, data, your_points, upload_points, error_points,  ...props }: PropTypes) => {
    
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
          <Modal.Title className="text-capitalize">User Classes</Modal.Title>
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
                <div className='prf-layout-title'>
                    Number of image uploads and/or error corrections submitted required to reach a class:
                </div>
                <div className='content-table-prf-layout'>
                    <table className="table mb-0 table-borderless table-striped table-hover table-prf-layout">
                        <thead>
                            <tr>
                                <th scope="col" >
                                    <div className="d-flex cursor-pointer"> Level </div>
                                </th>
                                <th scope="col">
                                    <div className="d-flex cursor-pointer"> Points </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {item.level}
                                        </td>
                                        <td>
                                            {item.points}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className='your-points mt-3 mb-3'> Your points: {formatNumber(your_points)} </div>
                <div className='content-table-prj-yours-point'>
                    <table className="table mb-0 table-borderless table-striped table-hover table-prf-layout">
                        <tbody>
                            <tr>
                                <td> Image Uploads </td>
                                <td> { upload_points } </td>
                            </tr>
                            <tr>
                                <td> Error Reporting </td>
                                <td> { error_points } </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
        </Modal.Body>
        <Modal.Footer>
            <div className="modal-delete-footer d-flex">
                <div className="btn btn-primary btn-close-prf-layout"
                    onClick={() => props?.onClose && props.onClose()}
                > Close </div>
            </div>
        </Modal.Footer>
      </Modal>
    )
}

export default ModalProfileLayout
