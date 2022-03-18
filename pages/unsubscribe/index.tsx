import React, {useEffect, useState} from 'react';
import FriendDetail from "components/profile/friends/friendDetail";
import { MyStorage } from "helper/local_storage";
import { AuthActions } from "redux/actions/auth_action";
import { useDispatch } from 'react-redux';
import queryString from 'query-string';
import { api } from 'configs/axios';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';
import { head, isEmpty } from 'lodash';
import Head from 'next/head';

const Unsubscribe: React.FC = ({...props}) => {
    const router = useRouter();
    const { code } = router.query;
    const [status, setStatus] = useState<boolean>(false);
    const [isLoading, setisLoading] = useState<boolean>(true);
    const [title, setTitle] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    useEffect(() => {
        const restoreAccount = async () => {
            try {
            const params = {
                token: code
            };
                
            const result = await api.v1.account.unSubcribeAcounnt(params);
            
            setStatus(!result.success);
            setisLoading(false);
            if (!result.success) {
                //@ts-ignore
                setTitle(result?.title)
                setMessage(result?.message)
                }
                
            }
			catch (err) {
				setStatus(true);
                setisLoading(false);
            }
		}
		if (!isEmpty(router.query)) {
			restoreAccount();
		}
    }, [router.query])
    return (
        <>
            <Head>
                <title>{
                    //@ts-ignore
                    props?.titlePage ?? ''}</title>
                <meta name="description" content={
                    //@ts-ignore
                    props?.descriptionPage ?? ''} />
            </Head>
            <div className="container">
                <div className="row">
                    <div className="col-12 min-vh-100">
                        <div className="contact-notify-success restore-account">
                            {!isLoading ? <h2 className="title">{title ? `${title}` : ''}  </h2> : <Skeleton style={{ width: 150 }} height={30} />}
                            {!isLoading ?
                                <p className="mb-50" dangerouslySetInnerHTML={
                                    //@ts-ignore
                                    { __html: message ? message : '' }}></p>
                                :
                                <div>
                                    <Skeleton style={{ width: 350 }} height={30} />
                                    <Skeleton style={{ width: 350 }} height={30} />
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
  );
}
export const getServerSideProps = async (context: any) => { 
  try {
   
    let titlePage = `Unsubscribe | PriceGuide.Cards`;
    
    return {props:{
     titlePage
    }}

  } catch (error) {
    
  }
  return {
    props: {},
  };
}
export default Unsubscribe;
