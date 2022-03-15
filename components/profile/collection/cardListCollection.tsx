import React, { useState, useEffect } from "react";
import { api } from 'configs/axios';
import {
  SelectDefultType,
  FilterType,
  filterDataType,
  CountType,
  ManageCollectionType,
} from "interfaces"
import Cards from "components/cards"
import { rowsPerPage } from "configs/common"
import CheckBoxFilter, { FilterHandle } from "components/filter/customCheckBox"
import CardElement from "components/cards/cardNode"
import { CardModel } from "model/data_sport/card_sport";
import { useDispatch, useSelector } from "react-redux";
import { FilterAction } from "redux/actions/filter_action";
import Selectors from "redux/selectors";
import { isEmpty, pull, isEqual, findIndex } from "lodash";
import { MetaData } from "utils/constant";
import { convertListDataToGrouped, formatNumber, isFirefox } from "utils/helper";
import EditNote from "components/modal/editNote"
import Select from 'react-select'
import { ToastSystem } from 'helper/toast_system';
import ChosseCollection from "components/modal/chosseCollection"
import Skeleton from 'react-loading-skeleton';
import Collection from "components/modal/collection"
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useDebouncedCallback } from "utils/useDebouncedEffect"
import IconSearch from "assets/images/search.png"
import ListLine from "components/icon/listLine";
import IconPlus from "components/icon/iconPlus"
import IconMinis from "components/icon/iconMinis"
import IconDotMoBile from "components/icon/iconDotMoBile";
import { sumBy } from "lodash";
import ArrowProfile from "assets/images/arrow_profile.svg";
import IconDot3 from "assets/images/dot-3.svg"
import IconCloseMobile from "assets/images/close_mobile.svg";
import useWindowDimensions from "utils/useWindowDimensions";
import SortMobile from "components/filter/sortMobile";
import CheckBoxMobile from "components/filter/checkBoxMobile";
import Pagination from "components/panigation";
import SelectGrading from "components/modal/selectGrading";
import ModalDeleteCollection from "components/modal/delete/collection/index";
import LoginModal from "components/modal/login";
import { MyStorage } from "helper/local_storage";
import { useTranslation } from "react-i18next";
import ModalDeletePortfolio from "components/modal/delete/portfolio";
// @ts-ignore
import $ from "jquery"
import HeaderUser from "components/user/headerUser"
import { UserInfoType } from "interfaces"

type PropTypes = {
  collection?: string,
  userId?: string,
  defaultSearch?: string,
  isEditCard?: boolean,
  className?: string,
  table?: string,
  title?: string,
  isSelectCard?: boolean,
  isFriend?: boolean,
  setGotoFriend?:(item:any) => void,
}

type DataLoadType = {
  cards: CardModel[],
  isLoading: boolean,
  rows?: number,
  group_name?: string,
  group_type?: number
}

const defaultSort: SelectDefultType = {
      value: 1,
      label: "Most Popular",
      sort_value: "count",
      sort_by: "desc"
}
type TrackData = {
  name: string;
  isUpdate: boolean
}

