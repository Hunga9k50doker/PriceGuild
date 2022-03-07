import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { ManageCollectionType } from "interfaces"
import { api } from 'configs/axios';
import Collection from "components/modal/collection"
import { useSelector } from "react-redux";
import Selectors from "redux/selectors";
import { useTranslation } from "react-i18next";
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash';

type PropTypes = {
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void;
  selectCollection?: (item: ManageCollectionType) => void;
  table?: string,
  title?: string,
}

const ChosseCollection = ({ table = "portfolio", title = "collection", isOpen, setIsOpen, ...props }: PropTypes) => {
  const [collections, setCollections] = useState<Array<ManageCollectionType>>([]);
  const [dataSearch, setDataSearch] = useState<Array<ManageCollectionType>>([]);
  const [isModal, setIsModal] = useState<boolean>(false);
  const { loggingIn, userInfo } = useSelector(Selectors.auth);
  const [t, i18n] = useTranslation("common");
  React.useEffect(() => {
    if (loggingIn) {
      getData()
    }

  }, [isOpen, loggingIn])

  const router = useRouter();
  
  const getData = async () => {
    try {
      const params = {
        table: table,
        user_id: !isEmpty(router.query.page) && Boolean(Number(router.query.page)) ? +router.query.page : userInfo?.userid,
      }
      const result = await api.v1.collection.getManageCollections(params);
      if (result.success) {
        setCollections(result.data)
        setDataSearch(result.data)
      }
      if (!result.success) {
        // @ts-ignore
        if (result.data?.verify_redirect) {
          return router.push('/verify-email')
        }
      }
    }
    catch (err: any) {
      console.log(err)
      setCollections([])
      setDataSearch([])
      if(err?.response?.status === 403) {
        return router.push('/verify-email')
      }
    }
  }
  const onSeachCollection = (e: any) => {
    e.target.value = e.target.value.toLowerCase();
    const data = collections.filter(({ group_name }) => group_name.toLowerCase().includes(e.target.value));
    setDataSearch(data)
  }

  const onCreateSuccess = () => {
    getData();
    setIsOpen(true);
    setIsModal(false)
  }

  const onHandleModal = (status: boolean) => {
    setIsOpen(true);
    setIsModal(status)
  }

  const selectCollection = (item: ManageCollectionType) => {
    props.selectCollection && props.selectCollection(item)
  }

  return (
    <>
      <Modal
        onHide={() => {
          setIsOpen(false)
        }}
        centered show={isOpen} fullscreen="sm-down" className="modal-choose-collection">
        <Modal.Header >
          <Modal.Title className="text-truncate text-capitalize">Choose {title === 'collection' ? t('portfolio.text') : title}</Modal.Title>
          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="close mt-2"
            data-dismiss="modal"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.9999 12.4199L17.6799 20.0999L19.5999 18.1799L11.9199 10.4999L19.5999 2.8199L17.6799 0.899902L9.9999 8.5799L2.3199 0.899902L0.399902 2.8199L8.0799 10.4999L0.399902 18.1799L2.3199 20.0999L9.9999 12.4199Z" fill="#6D7588" />
            </svg>
          </button>
        </Modal.Header>
        <Modal.Body className="customScroll">
          <form >
            <div className="row col-mar-10">
              <div className="mb-4 no-padding-content">
                <div className="search">
                  <i className="fa fa-search" />
                  <input type="text" onChange={onSeachCollection} className="form-control" placeholder="Search" />
                </div>
              </div>
              <div className="customScroll collection no-padding-content scroll-style">
                <div className="mb-3">
                  <div className="item-collection d-flex align-items-center rounded border border-1 p-11 cursor-pointer" onClick={() => {
                      setIsOpen(false);
                      setIsModal(true);
                    }}>
                    <button type="button" className="btn btn-create btn-outline-primary btn-lg">
                      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6001 0.733276H11.4001V11.3999L0.733398 11.3999V14.5999H11.4001V25.2666H14.6001V14.5999H25.2667V11.3999L14.6001 11.3999V0.733276Z" fill="#124DE3" />
                      </svg>
                    </button>
                    <div className="fw-bold ms-2 btn-create-text text-truncate text-capitalize"> New {title === 'collection' ? t('portfolio.text') : title} </div>
                  </div>
                </div>
                <div className="list-collection" >
                  {dataSearch?.map((item, key) =>
                    <div onClick={() => selectCollection(item)} key={key} className="rounded border border-1 mb-3 item-collection  cursor-pointer">
                      <div className="item">
                        <div className="fw-bold">
                          {item.group_name}
                          {Boolean(item.type === 2) && <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.5 6H10V4C10 1.794 8.206 0 6 0C3.794 0 2 1.794 2 4V6H1.5C0.673333 6 0 6.67267 0 7.5V14.5C0 15.3273 0.673333 16 1.5 16H10.5C11.3267 16 12 15.3273 12 14.5V7.5C12 6.67267 11.3267 6 10.5 6ZM3.33333 4C3.33333 2.52933 4.52933 1.33333 6 1.33333C7.47067 1.33333 8.66667 2.52933 8.66667 4V6H3.33333V4ZM6.66667 11.148V12.6667C6.66667 13.0347 6.36867 13.3333 6 13.3333C5.63133 13.3333 5.33333 13.0347 5.33333 12.6667V11.148C4.93667 10.9167 4.66667 10.4913 4.66667 10C4.66667 9.26467 5.26467 8.66667 6 8.66667C6.73533 8.66667 7.33333 9.26467 7.33333 10C7.33333 10.4913 7.06333 10.9167 6.66667 11.148Z" fill="#18213A" />
                          </svg>
                          } </div>
                        <div className="card-number">{item.total_card} Cards</div>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Collection
        onSuccess={onCreateSuccess}
        isOpen={isModal}
        onClose={() => onHandleModal(false)}
        table={table}
        title={title}
      />
    </>
  );
}

export default React.memo(ChosseCollection);
