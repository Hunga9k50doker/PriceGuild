import React, {useEffect, useState} from 'react';
import FriendDetail from "components/profile/friends/friendDetail";
import { MyStorage } from "helper/local_storage";
import { AuthActions } from "redux/actions/auth_action";
import { useDispatch } from 'react-redux';
import queryString from 'query-string';
import { api } from 'configs/axios';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';

const Unsubscribe: React.FC = () => {
    const router = useRouter();
    const { code } = router.query;
    const [status, setStatus] = useState<boolean>(false);
    const [isLoading, setisLoading] = useState<boolean>(true);
    useEffect(() => {
        const restoreAccount = async () => {
            try {
            const params = {
                token: code
            };
                const result = await api.v1.account.unSubcribeAcounnt(params);
                
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
				setStatus(false);
                setisLoading(false);
            }
		}
		if (!isEmpty(router.query)) {
			restoreAccount();
		}
    }, [router.query])
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 min-vh-100">
         <div className="contact-notify-success restore-account">
            { !isLoading ? <h2 className="title">{ status ? `Message Case Already Unsubscribed` : 'Message Case Fail'}  </h2> : <Skeleton style={{width:150}} height={30} />}
            {
                !isLoading ?
                    <p className="mb-50" dangerouslySetInnerHTML={
                    //@ts-ignore
                    { __html: status ? `You have already been removed from our mailing list. If you are still getting emails in error, please contact <span class="text-color-blue">info@priceguide.cards</spann>.` : 'Invalid token - If you are having trouble removing yourself from our mailing list please contact <span class="text-color-blue">info@priceguide.cards</span> and we will manually remove you.' }}></p>   
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

export default Unsubscribe;
