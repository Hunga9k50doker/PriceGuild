import React, {useEffect, useState} from 'react';
import { api } from 'configs/axios';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';

const RestoreAccount: React.FC = () => {
    const router = useRouter();
    const { token, uid } = router.query;
    const [status, setStatus] = useState<boolean>(false);
    const [isLoading, setisLoading] = useState<boolean>(true);
    useEffect(() => {
        const restoreAccount = async () => {
            try {
            const params = {
                userid: +uid,
                token: token
            };
                const result = await api.v1.account.restoreAcounnt(params);
                
                setStatus(result.success);
                setisLoading(false);
                if (result.success) {
                    let timer: any = null;

                    if (timer) {
                        clearTimeout(timer);
                    }

                    timer = setTimeout(() => {
                       router.push('/profile/personal')
                    }, 3000);
                }
                
            }
            catch (err) {
            }
        }
        restoreAccount();
    }, [])
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 min-vh-100">
         <div className="contact-notify-success restore-account">
            { !isLoading ? <h2 className="title">{ status ? `Account Successfully Restored` : 'Account Not Found'}  </h2> : <Skeleton style={{width:150}} height={30} />}
            {
                !isLoading ?
                    <p className="mb-50" dangerouslySetInnerHTML={
                    //@ts-ignore
                    { __html: status ? `Welcome back, your account has been successfully restored, you'll be redirected to the login page in 3 seconds.` : 'No account was found linked to this re-activation link, if you have any questions please get in touch at <span class="text-color-blue">info@priceguide.cards</spann>' }}></p>   
                    :
                    <div>
                        <Skeleton style={{ width: 350 }} height={30} />
                        <Skeleton style={{ width: 350 }} height={30} />
                    </div>         
            }
            
        </div>
        </div>
      </div>
    </div>
  );
}

export default RestoreAccount;
