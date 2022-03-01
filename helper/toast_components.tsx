
const SvgIcon = ({color}: {color: string}) => {
    return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="18" fill={color} />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M25.3484 13.8485L15.4999 23.697L10.1514 18.3485L11.8484 16.6515L15.4999 20.3029L23.6514 12.1515L25.3484 13.8485Z" fill="white" />
      </svg>
    );
}

const CloseButton = ({closeToast}: any) => {
   return ( <div className="close-button" onClick={closeToast}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.00039 8.27998L1.88039 13.4L0.600389 12.12L5.72039 6.99998L0.600389 1.87998L1.88039 0.599976L7.00039 5.71998L12.1204 0.599976L13.4004 1.87998L8.28039 6.99998L13.4004 12.12L12.1204 13.4L7.00039 8.27998Z" fill="#6D7588" />
      </svg>
    </div>);
};

const MessageComponent = ({message}: {message: string}) => {
    return (
        <div className="toast-grade-content">{message}</div>
    );
}

export {SvgIcon, CloseButton, MessageComponent}