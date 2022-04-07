import React, { useEffect, useState } from "react";
import { api } from "configs/axios";
import { ManageCollectionType, PgAppProfileType } from "interfaces";
import Collection from "components/modal/collection";
import CollectionSkeleton from "components/profile/collection/skeleton/collection";
import { ToastSystem } from "helper/toast_system";
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSelector } from "react-redux";
import Selectors from "redux/selectors";
import { useDispatch } from "react-redux";
import { ActionTypes } from "redux/actions/action_types";
import IconSearch from "assets/images/search.png";
import IconDot3 from "assets/images/dot-3.svg";
import Pagination from "components/panigation";
import { paginate } from "utils/helper";
// @ts-ignore
import $ from "jquery"
import useWindowDimensions from "utils/useWindowDimensions";
import { useTranslation } from "react-i18next";
import ModalDeletePortfolio from "components/modal/delete/portfolio";
import { isEmpty } from "lodash";
import HeaderUser from "components/user/headerUser"
import { TabType } from "../friends/friendDetail";
import { UserInfoType } from "interfaces"
import IconFolder from "assets/images/folder.svg"

const rowsPerPage = 20;
export type DataCollectionType = {
  data: Array<ManageCollectionType>;
  isLoading: boolean;
  showAllCardsFolder?: boolean;
  allCardsCount?: any;
};

type CollectionListType = {
  collections: DataCollectionType;
  getData: () => void;
  setCollections: (data: DataCollectionType) => void;
  isButtonRight?: boolean;
  isEdit?: boolean;
  gotoCard?: (item: ManageCollectionType) => void;
  isAnalytics?: boolean;
  title?: string;
  table?: string;
  profileFriend?: PgAppProfileType | undefined,
};

