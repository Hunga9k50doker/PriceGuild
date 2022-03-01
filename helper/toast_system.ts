import React from 'react';
import { toast, ToastOptions, TypeOptions, ToastContentProps } from 'react-toastify';
import { MessageComponent, SvgIcon, CloseButton } from './toast_components';


type MessageContent = string | React.ReactNode | ((props: ToastContentProps) => React.ReactNode) | undefined;

type ToastStatus = 'info' | 'default' | 'success' | 'error' | 'warning';

interface PropsShow {
  status?: ToastStatus;
}

export class ToastSystem {

  private static getTypeToast(status?: ToastStatus): TypeOptions {
    switch (status) {
      case 'info':
        return toast.TYPE.INFO;
      case 'error':
        return toast.TYPE.ERROR;
      case 'success':
        return toast.TYPE.SUCCESS;
      case 'warning':
        return toast.TYPE.WARNING;
      default:
        return toast.TYPE.SUCCESS;
    }
  }

  private static getColor(status?: ToastStatus): string {
    switch (status) {
      case 'info':
        return '#0F9F59';
      case 'error':
        return '#CA1130';
      case 'success':
        return '#0F9F59';
      case 'warning':
        return '#0F9F59';
      default:
        return '#0F9F59';
    }
  }

  static show(message: MessageContent, _props?: PropsShow) {
    const props: PropsShow = _props ?? {}

    const options: ToastOptions = {
      autoClose: 5000,
      type: this.getTypeToast(props.status),
      hideProgressBar: true,
      position: toast.POSITION.BOTTOM_CENTER,
      pauseOnHover: true,
      className: "toast-grade",
      icon: () => SvgIcon({color: this.getColor(props.status)}),
      closeButton: CloseButton
    };

    toast(Boolean(message) && typeof message !== 'string'  ? message : MessageComponent({message: message ? message.toString() : ''}), options);
  }

  static error(message: MessageContent, _props?: PropsShow) {
    this.show(message, {..._props, status: 'error'});
  }

  static success(message: MessageContent, _props?: PropsShow) {
    this.show(message, {..._props, status: 'success'});
  }

  static info(message: MessageContent, _props?: PropsShow) {
    this.show(message, {..._props, status: 'info'});
  }

  static normal(message: MessageContent, _props?: PropsShow) {
    this.show(message, {..._props, status: 'default'});
  }

  static warning(message: MessageContent, _props?: PropsShow) {
    this.show(message, {..._props, status: 'warning'});
  }
}