import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import InputSearch from "components/smartSearchMobile/inputSearch"

type PropTypes = {
  isShow?: boolean;
  defaultSearch?: string;
  onClose?: () => void;

}

const SearchMobileModal = ({ isShow = false, ...props }: PropTypes) => {


  const onClose = () => {
    props.onClose && props.onClose();
  }

  return (
    <Modal contentClassName="rounded-0" show={isShow} fullscreen={true} onHide={onClose}>
      <Modal.Body>
        <div className="modal-search-mobile">
          <InputSearch onClose={props.onClose} defaultSearch={props.defaultSearch} />
        </div>
      </Modal.Body>
    </Modal>

  );
}

export default React.memo(SearchMobileModal);