const CardListCollection = ({
  isSelectCard = false,
  table = "portfolio",
  title = "collection",
  className = "col-lg-12 col-md-12 pt-5 pb-5",
  collection,
  userId,
  isEditCard = false,
  defaultSearch = "",
  isFriend = false,
  ...props }: PropTypes) => {
  const { userInfo, loggingIn } = useSelector(Selectors.auth);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [sortCards, setSortCards] = useState<SelectDefultType>(defaultSort);
  const publisherRef = React.useRef<FilterHandle>(null);
  const sportRef = React.useRef<FilterHandle>(null);
  const yearRef = React.useRef<FilterHandle>(null);
  const setRef = React.useRef<FilterHandle>(null);
  const gradeRef = React.useRef<FilterHandle>(null);
  const automemoRef = React.useRef<FilterHandle>(null);
  const typeRef = React.useRef<FilterHandle>(null);
  const inputSearchRef = React.useRef<HTMLInputElement>(null);
  const [cardDetail, setCardDetail] = React.useState<CardModel | undefined>()
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false)
  const [count, setCount] = useState<CountType>();
  const [cardSelected, setCardSelected] = useState<Array<string | number>>([]);
  const [filterAr, setFilterAr] = useState<Array<filterDataType>>([])
  const [isSelect, setIsSelect] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [collectionDetail, setCollectionDetail] = useState<ManageCollectionType | undefined>();
  const [isInline, setIsInline] = useState<boolean>(false);
  const [lengthFilter, setLengthFilter] = useState<number>(1);
  const [pagesSelected, setPagesSelected] = useState<Array<number>>([1]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isScroll, setIsScroll] = useState<boolean>(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);
  const btnSoftByRef = React.useRef<HTMLButtonElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [data, setData] = useState<DataLoadType>({
    cards: [],
    isLoading: true,
    rows: 0,
    group_name: "",
    group_type: 1,
  })
  const [filterValue, setFilterValue] = useState<string>("years");
  const [isSearchMobile, setIsSearchMobile] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<
  { [key: string]: Array<FilterType> } | undefined
  >(undefined);   
  const dispatch = useDispatch();
  const filters = useSelector(Selectors.filter);
  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
  const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false);
  const [isMatchUser, setIsMatchUser] = useState<boolean>(false);
  const [matchPatchRoute, setMatchPatchRoute] = useState<boolean>(false);
  
  useEffect(() => {
    if (inputSearchRef) {
      // @ts-ignore 
      inputSearchRef.current.value = defaultSearch
    }
    resetPage();
  }, [collection, defaultSearch])
  const [friend, setFriend] = useState<UserInfoType>()
  const resetPage = (isRefresh: boolean = true) => {
    setFilterData({})
    setFilterAr([]);
    setTrackFilter([])
    resetFilter();
    if (isRefresh) {
      setPagesSelected([1])
      localStorage.removeItem('filterCollection')
      getListCard([1])
    }
  }
 const [t, i18n] = useTranslation("common")
  const getFilterSearch = () => {
    let params: any = {}
    const filterOld = { ...filterData };
    
    if (filterOld.isLoad !== undefined) {
      delete filterOld.isLoad
    }
    for (const [key, value] of Object.entries(filterOld ?? {})) {
      // @ts-ignore
      if (!isEmpty(value)) {
        const arrayValue = value.map(item => {
          if (key === "publishers" || key === "collections") {
            return item.name;
          }
          if (key === "grades") {
            return {
              // @ts-ignore
              company: item.grade_company,
              // @ts-ignore
              value: item.grade_value
            }
          }
          return item.id
          // @ts-ignore
        }).sort((a, b) => a - b);

        if (key === "sports" && arrayValue[0] === "all") {
          params[key] = []
        }
        else {
          params[key] = arrayValue
        }
      }
      
    }
    return params
  }
  const [dataUpdate, setDataUpdate] = useState<any>({});
  const getListCard = async (page = [1]) => {
    try {
        setData(prevState => {
          return { ...prevState, isLoading: true, cards: page.length ===1 ? [] : [...prevState.cards], };
        });
      
      let dataFilter = {};
      if (!isEmpty(filterData)) {
        dataFilter = getFilterSearch();
      }

      const params: any = {
        portid_only: false,
        port_userid: !isEmpty(router.query.page) && Boolean(Number(router.query.page)) ? +router.query.page : Number(userId ?? userInfo?.userid),
        table: table,
        view_mode: "grouped",
        group_ref: Number(collection),
        page: page[page.length-1],
        search_term: inputSearchRef?.current?.value,
        limit: rowsPerPage,
        currency: "USD",
        filter_dict: dataFilter,
        sort_dict: {
          sort_value: sortCards?.sort_value,
          sort_by: sortCards?.sort_by
        }
      }
      const result = await api.v1.portfolio.getUserPortfolio(params);
      if (result.success) {
        let checkUpdateFilter = JSON.parse(localStorage.getItem("filterCollection") ?? "[]") ?? [];
        if (page.length === 1) {
          // @ts-ignore 
          setFirstTimeFilterData(result.data.filter);
          
          let updateFilter = checkUpdateFilter.length !== 0 ? checkUpdateFilter : result.data.filter;
          // @ts-ignore 
          if (checkUpdateFilter.length !== 0) {
              //auto memo
            if (!checkIsUpdate('auto_memo')) {
              updateFilter.auto_memo.length = 0;
              updateFilter.auto_memo = dataUpdate?.auto_memo;
            } else {
              updateFilter.auto_memo.length = 0;
              updateFilter.auto_memo = result.data.filter.auto_memo;
            }
            //years
            if (!checkIsUpdate('years')) {
              updateFilter.years.length = 0;
              updateFilter.years = dataUpdate?.years;
            } else {
              updateFilter.years.length = 0;
              updateFilter.years = result.data.filter.years;
            }
            // collections
            if (!checkIsUpdate('collections')) {
              updateFilter.collections.length = 0;
              updateFilter.collections = dataUpdate?.collections;
            } else {
              updateFilter.collections.length = 0;
              updateFilter.collections = result.data.filter.collections;
            }
            // publishers
            if (!checkIsUpdate('publishers')) {
              updateFilter.publishers.length = 0;
              updateFilter.publishers = dataUpdate?.publishers;
            } else {
              updateFilter.publishers.length = 0;
              updateFilter.publishers = result.data.filter.publishers;
            }
            // sports
            if (!checkIsUpdate('sports')) {
              updateFilter.sports.length = 0;
              updateFilter.sports = dataUpdate?.sports;
            } else {
              updateFilter.sports.length = 0;
              updateFilter.sports = result.data.filter.sports;
            }
            // printRuns
            if (!checkIsUpdate('printRuns')) {
              updateFilter.printRuns.length = 0;
              updateFilter.printRuns = dataUpdate?.printRuns;
            } else {
              updateFilter.printRuns.length = 0;
              updateFilter.printRuns = result.data.filter.printRuns;
            }
            // grades
            if (!checkIsUpdate('grades')) {
              updateFilter.grades.length = 0;
              updateFilter.grades = dataUpdate?.grades;
            } else {
              updateFilter.grades.length = 0;
              updateFilter.grades = result.data.filter.grades;
            }
          }

          setDataUpdate(updateFilter);

          const grades = updateFilter?.grades;
          let gradeFilter: any = grades?.map((item: { grade_company: any; data: any[]; }) => ({
            id: item.grade_company,
            name: item.grade_company,
            options: item.data?.map((grade: { grade_value: any; display_value: any; grade_company: any; }) => ({
              id: `${item.grade_company}-${grade.grade_value}`,
              name: grade.display_value,
              grade_company: grade.grade_company,
              grade_value: grade.grade_value
            }))
          }))
          
          dispatch(FilterAction.updateFiltersCardDetail({
            publishers: convertListDataToGrouped(
              updateFilter?.publishers,
              FilterType.firstLetter,
              (item1, item2) => {
                return item1.name.localeCompare(item2.name);
              }
            ),
            collections: convertListDataToGrouped(
              updateFilter?.collections,
              FilterType.firstLetter,
              (item1, item2) => {
                return item1.name.localeCompare(item2.name);
              }
            ),
            printRuns: updateFilter?.printRuns,
            years: updateFilter.years.map((item: { toString: () => any; }) => ({
              name: item.toString(),
              id: item,
            })),
            auto_memo: updateFilter?.auto_memo,
            sports: updateFilter?.sports,
            grades: gradeFilter
          }));
          setCollectionDetail({
            group_ref: Number(collection),
            group_name: result.data?.group_name ?? "",
            type: result.data?.group_type,
          })
          setCount(result.data.counts); 
          return setData({
            cards: result.data.card_data,
            isLoading: false,
            rows: result.rows,
            group_name: result.data.group_name,
            group_type: result.data?.group_type,
          })
        }
        return setData(prevState => {
          return {
            ...prevState,
            cards: [...prevState.cards, ...result.data.card_data],
            isLoading: false,
            rows: result.rows
          };
        });
      }
      // ToastSystem.error(result.message);
      setCollectionDetail({
        group_ref: Number(collection),
        group_name: result.data?.group_name ?? "",
        type: result.data?.group_type,
      })
      setCount({
        count_cards: 0,
        count_entries: 0,
        count_non_duplicate_cards: 0,
      });
      
      setData(prevState => {
        return {
          ...prevState,
          isLoading: false,
          isLoadMore: false,
          group_name: result.data?.group_name,
          group_type: result.data?.group_type,
          cards: [],
          rows: 0,
        };
      });
    }
    catch (err: any) {
      ToastSystem.error(err.response?.data?.message);
      setData(prevState => {
        return { ...prevState, isLoading: false, isLoadMore: false };
      });
    }
  }
  const checkIsUpdate = (key: string) => {
    let index = trackFilter.findIndex(x => x.name === key)
    if (index == -1) {
      return true;
    }
    return trackFilter[index].isUpdate;
  }
  useEffect(() => {
    if (!isEmpty(filters.years) && !data.isLoading) {
      setPagesSelected([1])
      getListCard([1])
    }
  }, [filterData, sortCards])
  const [trackFilter, setTrackFilter] = useState<Array<TrackData>>([]);
  // const
  const onChangeFilter = (e: any, key: string, label?: string) => {
    let dataSave = [...trackFilter];
    if (trackFilter.length === 0) {
      trackFilter.push({
        name: key,
        isUpdate: false,
      });
      dataSave = [...trackFilter];
    }
    let index = trackFilter.findIndex(x => x.name === key);

    if (index === -1) {
      trackFilter.push({
        name: key,
        isUpdate: true,
      });
      dataSave = [...trackFilter];
    }
     
    if (e.length === 0) {
      let index = trackFilter.findIndex(element => element.name === key);
      let data = trackFilter.filter((x, i) => i < index);
      dataSave = [...data];
      setTrackFilter(data);
    }

    let currentIndex = trackFilter.findIndex(x => x.name === key);
    
    changeTrackFilter(currentIndex);

    let dataFiler = dataSave?.filter((item, index) => index <= currentIndex).map(item => item.name);
    
    let params = {};
    for (const element of dataFiler) {
      // @ts-ignore
      params[element] = filterData?.[element]
    }

    if (key === "collections") {
      typeRef?.current?.reset();
      // @ts-ignore
       setFilterData({ ...params, [key]: e, type: [], isLoad: true });
    } else {
       // @ts-ignore
      setFilterData({ ...params, [key]: e, isLoad: true });
    }
    resetDataTrack(dataFiler);
    // @ts-ignore
    buttonRef?.current.click();
  }

  const changeTrackFilter = (index: number) => {
    if (trackFilter.length > 1) {
      trackFilter.forEach(function (ele, idx) {
        ele.isUpdate = false;
        if (idx > index && index !== -1) {
          ele.isUpdate = true;
        }
      })
      
    }
    
  }
  const resetDataTrack = (data: Array<string>) => {
    let yearFilter = !data.includes('years');
    let sportFilter = !data.includes('sports');
    let autoFilter = !data.includes('auto_memo');
    let gradeFilter = !data.includes('grades');
    let publisherFilter = !data.includes('publishers');
    let collectionFilter = !data.includes('collections');
    
    if (yearFilter) {
      yearRef?.current?.reset();
    }

    if (sportFilter) {
      sportRef?.current?.reset();
    }

    if (autoFilter) {
      automemoRef?.current?.reset();
    }

    if (gradeFilter) {
      gradeRef?.current?.reset();
    }

    if (publisherFilter) {
      publisherRef?.current?.reset();
    } 

    if (collectionFilter) {
      setRef?.current?.reset();
    }
  }

  const resetFilter = () => {
    sportRef?.current?.reset();
    publisherRef?.current?.reset();
    yearRef?.current?.reset();
    setRef?.current?.reset();
    automemoRef?.current?.reset();
    typeRef?.current?.reset();
    gradeRef?.current?.reset();
  }

  const renderClassButtonFilter = (key: string) => {
    // @ts-ignore
    return `${filterData?.[key]?.length ? "active" : ""} dropdown mb-2`
  }

  const onEditNote = (item: CardModel) => {
    // @ts-ignore
    setCardDetail({...item})
    setIsOpen(true)
  }

  const onSuccessUpdateNote = (portid?: number, note?: string) => {
    if (portid) {
      // @ts-ignore
      setData(prevState => {
        return {
          ...prevState,
          cards: [...prevState.cards.map((item) => item.portid === portid ? ({ ...item, note: note }) : item)],
        };
      })
    }
    setIsOpen(false)
  }

  const onSelectItem = (code: any) => {
    if (cardSelected.includes(code)) {
      setCardSelected(prevState => [...pull(prevState, code)]);
    }
    else {
      setCardSelected(prevState => [...prevState, code]);
    }
  }
  const onSelectAll = () => {
    setIsCheckAll(true);
    setCardSelected([...data.cards?.map(item => item.portid)]);
  }
  const onClear = () => {
    setIsCheckAll(false);
    setCardSelected([]);
  }

  const onChangeSort = (e: any) => {
    setSortCards(e);
    //@ts-ignore
    btnSoftByRef?.current.click();
  }

  // const onConfirmRemove = () => {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       onRemoveCard()
  //     }
  //   })
  // }

  const onRemoveCard = async () => {
    try {
      const params = {
        table: table,
        portid_list: cardSelected
      }
      const result = await api.v1.portfolio.deleteCardsPortfolio(params);
      if (result.success) {
        // onHandleToast()
        setCardSelected([]);
        setPagesSelected([1])
        getListCard([1])
        setIsOpenModal(false)
        return ToastSystem.success(result.message ?? result.error);
      }
      setIsOpenModal(false)
      return ToastSystem.error(result.message ?? result.error);
    }
    catch (err) {
      setIsOpenModal(false)
      console.log(err)
    }
  }

  const selectCollection = async (item: ManageCollectionType) => {
    setIsShow(false)
    if (table === "wishlist" || isFriend) {
    const cardCode = data.cards?.filter(item=> cardSelected.includes(item.portid))?.map(item=> item.code)
    return  router.push(
        `/collections-add-card?collection=${item.group_ref}&code=${cardCode.toString()}`
      );
    }
    try {
      const params = {
        table: "portfolio",
        data: {
          portid: cardSelected,
          create_new: false,
          new_group: item.group_ref
        }
      }
      const result = await api.v1.portfolio.moveCardsPortfolio(params);
      if (result.success) {
        setCardSelected([])
        setPagesSelected([1])
        getListCard([1])
        return ToastSystem.success(result.message);
      }
      return ToastSystem.error(result.message ?? result.error);
    }
    catch (err) {
      console.log(err)
    }
  }

  const onHandleModal = (status: boolean) => {
    setIsOpenEdit(status)
  }

  const onCreateSuccess = (item: any) => {
    onHandleModal(false)
    setData(prevState => {
      return {
        ...prevState,
        group_name: item.name,
        group_type: item.type,
      };
    });
    setCollectionDetail(prevState => {
      return {
        ...prevState,
        group_name: item.name,
        type: item.type,
      };
    })
  }

  const onAnalytics = () => {
    router.push(`/profile/portfolio/${collection}/analytics`)
  }

  const loadSuggestions = useDebouncedCallback(getListCard, 450);

  const handleChange = (event: any) => {
    setPagesSelected([1])
    loadSuggestions([1])
  }

  const renderLengthFilterMobile = () => {
    switch (filterValue) {
      case "sports":
        return setTimeout(() => {
          setLengthFilter(sportRef?.current?.getLengthOption() ?? 0);
        }, 350);
      case "publishers":
        return setTimeout(() => {
          setLengthFilter( publisherRef?.current?.getLengthOption() ?? 0);
        }, 350);
      case "years":
        return setTimeout(() => {
          setLengthFilter(yearRef?.current?.getLengthOption() ?? 0);
        }, 350);

      case "collections":
        return setTimeout(() => {
          setLengthFilter( setRef?.current?.getLengthOption() ?? 0);
        }, 350);

      case "grades":
        return setTimeout(() => {
          setLengthFilter( gradeRef?.current?.getLengthOption() ?? 0);
        }, 350);
    
      case "auto_memo":
        return setTimeout(() => {
          setLengthFilter( automemoRef?.current?.getLengthOption() ?? 0);
        }, 350);
      default:
        return "";
    }
  };

  const renderTitleFilterMobile = () => {
    switch (filterValue) {
      case "sports":
        return "Sport";
      case "publishers":
        return "Publisher";
      case "years":
        return "Year";
        case "collections":
        return "Collection";
        case "grades":
        return "Grade";
        case "auto_memo":
          return "Autograph/Memorabilia";
      default:
        return "Filters";
    }
  };

  const checkFilter = (obj: { [key: string]: Array<FilterType> }) => {
    for (var key in obj) {
      if (obj[key]?.length) {
        return false;
      }
    }
    return true;
  };

  const renderButtonClear = () => {
    switch (filterValue) {
      case "sports":
        return Boolean(filterData?.sports?.length) ? (
          <button
            onClick={() => {
              sportRef?.current?.reset();
              // @ts-ignore
              return setFilterData((prevState) => {
                return {
                  ...prevState,
                  sports: []
                };
              });
            }}
            type="button"
            className="btn btn-primary clear-select"
          >
            Clear Selected ({filterData?.sports?.length})
          </button>
        ) : (
          ""
        );
        case "years":
          return Boolean(filterData?.years?.length) ? (
            <button
              onClick={() => {
                yearRef?.current?.reset();
                // @ts-ignore
                return setFilterData((prevState) => {
                  return {
                    ...prevState,
                    years: []
                  };
                });
              }}
              type="button"
              className="btn btn-primary clear-select"
            >
              Clear Selected ({filterData?.years?.length})
            </button>
          ) : (
            ""
          );
      case "publishers":
        return Boolean(filterData?.publishers?.length) ? (
          <button
            onClick={() => {
              publisherRef?.current?.reset();
              // @ts-ignore
              return setFilterData((prevState) => {
                return {
                  ...prevState,
                  publishers: []
                };
              });
            }}
            type="button"
            className="btn btn-primary clear-select"
          >
            Clear Selected ({filterData?.publishers?.length})
          </button>
        ) : (
          ""
        );
      case "collections":
        return Boolean(filterData?.collections?.length) ? (
          <button
            onClick={() => {
              setRef?.current?.reset();
              // @ts-ignore
              return setFilterData((prevState) => {
                return {
                  ...prevState,
                  collections: []
                };
              });
            }}
            type="button"
            className="btn btn-primary clear-select"
          >
            Clear Selected ({filterData?.collections?.length})
          </button>
        ) : (
          ""
        );
        case "grades":
          return Boolean(filterData?.grades?.length) ? (
            <button
              onClick={() => {
                gradeRef?.current?.reset();
                // @ts-ignore
                return setFilterData((prevState) => {
                  return {
                    ...prevState,
                    grades: []
                  };
                });
              }}
              type="button"
              className="btn btn-primary clear-select"
            >
              Clear Selected ({filterData?.grades?.length})
            </button>
          ) : (
            ""
          );
          case "auto_memo":
            return Boolean(filterData?.auto_memo?.length) ? (
              <button
                onClick={() => {
                  automemoRef?.current?.reset();
                  // @ts-ignore
                  return setFilterData((prevState) => {
                    return {
                      ...prevState,
                      auto_memo: []
                    };
                  });
                }}
                type="button"
                className="btn btn-primary clear-select"
              >
                Clear Selected ({filterData?.auto_memo?.length})
              </button>
            ) : (
              ""
            );
      default:
        return "";
    }
  };

  const resetFilterMobileUI = () => {
    if (filterValue !== "all") return null;
    const filterOld = { ...filterData };
    if (filterOld.isLoad !== undefined) {
      delete filterOld.isLoad;
    }
    return (
      <>
        {Boolean(!checkFilter(filterOld ?? {})) && (
          <div
            onClick={() => resetPage()}
            className="btn btn-primary clear-select"
          >
            <div>Reset Filters</div>
          </div>
        )}
      </>
    );
  };
  const onLoadMore = () => {
    if (pagesSelected[pagesSelected.length-1] + 1 <= (Math.ceil((data.rows ?? 0) / rowsPerPage))) {
      getListCard([...pagesSelected, pagesSelected[pagesSelected.length-1]+1])
      // setCurrentPage(currentPage + 1);
      setPagesSelected([...pagesSelected, pagesSelected[pagesSelected.length-1]+1])
    }
  }
  var timerid: any = null;

  const handlePageClick = (event: any) => {
    if (event.length === 1) {
      isFirefox ? $('html, body').animate({scrollTop: 0}) : window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    if (timerid) {
      clearTimeout(timerid);
    }
    timerid = setTimeout(() => {
      setPagesSelected(event)
      getListCard(event)
    }, 550);
  }

  const renderTotal = () => {
    return (
      <>
        {" "}
        {data.isLoading ? (
          "-"
        ) : data.cards.length ? (
          <span className="number">{(pagesSelected[0] - 1) * rowsPerPage + 1}</span>
        ) : (
          0
        )}
        -
        {data.isLoading ? (
          "-"
        ) : (
          <span className="number">
            {formatNumber(
              pagesSelected[pagesSelected.length-1] * rowsPerPage > (data.rows ?? 0)
                ? data.rows
                : pagesSelected[pagesSelected.length-1] * rowsPerPage
            )}
          </span>
        )}{" "}
        of{" "}
        {data.isLoading ? (
          "-"
        ) : (
          <span className="number">{formatNumber(data.rows)}</span>
        )}{" "}
        results
      </>
    );
  };

  const onRemoveWishlist = (idNumber: any) => {
    setCardSelected([idNumber]);
    setIsOpenModal(true);
  }

  React.useEffect(() => {
    if (!isOpenModal && !isSelect) {
      setCardSelected([]);
    }
  }, [isOpenModal])
  
  React.useEffect(() => {
    let pathnname = router.asPath.split('/');

    if(userId) {
      if(pathnname[1] === "friends" || Boolean(Number(router.query.page))) {
        if(userId !== MyStorage.user.userid.toString())
          setIsMatchUser(true);
      }
    }
  }, [])

  const [wishList, setWishList] = React.useState<ManageCollectionType | undefined>();
  const [isOpenWishList, setIsOpenWishList] = React.useState(false);
  const [isOpenGrade, setIsOpenGrade] = React.useState(false);
  const [cardData, setCardData] = useState<CardModel | undefined>();
  
  const selectWishlist = (item: ManageCollectionType) => {
    setWishList(item);
    setIsOpenWishList(false);
    setIsOpenGrade(true);
  };

  const onAddNewEntry = (item: CardModel) => {
    setCardData(item)
    setIsOpenWishList(true)
  }

  const onHandleMode = () => {
    if (!isInline) {
      return setIsSelect(prevState => !prevState)
    }
    if (isSelect) {
      setIsSelect(false)
    }
  }

  React.useEffect(() => {
    if (!isSelect) {
      setIsCheckAll(false);
      setCardSelected([])
    }
  }, [isSelect])

  React.useEffect(() => {
    if ((!isSelect && !isOpenWishList) && (!isSelect && !isOpen)) {
        setCardSelected([])
    }
  },[isOpenWishList,isOpen])

  React.useEffect(() => {
    if (isInline && cardSelected.length) {
      setIsSelect(true)
    }
    if (isInline && !cardSelected.length) {
      setIsSelect(false)
    }
  }, [cardSelected])

  const setFirstTimeFilterData = (data: Array<any>) => {
    const filter = localStorage.getItem('filterCollection');
    if (isEmpty(filter)) {
      return localStorage.setItem('filterCollection', JSON.stringify(data));
    }
    return;
  }

  const onAddCollection = (item: any) => {
    setCardData(undefined);
    setCardSelected([item.portid]);
    if (loggingIn) {
      setIsShow(true)
    }
    else {
      setIsOpenLogin(true);
    }
  }

  const onAddWishList = (item: CardModel) => {
    setCardData(item)
    if (loggingIn) {
      setIsOpenWishList(true)
    }
    else {
      setIsOpenLogin(true);
    }
  }

  const onSuccessWhistList = (code: any) => { console.log('abc')
    // @ts-ignore
    setData(prevState => {
      return { ...prevState, cards: prevState.cards?.map(item=> item.code === code ?({...item, wishlist:1}): item )};
    });
    getListCard([1]);
  }

  const onSortTable = (name: string) => { 
    if (data?.rows) {
      // @ts-expect-error
      setSortCards({
        sort_value: name,
        sort_by: sortCards?.sort_value === name && sortCards.sort_by === "desc" ? "asc": "desc"
      })
    }
  }

  const goToFriend = (e:any) => {
    if(isFriend) {
      props.setGotoFriend &&   props.setGotoFriend(title)
      e.preventDefault();
    }
  }
  const backToCollection = () => {
    if(isFriend) {
      props.setGotoFriend &&   props.setGotoFriend(title)
    } else {
      router.push("profile/collections")
    }
  }
  const removeCollection = async () => {
    try {
      const params = {
        table: table,
        group_id: collectionDetail?.group_ref,
      };
      const result = await api.v1.collection.removeCollection(params);
      if (result.success) {
        setIsOpenModalDelete(false);
        router.push(`/profile/${title === "wishlist" ? "wishlists" : t('portfolio.text_normal')}`)
        return ToastSystem.success(result.message ?? result.error);
      }
      return ToastSystem.error(result.message ?? result.error);
    } catch (err) {
      console.log(err);
    }
  };
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
        // if (res.data?.verify_redirect) {
        //   router.push('/verify-email')
        // }
      }
    } catch (error) {
      console.log("error........", error);
    }
  }
  useEffect(() => {
    if (!isEmpty(router.query)) {
      if (userInfo.userid === +router.query.page) {
        //@ts-ignore
        setFriend(userInfo);
      } else {
        getUserDetail();
      }
    }
  }, [router.query])

  const goToProfile = () => {
   router.push(`/profile/${Number(router.query.page)}`)
  }
  const goToCollection = () => {
   
  }
  const renderTab = () => {
    return <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a onClick={goToProfile} href="javascript:void(0)">{friend?.full_name}</a></li>
          <li className="breadcrumb-item"><a onClick={goToCollection} href="javascript:void(0)">{ t('portfolio.text')}</a></li>
          <li className="breadcrumb-item active" aria-current="page">{data.group_name && data.group_name}</li>
        </ol>
      </nav>
    </>
  }
  // console.log(data, 'data');
  return (
    <>
      {!isEmpty(router.query.page) && Boolean(Number(router.query.page)) &&
        <>
        <HeaderUser userId={Number(router.query.page)} onTabDetail={onTabDetail} sendMessage={() => { }} isFriend={true} friend={friend} />
        {
          //@ts-ignore
          width >= 768 ? renderTab() : null}
        </>
      }
      <div className="container-fluid p-0 container-collection-profile">
        <div className={`only-mobile`}>
          <Link href="/profile/portfolio">
            <a onClick={goToFriend} className="container-collection-profile-head text-capitalize">
               <img onClick={() => backToCollection} src={ArrowProfile} alt="" />
              {title === "wishlist" ? "wishlists" : t('portfolio.text_normal')}
           </a>
          </Link>
        </div>
        <ChosseCollection selectCollection={selectCollection} isOpen={isShow} setIsOpen={setIsShow} />
        <div className="row container-collection-profile-row">
          <div className="col-lg-12 col-md-12 pt-4 pb-5 py-0 container-collection-content">
          { !isSearchMobile &&
            <div className="d-flex justify-content-between align-items-center mb-4 container-collection-content-head">
              <h2 className="col-8 title">{data.group_name ? data.group_name : <Skeleton style={{ height: 30, width: 150 }} />} </h2>
              <div className="col-4 d-flex justify-content-end align-items-center" >
                <div className="search-form d-none d-md-block">
                  <div className="input-group">
                    <button type="submit"> <img src={IconSearch.src} alt="" title="" /> </button>
                    <input type="text" className="form-control" ref={inputSearchRef}  onChange={handleChange} defaultValue={defaultSearch} placeholder="Search" />
                  </div>
                  </div>
                {Boolean(isEditCard || title === "wishlist") && !isMatchUser && <div className="option-collection ms-2">
                  <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle px-0" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false"> <img src={IconDot3} alt="" /> </button>
                    <ul className="dropdown-menu dropdown-menu--collection " aria-labelledby="dropdownMenu2">
                      <li><button onClick={() => setIsOpenEdit(true)} className="dropdown-item text-truncate" type="button">Edit {title === "wishlist" ? "wishlist": t('portfolio.text')}</button></li>
                      {title === "collection" && <li><button onClick={onAnalytics} className="dropdown-item" type="button">Analytics</button></li>}
                    </ul>
                  </div>
                </div>}
              </div>
            </div>
          }
          {
            isSearchMobile && 
            <div className="only-mobile">
              <div className="container-collection-content-search--mobile d-flex">
                <div className={`search d-flex ${inputSearchRef?.current?.value ? 'active' : ''} `}>
                  <i className="icon-search"> <img src={IconSearch.src} alt="" /> </i>
                  <input ref={inputSearchRef} onChange={handleChange} defaultValue={defaultSearch} type="text" className="form-control" placeholder="Search" />
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99985 8.2801L12.1199 13.4001L13.3999 12.1201L8.27985 7.0001L13.3999 1.8801L12.1199 0.600098L6.99985 5.7201L1.87985 0.600098L0.599854 1.8801L5.71985 7.0001L0.599854 12.1201L1.87985 13.4001L6.99985 8.2801Z" fill="#18213A"/>
                  </svg>
                </div>
                <a onClick={() => setIsSearchMobile(false)} title="Close"> Close </a>
              </div>
            </div>
          }
            <div>
              <div className="d-flex mb-3 justify-content-between filter" >
                {isSelect ? 
                <>
                <div className="flex-wrap d-flex align-items-center col-6 btn-group-head-search">
                      <div className="me-2"> Selected {cardSelected.length} Cards </div>
                      {Boolean(cardSelected.length) &&
                        <button
                        type="button"
                        className="me-2 btn btn-portfolio"
                        onClick={() => setIsShow(true)}
                        >{table==="wishlist" ? `Add to ${t('portfolio.text')}` : `Move to ${t('portfolio.text')}`}</button>
                      }
                      {Boolean(cardSelected.length) &&
                        <button disabled={!cardSelected.length} type="button" onClick={() => setIsOpenModal(true)} className="mb-1 me-2 btn btn-wishlist btn-remove" title="Remove"> Remove </button>
                      }
                      <button type="button" onClick={onSelectAll} className="me-2 btn btn-select-all btn-select-all--profile" title="Select All"> Select All </button>
                      {Boolean(cardSelected.length) &&
                        <button type="button" onClick={onClear} className="me-2 btn btn-clear-section p-0" title="Clear"> Clear </button>
                      }
                </div> 
                <div className="only-mobile">
                  <div className="p-head-search-collection-profile">
                    <div className="flex-wrap d-flex align-items-center btn-group-head-search btn-group-head-search--mobile">
                      <div className="group-head-search-info">
                        <div className="group-head-search-info-text d-flex">
                          <div> Select All </div>
                          <div> <span className="fw-bold">{cardSelected.length}</span> cards selected</div>
                        </div>
                        <img src={IconCloseMobile} onClick={onClear} alt="" />
                      </div>
                    {
                    cardSelected.length > 0 &&
                      <div className="group-head-search-btn">
                        <button
                          disabled={!cardSelected.length}
                          type="button"
                          className="me-2 mb-1 btn btn-portfolio"
                          onClick={() => setIsShow(true)}
                        > {table==="wishlist" ? `Add to ${t('portfolio.text')}` : `Move to ${t('portfolio.text')}`} </button>
                        <button disabled={!cardSelected.length} type="button" onClick={()=> setIsOpenModal(true)} className="mb-1 me-2 btn  btn-wishlist btn-remove"> Remove </button>
                      </div>
                    }
                    </div> 
                  </div>
                </div>
                </>
                : 
                    !isSearchMobile &&
                    <div className="d-flex align-items-center fz-14 fz-12-mob">
                      <span className="fw-bold me-1">{count?.count_cards}</span> {t('portfolio.card_in_portfolio')}
                      <span className="icon-circle clear-padding"> <i className="mx-1 fa fs4 fa-circle" aria-hidden="true" style={{ color: 'rgba(109, 117, 136, 0.35)' }} /> </span>
                      <span className="fw-bold me-1">{count?.count_non_duplicate_cards}</span> Non-duplicate Cards
                  </div>
                }
                <div className="d-flex justify-content-end filter-only-desktop">
                  {/* <div className="me-2 mt-2">
                    Sort by:
                  </div> */}
                  {
                  !isInline && 
                    <div style={{ width: 168 }} className="hidden-select scroll-select">
                      <Select className="react-select-smart"
                        classNamePrefix="react-select-smart" onChange={onChangeSort}  value={sortCards} options={MetaData.sort_card_in_profile} />
                    </div>
                  }
                  <div className="d-flex btn-group-card">
                    <button type="button" onClick={() => setIsInline(prevState => !prevState)} className={` ${!isInline ? "active" : ""} ms-2 btn btn-outline-secondary`}> <i className="fa fa-th" aria-hidden="true"></i> </button>
                    <button type="button" onClick={() => {
                      setIsInline(prevState => !prevState);
                      setIsSelect(false)
                    }} className={` ${isInline ? "active" : ""} ms-2 btn btn-outline-secondary`}>
                      {/* <i className="fa fa-list" aria-hidden="true"></i> */}
                      <ListLine/>
                    </button>
                  </div>
                  {isSelectCard && <div>
                    {/* <button type="button" onClick={() => setIsSelect(prevState => !prevState)} className={`ms-2 btn btn-outline-secondary btn-search-plus d-flex justify-content-center align-items-center btn-not-shadow ${isSelect ? 'active' : ''}`}>
                      {isSelect ? <IconMinis /> : <IconPlus />}
                    </button> */}
                          <button type="button"
                  onClick={onHandleMode}
                  disabled={isInline && !cardSelected.length}
                  className={`ms-2  ${isInline && !cardSelected.length ? "opacity-50" : "opacity-100"}  btn btn-outline-secondary btn-search-plus ${isSelect ? "active" : ""} d-flex justify-content-center align-items-center`}>
                  {isSelect ? <IconMinis /> : <IconPlus />}
                </button>
                  </div>}
                </div>
              </div>
              <div className="filter-content">
                {
                  //@ts-ignore
                  width >= 768 ?
                    <div className="filter-top mb-2 filter-list">
                    <div className={renderClassButtonFilter("sports")}>
                      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenupublisher" data-bs-toggle="dropdown" aria-expanded="false"> Sport {
                        // @ts-ignore
                        Boolean(filterData?.sports?.length) && <span className="filter-number"> {filterData?.sports?.length} </span>}
                      </button>
                      <div className="dropdown-menu" aria-labelledby="dropdownMenusport">
                        <CheckBoxFilter
                          ref={sportRef}
                          isChangeValue={false}
                          onChange={onChangeFilter}
                          isSearch={sumBy(filters.sports, function (o: any) { return o.options?.length ?? 1; }) > 15}
                          name="sports" options={filters.sports} />
                      </div>
                    </div>
                    <div className={renderClassButtonFilter("grades")}>
                      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuGrade" data-bs-toggle="dropdown" aria-expanded="false"> Grade {
                        // @ts-ignore
                        Boolean(filterData?.grades?.length) && <span className="filter-number">{filterData?.grades?.length}</span>}
                      </button>
                      <div className="dropdown-menu" aria-labelledby="dropdownMenuGrade">
                        <CheckBoxFilter
                          ref={gradeRef}
                          isMultipleLv={true}
                          onChange={onChangeFilter}
                          isChangeValue={false}
                          name="grades"
                          isSearch={sumBy(filters.grades, function (o: any) { return o.options?.length ?? 1; }) > 15}
                          options={filters.grades ?? []} />
                      </div>
                    </div>
                    <div className={renderClassButtonFilter("publishers")}>
                      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenupublisher" data-bs-toggle="dropdown" aria-expanded="false"> Publisher{
                        // @ts-ignore
                        Boolean(filterData?.publishers?.length) && <span className="filter-number">{filterData?.publishers?.length}</span>}
                      </button>
                      <div className="dropdown-menu" aria-labelledby="dropdownMenupublisher">
                        <CheckBoxFilter
                          ref={publisherRef}
                          isChangeValue={false}
                          onChange={onChangeFilter}
                          isSearch={sumBy(filters.publishers, function (o: any) { return o.options?.length ?? 1; }) > 15}
                          name="publishers" options={filters.publishers} />
                      </div>
                    </div>
                    <div className={renderClassButtonFilter("year")}>
                      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuYear" data-bs-toggle="dropdown" aria-expanded="false"> Year{
                        // @ts-ignore
                        Boolean(filterData?.years?.length) && <span className="filter-number">{filterData?.years?.length}</span>}
                      </button>
                      <div className="dropdown-menu" aria-labelledby="dropdownMenuYear">
                        <CheckBoxFilter
                          ref={yearRef}
                          isChangeValue={false}
                          onChange={onChangeFilter}
                          isSearch={sumBy(filters.years, function (o: any) { return o.options?.length ?? 1; }) > 15}
                          name="years"
                          options={filters.years}
                        />
                      </div>
                    </div>
                    <div className={renderClassButtonFilter("collections")}>
                      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuCollection" data-bs-toggle="dropdown" aria-expanded="false"> Collection{
                        // @ts-ignore
                        Boolean(filterData?.collections?.length) && <span className="filter-number">{filterData?.collections?.length}</span>}
                      </button>
                      <div className="dropdown-menu" aria-labelledby="dropdownMenuCollection">
                        <CheckBoxFilter
                          ref={setRef}
                          isChangeValue={false}
                          onChange={onChangeFilter}
                          name="collections"
                          isSearch={sumBy(filters.collections, function (o: any) { return o.options?.length ?? 1; }) > 15}
                          options={filters.collections} />
                      </div>
                    </div>
                    <div className={renderClassButtonFilter("auto_memo")}>
                      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuauto_memo" data-bs-toggle="dropdown" aria-expanded="false"> Autograph/Memorabilia {
                        // @ts-ignore
                        Boolean(filterData?.auto_memo?.length) && <span className="filter-number">{filterData?.auto_memo?.length}</span>}
                      </button>
                      <div className="dropdown-menu" aria-labelledby="dropdownMenuauto_memo">
                        <CheckBoxFilter
                          ref={automemoRef}
                          isChangeValue={false}
                          name="auto_memo"
                          onChange={onChangeFilter}
                          isSearch={sumBy(filters.auto_memo, function (o: any) { return o.options?.length ?? 1; }) > 15}
                          options={filters.auto_memo} />
                      </div>
                    </div>
                    {/* {filterData.collections && <>
                      <div className="dropdown mb-2">
                        <button className={renderClassButtonFilter("type")} type="button" id="dropdownMenutype" data-bs-toggle="dropdown" aria-expanded="false">
                          {filterAr.find(item => item.key === "type")?.name ?? "Base/Insert"}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenutype">
                          <CheckBoxFilter
                            ref={typeRef}
                            isRefresh={true}
                            isChangeValue={false}
                            onChange={onChangeFilter}
                            name="type" options={filterCollection.type} />
                        </div>
                      </div>
                    </>} */}
                    {Boolean(filterAr.length) && <div
                      onClick={() => resetPage(false)}
                      className="cursor-pointer align-items-center d-flex p- btn-reset-filter justify-content-center">
                      <div> Reset Filters </div>
                    </div>}
                    </div>
                  : <>  
              <div className="filter-mobile filter-mobile-profile position-relative w-100">
                <div className="button-filter ">
                  <button
                    onClick={() => setFilterValue("sports")}
                    type="button"
                    className={`btn btn-primary btn-sm ${
                      Boolean(filterData?.sports?.length) ? "sport-button" : ""
                    }`}
                    data-bs-toggle="modal"
                    data-bs-target="#filterModal"
                  > Sport {Boolean(filterData?.sports?.length) && <span className="filter-number">{filterData?.sports?.length}</span>} </button>
                  <button
                    onClick={() => setFilterValue("grades")}
                    type="button"
                    className={`btn btn-primary btn-sm ${
                      Boolean(filterData?.grades?.length) ? "sport-button" : ""
                    }`}
                    data-bs-toggle="modal"
                    data-bs-target="#filterModal"
                  > Grade {Boolean(filterData?.grades?.length) &&  <span className="filter-number">{filterData?.grades?.length}</span>} </button>
                  <button
                    onClick={() => setFilterValue("publishers")}
                    type="button"
                    className={`btn btn-primary btn-sm ${
                      Boolean(filterData?.publishers?.length) ? "sport-button" : ""
                    }`}
                    data-bs-toggle="modal"
                    data-bs-target="#filterModal"
                  > Publisher {Boolean(filterData?.publishers?.length) &&  <span className="filter-number">{filterData?.publishers?.length}</span>}   
                  </button>
                  <button
                    onClick={() => setFilterValue("years")}
                    type="button"
                    className={`btn btn-primary btn-sm ${
                      Boolean(filterData?.years?.length) ? "sport-button" : ""
                    }`}
                    data-bs-toggle="modal"
                    data-bs-target="#filterModal"
                  > Year {Boolean(filterData?.years?.length) &&  <span className="filter-number">{filterData?.years?.length}</span>} </button>
                  <button
                    onClick={() => setFilterValue("collections")}
                    type="button"
                    className={`btn btn-primary btn-sm ${
                      Boolean(filterData?.collections?.length) ? "sport-button" : ""
                    }`}
                    data-bs-toggle="modal"
                    data-bs-target="#filterModal"
                  > Collection {Boolean(filterData?.collections?.length) &&  <span className="filter-number">{filterData?.collections?.length}</span>}  
                  </button>
                  <button
                    onClick={() => setFilterValue("auto_memo")}
                    type="button"
                    className={`btn btn-primary btn-sm ${
                      Boolean(filterData?.auto_memo?.length) ? "sport-button" : ""
                    }`}
                    data-bs-toggle="modal"
                    data-bs-target="#filterModal"
                  > Autograph/Memorabilia {Boolean(filterData?.auto_memo?.length) &&  <span className="filter-number">{filterData?.auto_memo?.length}</span>}  
                  </button>
                  <div className="btn btn-filter btn-primary btn-sm">
                    <button
                      onClick={() => setFilterValue("all")}
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#filterModal"
                      className="btn btn-link p-0"
                    > <svg
                        width="16"
                        height="13"
                        viewBox="0 0 16 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      > <path
                          d="M0.5 1.59025L0.5 0.6C0.5 0.268629 0.768629 0 1.1 0L14.9 0C15.2314 0 15.5 0.268629 15.5 0.6V1.59025C15.5 1.76301 15.4255 1.92739 15.2957 2.04131L9.70435 6.94576C9.57447 7.05968 9.5 7.22406 9.5 7.39682V11.2136C9.5 11.435 9.37808 11.6384 9.18283 11.7428L7.38283 12.7049C6.98314 12.9185 6.5 12.6289 6.5 12.1757L6.5 7.39682C6.5 7.22406 6.42553 7.05968 6.29565 6.94576L0.704347 2.04131C0.574469 1.92739 0.5 1.76301 0.5 1.59025Z"
                          fill="#18213A"
                        /> </svg>
                    </button>
                          <span
                            onClick={() => setFilterValue("all")}
                      data-bs-toggle="modal"
                      data-bs-target="#filterModal"
                    > Filters </span>
                    <button
                      // onClick={() => setFilterValue("sports")}
                      data-bs-toggle="modal"
                      data-bs-target="#sortModal"
                      type="button"
                      className="btn btn-link p-0"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M12.9697 4.37115L12.9697 16.3105L11.4697 16.3105L11.4697 4.37115L9.75 6.09082L8.68934 5.03016L12.2197 1.49983L15.75 5.03016L14.6893 6.09082L12.9697 4.37115Z"
                          fill="#18213A"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M5.03033 13.4394L5.03033 1.5H6.53033L6.53033 13.4394L8.25 11.7197L9.31066 12.7804L5.78033 16.3107L2.25 12.7804L3.31066 11.7197L5.03033 13.4394Z"
                          fill="#18213A"
                        />
                      </svg>
                    </button>
                  </div>
                  {/* start modal */}
                  <div
                    className="modal fade"
                    id="sortModal"
                    tabIndex={-1}
                    aria-labelledby="sortModalLabel"
                    aria-hidden="true"
                  >
                    <div
                      className={`modal-dialog ${
                        filterValue === "all" ? "modal-all" : "align-items-end"
                      }  modal-filter modal-lg modal-dialog-centered modal-sort`}
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="sortModalLabel"> Sort by{" "} </h5>
                          <button
                            ref={btnSoftByRef}
                            type="button"
                            className="btn btn-link text-decoration-none"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          > {" "} Close </button>
                        </div>
                        <div className={`modal-body filter-custom`}>
                          <div className="position-relative">
                            <div className=" col-lg-2 col-md-2 g-0 ">
                              <div className="shop__sidebar mt-3">
                                <div className="sidebar__categories">
                                  <div className="section-title">
                                    <SortMobile
                                      className="section-title-item"
                                      onChange={onChangeSort}
                                      value={sortCards} options={MetaData.sort_card_in_profile} 
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="modal fade"
                    id="filterModal"
                    tabIndex={-1}
                    aria-labelledby="filterModalLabel"
                    aria-hidden="true"
                  >
                    <div
                      className={`modal-dialog ${
                        filterValue === "all" ? "modal-all" : "align-items-end"
                      }  modal-filter 
                            modal-lg modal-dialog-centered ${
                              filterValue === "sports" ? "modal-sport" : ""
                            }
                            ${filterValue === "years" ? "modal-year" : ""} 
                            ${
                              filterValue === "collections"
                                ? "modal-collection"
                                : ""
                            } 
                            ${
                              filterValue === "publishers"
                                ? "modal-publisher modal-publisher-profile "
                                : ""
                            }
                            ${
                              filterValue === "grades"
                                ? "modal-grade modal-grade-profile "
                                : ""
                            }
                            `}
                    >
                      <div className="modal-content cccc">
                        <div className="modal-header">
                          {/* <div className="d-none">
                            {renderLengthFilterMobile()}
                          </div> */}
                          <h5 className="modal-title" id="filterModalLabel">
                            {renderTitleFilterMobile()}{" "}
                            <span
                            >
                              {filterValue==="all" ? 6 : lengthFilter}
                            </span>
                          </h5>
                          <button
                            ref={buttonRef}
                            type="button"
                            className="btn btn-link text-decoration-none"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          >
                            {" "}
                            Close
                          </button>
                        </div>
                        <div
                          className={`modal-body ${
                            filterValue !== "all" ? "filter-custom" : ""
                          }`}
                        >
                          <div className="position-relative">
                            <div className=" col-lg-2 col-md-2 g-0 border-end">
                              <div className="shop__sidebar mt-3">
                                <div className="sidebar__categories">
                                  <div className="section-title">
                                  <div
                                      className={`accordion ${
                                        filterValue === "sports" ||
                                        filterValue === "all"
                                          ? ""
                                          : "d-none"
                                      }`}
                                      id="sportFilter"
                                    > 
                                            <div className="accordion-item">
                                       
                                        <CheckBoxMobile
                                          ref={sportRef}
                                          isChangeValue={false}
                                          onChange={onChangeFilter}
                                          isSearch={sumBy(filters.sports, function (o: any) { return o.options?.length ?? 1; }) > 15}
                                          name="sports"
                                          options={filters.sports}
                                          title="Sport"
                                          isButton={filterValue === "all"}
                                          numberFilter={
                                            filterData?.sports?.length
                                          }
                                          setIsScroll={setIsScroll}
                                          filterValue={filterValue}
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className={`accordion ${
                                        filterValue === "publishers" ||
                                        filterValue === "all"
                                          ? ""
                                          : "d-none"
                                      }`}
                                      id="publisherFilter"
                                    >
                                      <div className="accordion-item">
                                        <CheckBoxMobile
                                          ref={publisherRef}
                                          isChangeValue={false}
                                          onChange={onChangeFilter}
                                          isSearch={sumBy(filters.publishers, function (o: any) { return o.options?.length ?? 1; }) > 15}
                                          name="publishers"
                                          options={filters.publishers}
                                          title="Publisher"
                                          isButton={filterValue === "all"}
                                          numberFilter={
                                            filterData?.publishers?.length
                                          }
                                          setIsScroll={setIsScroll}
                                          filterValue={filterValue}
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className={`accordion ${
                                        filterValue === "years" ||
                                        filterValue === "all"
                                          ? ""
                                          : "d-none"
                                      }`}
                                      id="yearsFilter"
                                    >
                                      <div className="accordion-item">
                                        <CheckBoxMobile
                                          ref={yearRef}
                                          isChangeValue={false}
                                          onChange={onChangeFilter}
                                          isSearch={sumBy(filters.years, function (o: any) { return o.options?.length ?? 1; }) > 15}
                                          name="years"
                                          options={filters.years}
                                          title="Year"
                                          isButton={filterValue === "all"}
                                          numberFilter={
                                            filterData?.years?.length
                                          }
                                          setIsScroll={setIsScroll}
                                          filterValue={filterValue}
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className={`accordion ${
                                        filterValue === "collections" ||
                                        filterValue === "all"
                                          ? ""
                                          : "d-none"
                                      }`}
                                      id="collectionsFilter"
                                    >
                                      <div className="accordion-item">
                                        <CheckBoxMobile
                                          ref={setRef}
                                          isChangeValue={false}
                                          onChange={onChangeFilter}
                                          name="collections"
                                          isSearch={sumBy(filters.collections, function (o: any) { return o.options?.length ?? 1; }) > 15}
                                          options={filters.collections}
                                          title="Collection"
                                          isButton={filterValue === "all"}
                                          numberFilter={
                                            filterData?.collections?.length
                                          }
                                          setIsScroll={setIsScroll}
                                          filterValue={filterValue}
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className={`accordion ${
                                        filterValue === "grades" ||
                                        filterValue === "all"
                                          ? ""
                                          : "d-none"
                                      }`}
                                      id="gradeFilter"
                                    >
                                      <div className="accordion-item">
                                        <CheckBoxMobile
                                           ref={gradeRef}
                                           isMultipleLv={true}
                                           onChange={onChangeFilter}
                                           isChangeValue={false}
                                           name="grades"
                                           isSearch={sumBy(filters.grades, function (o: any) { return o.options?.length ?? 1; }) > 15}
                                           options={filters.grades ?? []}
                                          title="Grade"
                                          isButton={filterValue === "all"}
                                          numberFilter={
                                            filterData?.grades?.length
                                          }
                                          setIsScroll={setIsScroll}
                                          filterValue={filterValue}
                                        />
                                      </div>
                                    </div>  
                                    <div
                                      className={`accordion ${
                                        filterValue === "auto_memo" ||
                                        filterValue === "all"
                                          ? ""
                                          : "d-none"
                                      }`}
                                      id="auto_memoFilter"
                                    >
                                      <div className="accordion-item">
                                        <CheckBoxMobile
                                          ref={automemoRef}
                                          isChangeValue={false}
                                          name="auto_memo"
                                          onChange={onChangeFilter}
                                          isSearch={sumBy(filters.auto_memo, function (o: any) { return o.options?.length ?? 1; }) > 15}
                                          options={filters.auto_memo}
                                          title="Autograph/Memorabilia"
                                          isButton={filterValue === "all"}
                                          numberFilter={
                                            filterData?.auto_memo?.length
                                          }
                                          setIsScroll={setIsScroll}
                                          filterValue={filterValue}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {isScroll && renderButtonClear()}
                            {resetFilterMobileUI()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end modal */}
                </div>
              </div>
            </>}

              </div>
            </div>
            <div className="d-flex mb-39 container-collection-profile-info">
              <div className="d-flex align-items-center container-collection-profile-info__report">
                <div className="me-2 fz-14"> {renderTotal()} </div>
              </div>
              <div className="only-mobile">
                <div className="d-flex justify-content-end container-collection-profile-info__group">
                  <div className="d-flex btn-group-card">
                    <button type="button" onClick={() => setIsInline(prevState => !prevState)} className={` ${!isInline ? "active" : ""} ms-2 btn btn-outline-secondary p-0 btn-mul-dot`}>
                      <IconDotMoBile isActive={!isInline ? true : false} />
                    </button>
                    <button type="button" onClick={() => {
                      setIsInline(prevState => !prevState)
                      setIsSelect(false)
                    } } className={` ${isInline ? "active" : ""} ms-2 btn btn-outline-secondary`}>
                      {/* <i className="fa fa-list" aria-hidden="true"></i> */}
                      <ListLine />
                    </button>
                  </div>
                  {isSelectCard && <div>
                    <button type="button"
                  onClick={onHandleMode}
                  disabled={isInline && !cardSelected.length}
                  className={`ms-2  ${isInline && !cardSelected.length ? "opacity-50" : "opacity-100"}  btn btn-outline-secondary btn-search-plus ${isSelect ? "active" : ""} d-flex justify-content-center align-items-center`}>
                  {isSelect ? <IconMinis /> : <IconPlus />}
                </button>
                  </div>}
                </div>
              </div>
            </div>
            <Cards<CardModel>
              isCheckAll={isCheckAll}
              onClear={onClear}
              onSelectAll={onSelectAll}
              isTable={true}
              isInline={isInline}
              sortCards={sortCards}
              onSortTable={onSortTable}
              cardElement={
                (item: CardModel) => {
                  return (
                    <CardElement
                      onAddCollection={() => onAddCollection(item)}
                      valueName="portid"
                      isTable={true}
                      isInline={isInline}
                      cardSelected={cardSelected}
                      onSelectItem={onSelectItem}
                      isSelect={isSelect}
                      isEditCard={isEditCard}
                      onEditNote={onEditNote}
                      key={item.portid}
                      item={item}
                      onAddWishList={()=> onAddWishList(item)}
                      onRemoveWishlist={onRemoveWishlist}
                      isWishlist={table !== 'portfolio' && !isFriend}
                      onAddNewEntry={onAddNewEntry}
                    />
                  );
                }
              }
              onLoadMore={onLoadMore}
              isLoading={data.isLoading}
              isLoadMore={false}
              cards={data.cards}
            />
            <div className={`${!data.isLoading && Boolean(data.rows) ? "": "d-none"}`}>
              {
										
                    Boolean(pagesSelected[pagesSelected.length - 1] < (Math.ceil(
                      (data?.rows ?? 0) / rowsPerPage
                    )))  && (
                    <div className="d-flex justify-content-center">
                      <button
                      onClick={onLoadMore}
                      type="button"
                      className="btn btn-light load-more"
                      >
                      Load More
                      </button>
                    </div>
                    )
                    }
              <div className="d-flex justify-content-center mt-3">
              <Pagination pagesSelected={pagesSelected} onSelectPage={handlePageClick} totalPage={Math.ceil((data.rows ?? 0) / rowsPerPage)} />
              </div>
            </div>
            {isEditCard && <EditNote
              isOpen={isOpen}
              cardDetail={cardDetail}
              onSuccess={onSuccessUpdateNote}
              onClose={() => setIsOpen(false)}
            />}
                <LoginModal
                  onSuccess={() => {
                    setIsOpenLogin(false);
                    if (cardData) {
                      setIsOpenWishList(true)
                    } else {
                      setIsShow(true)
                    }
                  }}
                  isOpen={isOpenLogin}
              onClose={() => setIsOpenLogin(false)}
            />
          {!isFriend &&  
            <Collection
              onConfirmRemove={()=> {setIsOpenModalDelete(true); setIsOpenEdit(false)}}
              collectionDetail={collectionDetail}
              onSuccess={onCreateSuccess}
              table={table}
              isOpen={isOpenEdit}
              title={title}
              onClose={() => onHandleModal(false)}
            />}  
            <ChosseCollection
              selectCollection={selectWishlist}
              table="wishlist"
              title="wishlist"
              isOpen={isOpenWishList}
              setIsOpen={setIsOpenWishList}
            />
            <ModalDeleteCollection
              isOpen={isOpenModal}
              title={`Are you sure you want to remove ${cardSelected.length} selected cards from the ${table ==="wishlist" ? "wishlist": t('portfolio.text_normal')}?`}
              onClose={() => setIsOpenModal(false)}
              onSuccess={()=> onRemoveCard()}
            />
             <ModalDeletePortfolio
              title={`Confirm removing by entering “delete” in the field below`}
              subTitle={`Deleting your ${title ==="wishlist" ? "wishlist": t('portfolio.text_normal')} data is permanent and cannot be undone. All cards that are grouped in <span class="text-color-portfolio">${data.group_name ?? ''}</span> ${title ==="wishlist" ? "wishlist": t('portfolio.text_normal')} will be deleted.`}
              textAction={`Type “delete” below to verify that you want to delete this ${title === "wishlist" ? "wishlist" : t('portfolio.text_normal')}`}
              textErrorNotMatch={`Type “delete” to verify that you want to delete this ${title === "wishlist" ? "wishlist" : t('portfolio.text_normal')}`}
              isOpen={isOpenModalDelete}
              onClose={() => {setIsOpenModalDelete(false); setIsOpenEdit(true)}}
              onSuccess={() => { removeCollection(); }}
            />
            {
              cardData && <SelectGrading
                wishList={wishList}
                cardData={cardData}
                isOpen={isOpenGrade}
                onSuccess={onSuccessWhistList}
                setIsOpen={setIsOpenGrade}
              />
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(CardListCollection);
