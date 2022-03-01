import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { AuthenticationApi } from 'api/authentication';
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash';

type PropTypes = {
  location: any,
}
const AccountActivationPage: React.FC<PropTypes> = (props) => {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>();
    useEffect(() => {
        if (!isEmpty(router?.query)) {
             AuthenticationApi.activationAccount({
            userid: +(router?.query.uid ?? 0),
            token: (router?.query.token ?? '').toString(),
            }).then(value => {
            setIsSuccess(true);
            setTimeout(() => {
                router.push("/profile/personal")
            }, 3000);
            }).catch(error => {
            console.log(error);
            setIsSuccess(false);
            });    
        }
   
  }, []);

  return (
    <section id="page-resd" className="pt-80">
    <div className="container min-vh-100">
        {isSuccess && <div className="row">
          <div className="col-md-12">
            <div className="contact-notify-success mwidth-460">
              <h2 className="title">Email Verified</h2>
              <p className="mb-50">Your email is successfully verified, you'll be redirected to the Profile page in 3 seconds.</p>
							
            </div>
          </div>
        </div>}
        
        {isSuccess === false && <div className="row">
          <div className="col-md-12">
            <div className="contact-notify-success mwidth-460">
              <h2 className="title">Error Verifying Email</h2>
              <p className="mb-50">
                
                There was an error verifying your email address, please get in touch with us at <a className="text-decoration-none" href="mailto:info@priceguide.cards"> info@priceguide.cards</a>
              </p>
            </div>
          </div>
        </div>
        }


  {isSuccess === undefined && <div className="d-flex mt-3 mb-5 justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div> }
      
      </div>
      </section>
  );
}

export default AccountActivationPage;
