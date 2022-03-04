import React, {useState, useRef, useEffect} from 'react'
import CapchaListener from "helper/hcapcha_system";
import CaptCha from "components/modal/captcha";

const CapchaHandler = () => {
    
    const captchaRef = useRef(null);
    const [isCaptCha, setIsCaptCha] = useState<boolean>(false);
    const [isAccept, setIsAccept] = useState< (value: boolean) => void | undefined>();

    const allCapcha = (data: any) => {
        const { request, response } = data;
        console.log(request, 'request');
        console.log(data);
        
        // setIsCaptCha(true);

        // return new Promise(resolve => setIsAccept(resolve))
        // CapchaListener
    }
    useEffect(() => {
        // CapchaListener.addListener(allCapcha);
        // return () => CapchaListener.removeListener(allCapcha);
    })
    
    const onSuccessCaptcha = (token: any) => {
        setIsCaptCha(false)
        isAccept && isAccept(true);
    }

    return (
        <CaptCha
            isOpen={isCaptCha}
            onSuccess={onSuccessCaptcha}
            onClose={() => { setIsCaptCha(false); isAccept && isAccept(false)}} />
    )
}

export default React.memo(CapchaHandler) 
