import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useForm, SubmitHandler } from "react-hook-form";
import { api } from 'configs/axios';
import { ToastSystem } from 'helper/toast_system';
import { ManageCollectionType } from "interfaces"
import { isEmpty } from "lodash"
import LoginComponent from "./loginComponent"



type PropTypes = {
  isOpen: boolean,
  onClose?: () => void,
  onSuccess?: (item?: any) => void,
}


const LoginOrRegister = ({ isOpen = false, ...props }: PropTypes) => {

  return (
    <Modal
      show={isOpen}
      centered
      keyboard={true}
      onHide={() => {
        props?.onClose && props.onClose()
      }}
      fullscreen="sm-down"
      className="modal-collection modal-login">
      <Modal.Header className="justify-content-start" >
        <Modal.Title className="text-capitalize">Login or Create Account</Modal.Title>
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
      <Modal.Body className="customScroll modal-body-custom ">
        <LoginComponent onSuccess={props.onSuccess} />
      </Modal.Body>
    </Modal>);
}

export default LoginOrRegister;
