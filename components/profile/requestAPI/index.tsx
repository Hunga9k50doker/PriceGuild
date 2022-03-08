import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Selectors from "redux/selectors";
import RequestAPIModal from "components/modal/requestAPI";
import closeImge from "assets/images/close.png";
import { ApiDocumentActionType } from "redux/actions/api_doc_action";
import { AllowedWebsite, APIKey } from "interfaces";
import RaiseAPIModal from "components/modal/raiseAPI";
import { ToastSystem } from 'helper/toast_system';
import { api } from 'configs/axios';
import { useRouter } from 'next/router'

type Inputs = {
  portf_req_sport: any;
  portf_req_year: any;
  portf_req_pub: any;
  portf_req_collection: any;
  portf_req_set_detail: any;
  portf_card_number: any;
  portf_req_player: any;
};

type PropsType = {};

const RequestAPI = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { keyList } = useSelector(Selectors.apiDocument);
  const [isOpenRaise, setIsOpenRaise] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const { userInfo } = useSelector(Selectors.auth);
  //Key này sử dụng để biết item nào đang dùng modal
  const [indexSelect, setIndexSelect] = useState<number>(0);
  const router = useRouter();
  useEffect(() => {
    dispatch(ApiDocumentActionType.getApiKeys());
    
    if (userInfo && !userInfo?.activated) {
      router.push('/verify-email');
      return;
    }
  }, []);

  const deleteApi = (item: APIKey, index: number) => {
    dispatch(
      ApiDocumentActionType.requestDelete({ id: item.id, indexReducer: index })
    );
  };

  const requestNewKeyApi = (apiName: string) => {
    setIsOpen(false);
    dispatch(ApiDocumentActionType.requestNewKey(apiName));
  };

  const raiseApiLimit = (domain: string) => {
    setIsOpenRaise(false);
    // dispatch(ApiDocumentActionType.addWebsiteAllowed({api_id: 0, indexApi: 0, url: domain}));
  };

  const addWebsite = (data: APIKey, indexApi: number) => {
    dispatch(ApiDocumentActionType.addWebsiteAllowed({ api_id: data.id, indexApi, url }));
  };

  const deleteWebsite = (data: AllowedWebsite, indexApi: number, indexWeb: number) => {
    dispatch(ApiDocumentActionType.deleteWebsiteAllowed({ api_id: data.api_key_id, web_id: data.id, indexApi, indexWeb }));
  };

  const renderCardsUsed = (verified: number) => {
    switch (verified) {
      case 1:
        return "1000"
      default:
        return "100"
    }
  }

  const onChangePermission = async (event: any) => {
    try {
      const params = {
        embedded: !Boolean(keyList[indexSelect]?.embedded),
        api_id: keyList[indexSelect]?.id,
      }
      const result = await api.v1.embedded.setPermission(params)
      if (result.success) {
        // @ts-ignore
        const keyListNew: APIKey[] = keyList.map(item => item.id === keyList[indexSelect]?.id ? ({
          ...item,
          embedded: !Boolean(keyList[indexSelect]?.embedded)
        }) : item);

        dispatch(ApiDocumentActionType.saveApiKeys(keyListNew));
        return ToastSystem.success(result.message);
      }
      ToastSystem.error(result.message);
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="col-12 col-md-10 min-vh-100">
      <div className="text-center mt-5 mb-5 coming-soon">Coming Soon</div>
      {/* <div className="col-3 helper mb-3">
        <div className="mt-4">
          <h3> API Management </h3>
          <div className="mt-4 d-flex justify-content-start  align-items-center">
            <div className="fw-bold">Documentation</div>
            <div className="ms-2">
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0)">
                  <path
                    d="M24.8182 0H15.3636C14.7109 0 14.1818 0.529141 14.1818 1.18183C14.1818 1.83452 14.7109 2.36366 15.3636 2.36366H21.965L9.80072 14.528C9.33917 14.9896 9.33917 15.7378 9.80072 16.1993C10.0314 16.4301 10.3339 16.5454 10.6363 16.5454C10.9388 16.5454 11.2413 16.4301 11.472 16.1993L23.6364 4.03498V10.6364C23.6364 11.2891 24.1655 11.8182 24.8182 11.8182C25.4709 11.8182 26 11.2891 26 10.6364V1.18183C26 0.529141 25.4709 0 24.8182 0Z"
                    fill="black"
                  />
                  <path
                    d="M20.0909 11.8184C19.4382 11.8184 18.9091 12.3476 18.9091 13.0003V23.6366H2.36361V7.09116H13C13.6527 7.09116 14.1818 6.56202 14.1818 5.90933C14.1818 5.25663 13.6527 4.72754 13 4.72754H1.18183C0.529141 4.72754 0 5.25669 0 5.90938V24.8185C0 25.4711 0.529141 26.0003 1.18183 26.0003H20.0909C20.7436 26.0003 21.2728 25.4711 21.2728 24.8184V13.0003C21.2727 12.3476 20.7436 11.8184 20.0909 11.8184Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="26" height="26" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          {!keyList.length && (
            <div className="mt-4">
              <button
                onClick={() => setIsOpen(true)}
                type="button"
                className="w-100 btn btn-outline-primary"
              > Request API Key </button>
            </div>
          )}
        </div>
      </div>
      {keyList.map((apiKey, indexApi) => (
        <div key={apiKey.id} className="card">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <h5>{apiKey.name}</h5>
              <button
                onClick={() => deleteApi(apiKey, indexApi)}
                type="button"
                className="close btn btn-link"
              > <img src={closeImge} alt="" /> </button>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-2">
                <div className=" h-100 position-relative col-auto">
                  <i
                    style={{ padding: "4rem" }}
                    className="fa fa-lock border"
                    aria-hidden="true"
                  ></i>
                </div>
              </div>
              <div className="col-8">
                <div className="mb-1">
                  <span className="fw-bold ">Public Key:</span> {apiKey.api_key}
                </div>
                <div className="mb-1">
                  <span className="fw-bold  me-1">Permission:</span>{" "}
                  <input
                    className="form-check-input me-1"
                    type="checkbox"
                    defaultChecked={Boolean(apiKey.embedded)}
                    onChange={onChangePermission}
                  />
                  Embedded Charts
                </div>
                <a
                  onClick={() => {
                    if (apiKey.allowed_websites.length) {
                      setIsOpenRaise(true);
                      setIndexSelect(indexApi);
                    }
                    else {
                      ToastSystem.error("Please whitelist at least one domain that you wish to use with the API before requesting an API limit increase");
                    }
                  }}
                  href="javascript:void(0)"
                  className="btn btn-primary"
                >
                  Raise API Limit
                </a>
                <div className="pt-3 pb-2">{apiKey.embedded_counter} / {renderCardsUsed(apiKey.verified)} Cards Used</div>
              </div>
            </div>
            <hr />
            <div>
              <h4>Whitelist your website</h4>
              <div className="fst-italic mb-2">
                Domain versions for both HTTP and HTTPS are are automatically
                white-listed when inputting a domain. Subdomains are considered
                separate websites so will need to be input in addition if you
                require access to the API on them.
              </div>
              <div className="form-row row align-items-center">
                <div className="col-4">
                  <label className="sr-only" htmlFor="inlineFormInputGroup">
                    URL
                  </label>
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">URL</div>
                    </div>
                    <input
                      onChange={(event) => {
                        setUrl(event.target.value);
                      }}
                      type="text"
                      className="form-control"
                      id="user_site"
                      placeholder="www.priceguide.cards"
                    />
                  </div>
                </div>
                <div className="col-8">
                  <button onClick={() => addWebsite(apiKey, indexApi)} className="btn btn-primary mb-3">
                    <i className="fa fa-fw fa-plus" aria-hidden="true" /> Add
                  </button>
                </div>
              </div>
            </div>
            <h5>Your whitelisted websites</h5>
            {apiKey.allowed_websites.map((webSite, indexWeb) => (
              <div key={webSite.id} className="d-flex align-items-center ms-2">
                <i
                  onClick={() => deleteWebsite(webSite, indexApi, indexWeb)}
                  className="cursor-pointer text-danger fa fa-times me-2"
                  aria-hidden="true"
                ></i>
                <span>{webSite.allowed_website}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <RequestAPIModal
        onSuccess={requestNewKeyApi}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <RaiseAPIModal
        api_id={keyList[indexSelect]?.id}
        isOpen={isOpenRaise}
        onSuccess={raiseApiLimit}
        onClose={() => setIsOpenRaise(false)}
      /> */}
    </div>
  );
};

export default React.memo(RequestAPI);