type ParamTypes = {
	action?: string,
}
const CollectionList = ({
  collections = {
    data: [],
    isLoading: true,
  },
  isButtonRight = true,
  isEdit = true,
  getData,
  title,
  table,
  isAnalytics = true,
  setCollections,
  profileFriend,
  ...props
}: CollectionListType) => {
  const [pagesSelected, setPagesSelected] = useState<Array<number>>([1]);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { ids } = useSelector(Selectors.claimPhoto);
  const [collectionDetail, setCollectionDetail] = useState<
    ManageCollectionType | undefined
  >();
  const [data, setData] = useState<Array<ManageCollectionType>>([]);
  const [idDelete, setIdDelete] = useState<number>(-1);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [searchMobbile, setSearchMobbile] = useState<boolean>(false)
  const [searchKey, setSearchKey] = useState<string>('');
  const [dataSearch, setDataSearch] = useState<Array<ManageCollectionType>>([]);
  const { userInfo } = useSelector(Selectors.auth);
  const { action } = router.query;
  const [dataSelect, setDataSelect] = useState<string>('');
  const [matchPatchRoute, setMatchPatchRoute] = useState<boolean>(false);
  const [friend, setFriend] = useState<UserInfoType>()
  
  React.useEffect(() => {

    let pathnname = router.asPath.split('/');
    
    if(pathnname[1] === "friends" || Boolean(Number(router.query.page))) {
      setMatchPatchRoute(true);
    }
  }, [])

  React.useEffect(() => {
    if (!isEmpty(router.query)) {
      if (userInfo.userid === +router.query.page) {
        //@ts-ignore
        setFriend(userInfo);
      } else {
        /**/
      }
    }
  }, [router.query])
  
  const [tabDetail, setTabDetail] = useState<TabType>({
    status: false,
    name: 'collection',
    action: 0,
  });
  
  React.useEffect(() => {
    if (collections.data.length) {
      setData(paginate(collections.data, rowsPerPage, [1]));
      if (dataSearch.length !== collections.data.length && !Boolean(searchKey) ) {
        setDataSearch([...collections.data]);
      }       
    }
    else {
      setData([]);
    }
  }, [collections]);

  const { width } = useWindowDimensions();
  const [t, i18n] = useTranslation("common")
  
  const onConfirmRemove = (id: number) => {
    setIdDelete(id);
    setIsOpenModal(true);
    getData();
  };

  const removeCollection = async (id: number) => {
    try {
      const params = {
        table: table,
        group_id: id,
      };
      const result = await api.v1.collection.removeCollection(params);
      if (result.success) {
        setIsOpen(false);
        getData();
        return ToastSystem.success(result.message ?? result.error);
      }
      return ToastSystem.error(result.message ?? result.error);
    } catch (err) {
      console.log(err);
      setCollections({
        data: [],
        isLoading: false,
      });
    }
  };

  const clearColection = async () => {
    removeCollection(idDelete);
    setIsOpenModal(false);
    getData();
  };

  const onHandleModal = (status: boolean) => {
    setIsOpen(status);
    if (!status) {
      setCollectionDetail(undefined);
    }
  };

  const onCreateSuccess = async () => {
    await onHandleModal(false);
    await getData();
  };

  const editCollection = (item: ManageCollectionType) => {
    setIdDelete(item?.group_ref ?? 0)
    setCollectionDetail(item);
    onHandleModal(true);
  };

  const gotoCard = (item: ManageCollectionType) => {
    props.gotoCard
      ? props.gotoCard(item)
      : router.push(`/profile/${!isEmpty(router.query.page) && Boolean(Number(router.query.page)) ? router.query.page + '/' : ''}${title === 'collection' ? t('portfolio.text_normal'): title+'s'}/${item.group_ref}/${item.group_name.replaceAll("/", "-")}`);
  };

  const gotoAnalytics = (item: ManageCollectionType) => {
    if (item.group_ref === 0) {
      return router.push(`/profile/portfolio/analytics`);
    }
    router.push(`/profile/portfolio/${item.group_ref}/analytics`);
  };

  const onClaimPhoto = async (id?: number) => {
    try {
      const params = {
        group_id: id,
      };
      if (ids.find((item: any) => item === id)) {
        return;
      }
      dispatch({
        type: ActionTypes.reducer.claim.updateListId,
        payload: id,
      });
      const result = await api.v1.collection.claimPhotosCollection(params);
      // @ts-ignore
      document.getElementById(`dropdownMenuButton${id}`).className =
        "btn btn-secondary dropdown-toggle";
      // @ts-ignore
      document.getElementById(`dropdownMenu${id}`).className = "dropdown-menu";
      if (result.success) {
        return ToastSystem.success(result.message ?? result.error);
      }
      return ToastSystem.error(result.message ?? result.error);
    } catch (err) {
      console.log(err);
      setCollections({
        data: [],
        isLoading: false,
      });
    }
  };

  const onLoadMore = () => {
    if (
      pagesSelected[pagesSelected.length - 1] + 1 <=
      Math.ceil((collections.data.length ?? 0) / rowsPerPage)
    ) {
      const pageNew = [
        ...pagesSelected,
        pagesSelected[pagesSelected.length - 1] + 1,
      ];

      setData(paginate([...collections.data], rowsPerPage, pageNew));
      setPagesSelected(pageNew);
    }
  };

  const handlePageClick = (event: any) => {
    if (event.length === 1) {
      $('html, body').animate({ scrollTop: 0 });
    }
    setPagesSelected(event);
    if (event.length === 1) {
      return setData(paginate([...collections.data], rowsPerPage, event));
    }
    setData(paginate([...collections.data], rowsPerPage, event));
  };

  const onChangeSearch = (e: any) => {
    let text = e.target.value;
    setSearchKey(text);
    setPagesSelected([1])
    if (!Boolean(text)) {
      setData(paginate([...dataSearch], rowsPerPage, [1]));
      return  setCollections({
        data: [...dataSearch],
        isLoading: false,
      });
    }

    let arr: Array<any> = [...dataSearch];
    let filtered = onFilter(arr, text);
    setData(paginate([...filtered], rowsPerPage, [1]));
    setCollections({
      data: filtered,
      isLoading: false,
    });
  };

  useEffect(() => {
    if (!Boolean(searchKey)) {
      setData(paginate([...dataSearch], rowsPerPage, [1]));
      // @ts-ignore
       setCollections((prevState) => {
          return {
            ...prevState,
            data: [...dataSearch],
          };
        });
    }
  }, [searchKey]);
  
  const onFilter = (data: Array<any>, text: string) => {
    return data?.filter(e => {
      if (e.group_name.toLowerCase().includes(text.toLowerCase())) {
        return true;
      }
      return false
    })
  }

  useEffect(() => {
    //@ts-ignore
    if (width > 768) {
      setSearchMobbile(false)
    }
  }, [width]);
  
  const closeModal = () => {
    setIsOpenModal(true);
    getData();
  }
  const onTabDetail = (tab: string) => {
    if (tab === 'friend') return;
    return router.push(`/${tab === 'collection' ? `profile/${router.query.page}/portfolio` : `profile/${router.query.page}/${tab+'s'}`}`)
  }

  const getUserDetail = async () => {
    try {
      const params = {
        profileid: Number(router.query.page)
      }
      const res = await api.v1.authorization.getUserInfo(params);
      if (res.success) {
        //@ts-ignore
        setFriend(res.data?.user_info)
      }
      if (!res.success) {
        // @ts-ignore
        /**/
      }
    } catch (error) {
      console.log("error........", error);
    }
  }
  
  return (
    <> {!isEmpty(router.query.page) && Boolean(Number(router.query.page)) && <HeaderUser userId={Number(router.query.page)} onTabDetail={onTabDetail} sendMessage={() => { }} isFriend={true} friend={profileFriend} />}
    <div className="profile-personal-collections">
      <div className="mt-4 profile-personal-collections-head">
        <div className="d-flex justify-content-between align-items-center section-title position-relative">
          <h1 className="mb-0 text-capitalize title-profile "> {`${title === 'collection' ? t('portfolio.text')+'s' : title+'s'}`} </h1>
          <div className="search-mobile" onClick={() => {setSearchMobbile(true)}}>
            <img className="pr-2 icon-search" src={IconSearch.src} alt="" title="" />
          </div>
          {searchMobbile && 
            <div className="search-form search-only-mobile w-100 position-absolute d-flex align-items-center">
              <div className="input-group position-relative">
                <button type="submit">
                  <img src={IconSearch.src} alt="" title="" />
                </button>
                <input type="text" className="form-control" placeholder="Search" value={searchKey} onChange={(e) => onChangeSearch(e)} />
                {searchKey &&
                  <div className="position-absolute ic-close-search" onClick={() => { setSearchKey('') }}>
                    <svg width="12.8" height="12.8" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99985 8.27997L12.1199 13.4L13.3999 12.12L8.27985 6.99997L13.3999 1.87997L12.1199 0.599968L6.99985 5.71997L1.87985 0.599968L0.599854 1.87997L5.71985 6.99997L0.599854 12.12L1.87985 13.4L6.99985 8.27997Z" fill="#18213A" />
                    </svg>
                  </div>
                }
              </div>
              <span className="text-close" onClick={() => {setSearchMobbile(false)}}>Close</span>
            </div>
          }
        </div>
        {Boolean(dataSearch.length > 0 || searchKey!== '') && <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="search-form d-none d-md-block">
            <div className="input-group">
              <button type="submit"> <img src={IconSearch.src} alt="" title="" /> </button>
              <input type="text" className="form-control" placeholder="Search" onChange={(e) => onChangeSearch(e)} />
            </div>
          </div>
          {isButtonRight && (
            <div className="d-flex btn-group-filter">
              {isAnalytics && (
                <Link href="/profile/portfolio/analytics">
                  <a className="fw-bold btn-collection-outline" title="Analytics"> Analytics </a>
                </Link>
              )}
              <button
                type="button"
                onClick={() => onHandleModal(true)}
                className="btn text-capitalize btn-collection-primary"
              > Create  {`${title === 'collection' ? t('portfolio.text') : title}`} </button>
            </div>
          )}
        </div>}
      </div>
      <div className="row profile-personal-collections-content">
        {collections.isLoading && <CollectionSkeleton />}
        {data.map((item, index) => (
          <div
            key={index}
            onClick={() => gotoCard(item)}
            className="col-12 col-md-6 col-lg-6 col-sm-6 mb-4"
          >
            <div className="card p-3 cursor-pointer">
              <div className="d-flex justify-content-between align-items-center">
                <div title={item.group_name} className="col-10 text-truncate title fw-bold">
                  {item.group_name}{" "}
                  {Boolean(item.type === 2) && (
                    <i className="ms-1 fa fa-lock" aria-hidden="true"></i>
                  )}
                  {Boolean(item.type === 0) && item.group_ref === 0 && (
                    <img src={IconFolder} alt="icon-folder" />
                  )}
                  {" "}
                </div>
                {isEdit && (
                  <div className="menu col-2 text-right">
                    <div className="dropdown">
                      <button onClick={(e) => { e.stopPropagation(); }}
                        className="btn btn-secondary dropdown-toggle pr-0"
                        type="button"
                        id={`dropdownMenuButton${item.group_ref}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      > <img src={IconDot3} alt="" title="" /> </button>
                      <ul className="dropdown-menu" id={`dropdownMenu${item.group_ref}`} aria-labelledby={`dropdownMenuButton${item.group_ref}`}>
                        <li onClick={(e) => {
                          e.stopPropagation();
                          editCollection(item);
                        }}
                        >
                          <span className="dropdown-item text-capitalize"> Edit {`${title === 'collection' ? t('portfolio.text') : title}`} </span>
                        </li>
                        {isAnalytics && (
                          <>
                            <li onClick={(e) => {
                                e.stopPropagation();
                                gotoAnalytics(item);
                              }}>
                              <span className="dropdown-item"> Analytics </span>
                            </li>
                          </>
                        )}
                        {Boolean(item?.claim) && (
                          <>
                            {/* <li><hr className="dropdown-divider m-0" /></li> */}
                            {/* <li
                              style={{
                                backgroundColor: ids.find(
                                  (id) => id === item.group_ref
                                )
                                  ? "#dedede"
                                  : "#fff",
                              }} onClick={(e) => {
                                e.stopPropagation();
                                onClaimPhoto(item.group_ref);
                              }}
                            >
                              <span className="dropdown-item text-capitalize claim-photo"> Claim all {item?.claim}{" "} {`Photo${(item?.claim ?? 0) > 1 ? "s" : ""}`} </span>
                            </li> */}
                          </>
                        )}
                        {/* <li><hr className="dropdown-divider m-0" /></li> */}
                        <li onClick={(e) => { e.stopPropagation(); onConfirmRemove(item?.group_ref ?? 0); setDataSelect(item?.group_name ?? '') }} >
                          <span className="dropdown-item text-capitalize"> Remove {`${title === 'collection' ? t('portfolio.text') : title}`} </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              <div className="card-body p-0 d-flex flex-column justify-content-end detail">
                <div>{item.total_card} Cards</div>
                <div>{item.unique_card} Non-duplicate Cards</div>
              </div>
            </div>
          </div>
        ))}
        {!collections.isLoading && Boolean(collections.data.length) && (
          <>
            {
                  
              Boolean(pagesSelected[pagesSelected.length - 1] < (Math.ceil(
                (collections.data.length ?? 0) / rowsPerPage
              ))) && (
                <div className="d-flex justify-content-center">
                  <button
                    onClick={onLoadMore}
                    type="button"
                    className="btn btn-light load-more"
                  > Load More </button>
                </div>
              )
            }
            <div className="d-flex justify-content-center mt-3 pagination-page">
              <Pagination
                pagesSelected={pagesSelected}
                onSelectPage={handlePageClick}
                totalPage={Math.ceil(
                  (collections.data.length ?? 0) / rowsPerPage
                )}
              />
            </div>
          </>
        )}
      </div>
      {collections.data.length === 0 && !collections.isLoading && searchKey === '' &&
        Boolean(!matchPatchRoute)  &&
         <div className="empty-collection">
        <div className="box-content">
          <p>You don't have any {title ==="wishlist" ? "wishlist": t('portfolio.text_normal')}s yet.</p>
          <p>Let’s create your first {title ==="wishlist" ? "wishlist": t('portfolio.text_normal')} now!</p>
          <button className="btn btn-primary" onClick={() => onHandleModal(true)} >Create {title ==="wishlist" ? "Wishlist": t('portfolio.text')}</button>
        </div>
      </div>}
      {
        matchPatchRoute && 
        !collections.isLoading && collections.data.length === 0 && searchKey === '' ?  
        <div className="message-profile-null">
            { 
            profileFriend && profileFriend?.user_info?.full_name ? profileFriend?.user_info?.full_name : profileFriend?.user_info?.username ? `@${profileFriend?.user_info?.username}` : ''
            } doesn't have any {title ==="wishlist" ? "wishlist": t('portfolio.text_normal')}s yet. 
        </div>
        : <></>
      }
      {
        collections && collections.data.length === 0 && !collections.isLoading  && searchKey !== '' &&
        <div className="message-profile-null">
          No results were found matching keyword 
        </div>
      } 
      <Collection
        onConfirmRemove={() => { setIsOpenModal(true); setIsOpen(false)}}
        collectionDetail={collectionDetail}
        onSuccess={onCreateSuccess}
        table={table}
        isOpen={isOpen}
        title={title}
        onClose={() => onHandleModal(false)}
        onClaimPhoto={onClaimPhoto}
      />
      <ModalDeletePortfolio
        title={`Confirm removing by entering “delete” in the field below`}
        subTitle={`Deleting your ${title ==="wishlist" ? "wishlist": t('portfolio.text_normal')} data is permanent and cannot be undone. All cards that are grouped in <span class="text-color-portfolio">${dataSelect}</span> ${title ==="wishlist" ? "wishlist": t('portfolio.text_normal')} will be deleted.`}
        textAction={`Type “delete” below to verify that you want to delete this ${title === "wishlist" ? "wishlist" : t('portfolio.text_normal')}`}
        textErrorNotMatch={`Type “delete” to verify that you want to delete this ${title === "wishlist" ? "wishlist" : t('portfolio.text_normal')}`}
        isOpen={isOpenModal}
        onClose={() => {setIsOpenModal(false);}}
        onSuccess={() => clearColection()}
      />
    </div></>
  );
};

export default React.memo(CollectionList);
