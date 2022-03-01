import React, { useEffect, useState, useRef } from "react";
import queryString from 'query-string';
import { api } from 'configs/axios';
import { FilterType, SelectDefultType, FilyerCollection, ManageCollectionType } from "interfaces"
import Cards from "components/cards"
import { rowsPerPage } from "configs/common"
import { FilterHandle } from "components/filter/customCheckBox"
import CheckBoxDesktop from "components/filter/checkBoxDesktop"
import SortMobile from "components/filter/sortMobile"
import CheckBoxMobile from "components/filter/checkBoxMobile"
import CardElement from "components/cards/cardNode"
import { CardModel } from "model/data_sport/card_sport";
import { useDispatch, useSelector } from "react-redux";
import { FilterAction } from "redux/actions/filter_action";
import Selectors from "redux/selectors";
import { isEmpty, chain, pull, sumBy } from "lodash";
import { MetaData } from "utils/constant";
import { convertListDataToGrouped, formatNumber, isFirefox } from "utils/helper";
import { useRouter } from 'next/router'
import Select from 'react-select'
import FilterSport from "components/filter/filterSport"
import ChosseCollection from "components/modal/chosseCollection";
import SelectGrading from "components/modal/selectGrading";
import IconList from "assets/images/List.png";
import ButtonClear from "assets/images/icon-remove.svg";
import LoginModal from "components/modal/login"
import IconPlus from "components/icon/iconPlus"
import IconMinis from "components/icon/iconMinis"
import IconDotMoBile from "components/icon/iconDotMoBile";
import IconLineMoBile from "components/icon/listLineMoBileSearch";
// @ts-ignore
import $ from "jquery";
import useWindowDimensions from "utils/useWindowDimensions"
import Pagination from "components/panigation";
import IconCloseMobile from "assets/images/close_mobile.svg";
import CaptCha from "components/modal/captcha";
import { useTranslation } from "react-i18next";

const defaultSort: SelectDefultType = {
  value: 1,
  label: "Most Popular",
  sort_value: "count",
  sort_by: "desc",
}

type PropTypes = {
  location: any,
}

type DataLoadType = {
  cards: CardModel[],
  isLoading: boolean,
  // isLoadMore: boolean,
  // page: number,
  rows?: number
}

type PrioritizeType = {
  name: string,
  isChange: boolean,
}

const CardList = (props: PropTypes) => {
  const { width } = useWindowDimensions();
  const { loggingIn, userInfo} = useSelector(Selectors.auth);
  const router = useRouter();
  const [isFirst, setIsFirst] = useState<boolean>(false)
  const [cardSelected, setCardSelected] = useState<Array<string | number>>([]);
  const publisherRef = React.useRef<FilterHandle>(null);
  const yearRef = React.useRef<FilterHandle>(null);
  const setRef = React.useRef<FilterHandle>(null);
  const automemoRef = React.useRef<FilterHandle>(null);
  const typeRef = React.useRef<FilterHandle>(null);
  const colorRef = React.useRef<FilterHandle>(null);
  const printRunRef = React.useRef<FilterHandle>(null);
  const sportRef = React.useRef<FilterHandle>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false);
  const [sortCards, setSortCards] = useState<SelectDefultType>(defaultSort);
  const [isSelect, setIsSelect] = useState<boolean>(false);
  const [isInline, setIsInline] = useState<boolean>(false);
  const [prioritize, setPrioritize] = useState<Array<PrioritizeType>>([]);
  const [isOpenWishList, setIsOpenWishList] = React.useState(false);
  const [isOpenGrade, setIsOpenGrade] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [lengthFilter, setLengthFilter] = useState<number>(1)
  const [data, setData] = useState<DataLoadType>({
    cards: [],
    isLoading: true,
    // isLoadMore: false,
    // page: 1,
    rows: 0
  })
  const [wishList, setWishList] = React.useState<
    ManageCollectionType | undefined
  >();
  const [filterCollection, setFilterCollection] = useState<FilyerCollection>({
    type: [],
    color: [],
  })
  const query: any = router.query
  const [filterData, setFilterData] = useState<{ [key: string]: Array<FilterType> } | undefined>(undefined);
  const dispatch = useDispatch();
  const filters = useSelector(Selectors.filter);
  const [dataFilterState, setDataFilterState] = useState<any>([]);
  const [cardData, setCardData] = useState<CardModel | undefined>()
  const { sports } = useSelector(Selectors.config);
  const [isChangeRouter, setIsChangeRouter] = useState<boolean>(false)
  const [filterValue, setFilterValue] = useState<string>("");
  const [pagesSelected, setPagesSelected] = useState<Array<number>>([1]);
  const [isScroll, setIsScroll] = useState<boolean>(false);
  const [isCaptCha, setIsCaptCha] = useState<boolean>(false);
  const [t, i18n] = useTranslation("common")
  useEffect(() => {
    setPrioritize([])
    resetPage(true);
    localStorage.setItem("url-search", `${location.pathname}${location.search}`)
  }, [router.query])

  const resetPage = (isChange: boolean = false) => {

    if (!(isEmpty(filterData) || filterData === undefined)) {
      // @ts-ignore
      setFilterData({ isLoad: false })
    }
    setPagesSelected([1])
    getListCard([1], isChange, false)
    resetFilter();
  }

  const getFilterSearch = () => {
    let params: any = {}
    const filterOld = { ...filterData };
    if (filterOld.isLoad !== undefined) {
      delete filterOld.isLoad
    }
    for (const [key, value] of Object.entries(filterOld ?? {})) {
      // @ts-ignore
      const arrayValue = value.map(item => {
        if (key === "publisher" || key === "set") {
          return item.name;
        }
        return item.id
        // @ts-ignore
      }).sort((a, b) => a - b);
      if (key === "printRun") {
        if (value.length) {
          params.printRun = [
            [
              arrayValue.includes(1),
              arrayValue.includes(2)
            ]]

          if (arrayValue.includes(3)) {
            params.printRun.push(
              [
                null,
                1
              ],
            )
          }
          if (arrayValue.includes(4)) {
            params.printRun.push(
              [
                2,
                24
              ],
            )
          }
          if (arrayValue.includes(5)) {
            params.printRun.push(
              [
                25,
                99
              ],
            )
          }
          if (arrayValue.includes(6)) {
            params.printRun.push(
              [
                100,
                299
              ],
            )
          }
          if (arrayValue.includes(7)) {
            params.printRun.push(
              [
                299,
                null
              ]
            )
          }
        }
      }
      else
        if (key === "sport" && arrayValue[0] === "all") {
          params[key] = undefined
        }
        else {
          params[key] = arrayValue?.length ? arrayValue: undefined
        }
    }
    return params
  }

  const getListCard = async (page = [1], isChange: boolean = false, isFilter = true, headers: any = {}) => {
    if (page[page.length-1] === 1) {
      // dispatch(FilterAction.updateFiltersCardDetail({
      //   collections: [],
      //   auto_memo: [],
      //   printRuns: [],
      //   publishers: [],
      //   years: [],
      //   sports: [],
      //   grades: [],
      // }));
    }
    if (!isFirst) {
      setIsFirst(true)
    }
    try {
      setData(prevState => {
        return { ...prevState, isLoading: true, cards: page.length ===1 ? [] : [...prevState.cards] };
      });

      let params: any = {
        // search_term: query.search_term
      };
      if (query.sport || query?.sport_criteria) {
        params.sport = +(query?.sport ?? query?.sport_criteria);
      }

      if (isEmpty(query)) {
        params.sport = +(userInfo?.userDefaultSport ?? 1)
      }

      if (query.q ) {
        params.search_term = query.q;
      }
      if (!isEmpty(filterData) && isFilter) {
        params.filter = getFilterSearch();
      }
      if (params.filter?.sport?.length) {
        params.sport = params.filter?.sport[0]
        delete params.filter?.sport
      }
      if (params.sport === +query?.sport_criteria || isEmpty(params)) {
        params.search_criteria = {
          playerName: query.q,
          // sport: query?.sport_criteria,
          publisher: query?.publisher,
          set: query?.set,
          year: query?.year,
        }
      }
      const paramsFilter = { ...params }
      params = {
        ...params,
        page: page[page.length-1],
        limit: rowsPerPage,
        currency: "USD",
        sort_dict: {
          sort_value: sortCards?.sort_value,
          sort_by: sortCards?.sort_by
        }
      }
      const result = await api.v1.elasticSearch.searchCard(params, headers);
      if (page[page.length - 1] === 1) {
        // @ts-ignore
        dispatch(FilterAction.getFiltersCardDetail(paramsFilter, setDataFilterState));
        if (isChange) {
          setIsChangeRouter(isChange)
        }
      }
      if (result.success) {
        if (page.length === 1) {
          return setData({
            cards: result.data,
            isLoading: false,
            rows: result.rows
          })
        }
        return setData(prevState => {
          return {
            ...prevState,
            cards: [...prevState.cards, ...result.data],
            isLoading: false,
            rows: result.rows
          };
        });

      }
      setIsCaptCha(Boolean(result?.show_captcha) )
      setData(prevState => {
        return { ...prevState, isLoading: false, isLoadMore: false, rows: 0};
      });
    }
    catch (err) {
      setData(prevState => {
        return { ...prevState, isLoading: false, isLoadMore: false, rows: 0};
      });
    }
  }

  const onSuccessCaptcha = (token: any) => {
    setIsCaptCha(false)
    const headers = { "captcha-token": token };
    getListCard([1], true, false, headers)

  }

  const onLoadMore = () => {
    if (pagesSelected[pagesSelected.length-1] + 1 <= (Math.ceil((data.rows ?? 0) / rowsPerPage))) {
      getListCard([...pagesSelected, pagesSelected[pagesSelected.length-1]+1], false)
      // setCurrentPage(currentPage + 1);
      setPagesSelected([...pagesSelected, pagesSelected[pagesSelected.length-1]+1])
    }
  }

  const onChangeSort = (e: any) => {
    setSortCards(e)
  }

  const getFilterCollection = async () => {
    try {
      const result = await api.v1.getFilterCollection({ set_id: filterData?.set.map(item => item.id) });
      result.data.type = convertListDataToGrouped(result.data.type, FilterType.firstLetter, (item1, item2) => {
        return item1.name.localeCompare(item2.name);
      })
      setFilterCollection(result.data)
    }
    catch (err) { }
  }

  useEffect(() => {
    if (!isEmpty(filters.years) && isFirst) {
      if (filterData?.set) {
        getFilterCollection()
      }
      // @ts-ignore
      if (filterData?.isLoad !== false) {
        setPagesSelected([1])
        getListCard()
      }
    }
  }, [filterData])

  useEffect(() => {
    if (!isEmpty(filters.years) && isFirst) {
      setPagesSelected([1])
      getListCard()
    }
  }, [sortCards])

  const refModal = useRef();
  const onChangeFilter = (e: any, key: string) => {
    
    let dataSave = [...prioritize];
    if (!prioritize.find(item => item.name === key)) {
      setPrioritize(prevState => [...prevState.map(item => ({ ...item, isChange: false })), { name: key, isChange: true }])
    } else {
      if (prioritize[prioritize.length - 1].name === key && e.length === 0) {

        dataSave = dataSave.filter(item => item.name === key ? ({...item, isChange: false}): item);
        if (dataSave.length) {
          dataSave[dataSave.length - 1] = {
            name: dataSave[dataSave.length - 1].name,
            isChange: true
          }
        }
        setPrioritize(dataSave)
      }
      else {
        dataSave = [...prioritize];
        dataSave = dataSave.map(item => item.name === key ? { ...item, isChange: true } : { ...item, isChange: false });
        setPrioritize(dataSave)
      }
    }

    let i = 0;
    dataSave?.forEach(function (item, index) {
      if (item.isChange) {
        i = index;
      }
    })
    let dataFiler = dataSave?.filter((item, index) => index <= i).map(item => item.name);
   
    let params = {};
    for (const element of dataFiler) {
      // @ts-ignore
      params[element] = filterData?.[element]
    }
    if (key === "set") {
      typeRef?.current?.reset();
      colorRef?.current?.reset();
      // @ts-ignore
      return setFilterData({ ...params, [key]: e, type: [], color: [], isLoad: true });
    }
    if (key === "type") {
      colorRef?.current?.reset();
      // @ts-ignore
      return setFilterData({ ...params, [key]: e, color: [], isLoad: true });
    }
    // @ts-ignore
    setFilterData({ ...params, [key]: e, isLoad: true });

  }

  const removeFilter = (item: FilterType, key: string) => {
    if (key === "set") {
      typeRef?.current?.reset();
      colorRef?.current?.reset();
      const collectionValue = filterData?.set?.filter(collection => collection.id !== item.id);
      setRef?.current?.reset(collectionValue);
      // @ts-ignore
      return setFilterData(prevState => {
        return {
          ...prevState,
          set: collectionValue,
          type: [],
          color: [],
          isLoad: true
        }
      })
    }
    if (key === "type") {
      colorRef?.current?.reset();
      const typeValue = filterData?.type?.filter(type => type.id !== item.id);
      typeRef?.current?.reset(typeValue);
      // @ts-ignore
      return setFilterData(prevState => {
        return {
          ...prevState,
          type: typeValue,
          color: [],
          isLoad: true
        }
      })
    }
    const values = filterData?.[key]?.filter(data => data.id !== item.id);
    switch (key) {
      case "auto_memo":
        automemoRef?.current?.reset(values)
        break;
      case "printRun":
        printRunRef?.current?.reset(values);
        break;
      case "publisher":
        publisherRef?.current?.reset(values);
        break;
      case "year":
        yearRef?.current?.reset(values);
        break;
      default:
      // code block
    }
    // @ts-ignore
    return setFilterData(prevState => {
      return {
        ...prevState,
        [key]: values,
        isLoad: true
      }
    })
  }

  const handleOptionsPrintRun = () => {
    const maxValue = Math.max(...filters.printRuns);
    const minValue = Math.min(...filters.printRuns);
    const data = MetaData.printRun.filter((e) => {
      if (e.id === 1) {
        return maxValue > 0
      }
      if (e.id === 2) {
        return minValue === 0;
      }
      if (e.id === 3) {
        return filters.printRuns.find((num) => num === 1)
      }
      if (e.id === 4) {
        return maxValue >= 2
      }
      if (e.id === 5) {
        return maxValue >= 25
      }
      if (e.id === 6) {
        return maxValue >= 100
      }
      if (e.id === 7) {
        return maxValue > 299
      }
    })

    return data;
  }

  const handleOptionsParallel = () => {
    let options: Array<FilterType> = [];
    if (filterData?.type?.length) {
      // @ts-ignore
      options = filterCollection.color.filter(item => filterData.type?.map(type => type.id).includes(item.typeID))
      options = chain(options)
        .groupBy("code")
        .map((value, key) => ({ id: key, value: value[0].id, name: `${value.length > 2 ? value[0].name + " - Various Print Runs" : value[0].name}` }))
        .value()
    }
    return options;
  }

  const optionsPrintRun = React.useMemo(() => handleOptionsPrintRun(), [filters.printRuns]);
  const optionsParallel = React.useMemo(() => handleOptionsParallel(), [filterData?.type]);

  const resetFilter = () => {
    publisherRef?.current?.reset();
    yearRef?.current?.reset();
    setRef?.current?.reset();
    automemoRef?.current?.reset();
    typeRef?.current?.reset();
    colorRef?.current?.reset();
    printRunRef?.current?.reset();
    sportRef?.current?.reset()
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
    setCardSelected([...data.cards?.map(item => item.code)]);
  }
  const onClear = () => {
    setCardSelected([]);
  }

  const checkFilter = (obj: { [key: string]: Array<FilterType> }) => {
    for (var key in obj) {
      // @ts-ignore
      if (obj[key]?.length && key !== "sport")
        return false;
    }
    return true;
  }

  const selectWishlist = (item: ManageCollectionType) => {
    setWishList(item);
    setIsOpenWishList(false);
    setIsOpenGrade(true);
  };

  const onAddWishList = (item: CardModel) => {
    setCardData(item)
    if (loggingIn) {
      setIsOpenWishList(true)
    }
    else {
      setIsOpenLogin(true);
    }
  }

  const selectCollection = (item: ManageCollectionType) => {
    router.push(
      `/collections-add-card?collection=${item.group_ref}&code=${cardSelected.toString()}`
    );
  };

  const renderSportName = () => {
    const sportName = sports.find(item => item.id === +(query?.sport ?? query.sport_criteria));
    return query.q && ((filterData?.sport?.[0]?.name && filterData?.sport?.[0]?.name !== "All") || sportName) && <>in <span onClick={() => router.push(`/search?sport_criteria=${filterData?.sport?.[0]?.id ?? sportName?.id}`)} className="sport-name cursor-pointer">“{filterData?.sport?.[0]?.name ?? sportName?.sportName}”</span></>
  }

  const renderTitle = () => {
    const sportName = sports.find(item => item.id === +(query?.sport ?? query.sport_criteria));
    return query.q ? `“${query.q}”` : filterData?.sport?.[0]?.name ?? sportName?.sportName
  }

  React.useEffect(() => {
    if (isChangeRouter && filters.years.length && filters.publishers.length) {
      const params: any = {};
      let prioritizeState: any = [];
      const sportState = filters?.sports?.find(item => item.id === +query?.sport_criteria);
      if (sportState) {
        params.sport = [sportState]
        // @ts-ignore
        prioritizeState = prioritizeState.map(item => ({ ...item, isChange: false }));
        prioritizeState.push({ name: 'sport', isChange: true })
      }
      // @ts-ignore
      let publisherState = dataFilterState?.publishers?.find(publisher => publisher?.name === query?.publisherName);
      if (publisherState) {
        params.publisher = [publisherState];
        // @ts-ignore
        prioritizeState = prioritizeState.map(item => ({ ...item, isChange: false }));
        prioritizeState.push({ name: 'publisher', isChange: true })
        publisherRef?.current?.reset([publisherState]);
      }
      const yearState = filters?.years?.find(item => item?.name === query?.year);
      if (yearState) {
        params.year = [yearState]
        if (prioritizeState.length) {
          prioritizeState[0].isChange = false;
        }
        yearRef?.current?.reset([yearState]);
        prioritizeState.push({ name: 'year', isChange: true })
      }

      // @ts-ignore
      let collectionState = dataFilterState?.collections?.find(col => col.name === query?.setName);
      if (collectionState) {
        params.set = [collectionState];
        // @ts-ignore
        prioritizeState = prioritizeState.map(item => ({ ...item, isChange: false }));
        prioritizeState.push({ name: 'set', isChange: true })
        setRef?.current?.reset([collectionState]);
      }
      if (isEmpty(query)) {
        const sportDeafult = filters?.sports?.find(item => item.id === (userInfo?.userDefaultSport ?? 1));
        params.sport = [sportDeafult];
        prioritizeState.push({ name: 'sport', isChange: true })
      }
      params.isLoad = false;
      setIsChangeRouter(false)
      setPrioritize(prioritizeState)
      setFilterData(params)

    }

  }, [filters.years, filters.publishers, isChangeRouter, filters.collections, filters.sports])

  const resetFilterUI = () => {
    const filterOld = { ...filterData };
    if (filterOld.isLoad !== undefined) {
      delete filterOld.isLoad
    }
    return <>
      {Boolean(!checkFilter(filterOld ?? {})) && <div
        onClick={() => resetPage(false)}
        className="mb-2 cursor-pointer d-flex ms-2 ps-2 pe-2 cus btn-reset-collection">
        <div>Reset Filters</div>
      </div>}
      {Object.keys(filterOld ?? {}).map((key, index) => {
        if (key === "sport") return null;
        return <React.Fragment key={index}>{filterOld?.[key].map((item, i) =>
          <div key={item.id} className="d-flex align-items-center ms-2 mb-2 btn-clear">
            <div className="btn-text-clear">{item.name}</div>
            <button type="button" onClick={() => removeFilter(item, key)} className="btn--hidden">
              <img src={ButtonClear} alt="" />
            </button>
          </div>)}</React.Fragment>
      })}
    </>
  }

   const resetFilterUIMobile = () => {
    const filterOld = { ...filterData };
    if (filterOld.isLoad !== undefined) {
      delete filterOld.isLoad
    }
    return <>
      {Boolean(!checkFilter(filterOld ?? {})) && <button
          onClick={() => resetPage(false)}
          className="btn btn-primary clear-select">
          Reset Filters
      </button>}
     
    </>
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
      getListCard(event, false)
    }, 550);
  }

  const handleScroll = () => {
    var scrollTop = $(window).scrollTop();
    const stickyData = $(".p-sticky-header").offset();
    if (stickyData) {
      const divOffset = stickyData.top;
      const dist = divOffset - scrollTop;
      if (dist === 0) {
        $(".action-list").addClass("d-none");
      } else {
        $(".action-list").removeClass("d-none");
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const renderTotal = () => {
    return <> {data.isLoading ? "-" : data.cards.length ? <span className="number">{(pagesSelected[0] - 1) * rowsPerPage + 1}</span> : 0}-{data.isLoading ? "-" : <span className="number">{formatNumber((pagesSelected[pagesSelected.length-1] * rowsPerPage) > (data.rows ?? 0) ? data.rows : pagesSelected[pagesSelected.length-1] * rowsPerPage)}</span>} of {data.isLoading ? "-" : <span className="number">{formatNumber(data.rows)}</span>} results</>
  }

  const renderTitleFilterMobile = () => {
    switch (filterValue) {
      case "publisher":
        return "Publisher"
      case "year":
        return "Year"
      case "set":
        return "Collection"
      case "auto_memo":
        return "Autograph/Memorabilia"
      case "type":
        return "Base/Insert"
      case "color":
        return "Parallel"
      case "printRun":
        return "Print Run"
      case "sport":
        return "Sport"
      default:
        return "Filters"
    }
  }

  const renderLengthFilterMobile = () => {
    switch (filterValue) {
      case "publisher":
        return setTimeout(() => {
          setLengthFilter(publisherRef?.current?.getLengthOption() ?? 0) ;
        },350);
        
      case "year":
        return setTimeout(() => {
          setLengthFilter(yearRef?.current?.getLengthOption() ?? 0) ;
        },350);
      case "set":
        return setTimeout(() => {
          setLengthFilter(setRef?.current?.getLengthOption() ?? 0) ;
        },350);
      case "auto_memo":
        return setTimeout(() => {
          setLengthFilter(automemoRef?.current?.getLengthOption() ?? 0) ;
        },350);
      case "type":
        return setTimeout(() => {
          setLengthFilter(typeRef?.current?.getLengthOption() ?? 0) ;
        },350);
      case "color":
        return setTimeout(() => {
          setLengthFilter(colorRef?.current?.getLengthOption() ?? 0) ;
        },350);
      case "printRun":
        return setTimeout(() => {
          setLengthFilter(printRunRef?.current?.getLengthOption() ?? 0) ;
        },350);
      case "sport":
        return Boolean(query.q) ? "" : sumBy(filters.sports, function (o) { return o.options?.length ?? 1; })
      default:
        return !filterData?.set?.length ? 6 : (filterData?.set?.length && filterData?.type?.length) ? 8 : 7
    }
  }

  const renderButtonClear = () => {
    switch (filterValue) {
      case "publisher":
        return Boolean(filterData?.publisher?.length) ?
          <button
            onClick={() => {
              publisherRef?.current?.reset();
              // @ts-ignore
              return setFilterData(prevState => {
                return {
                  ...prevState,
                  publisher: [],
                  isLoad: true
                }
              })
            }}
            type="button"
            className="btn btn-primary clear-select"
          >Clear Selected ({filterData?.publisher?.length})</button> : ""
      case "year":
        return Boolean(filterData?.year?.length) ?
          <button
            onClick={() => {
              yearRef?.current?.reset();
              // @ts-ignore
              return setFilterData(prevState => {
                return {
                  ...prevState,
                  year: [],
                  isLoad: true
                }
              })
            }}
            type="button"
            className="btn btn-primary clear-select"
          >Clear Selected ({filterData?.year?.length})</button> : ""
      case "set":
        return Boolean(filterData?.set?.length) ?
          <button
            onClick={() => {
              setRef?.current?.reset();
              typeRef?.current?.reset();
              colorRef?.current?.reset();
              // @ts-ignore
              return setFilterData(prevState => {
                return {
                  ...prevState,
                  set: [],
                  type: [],
                  color: [],
                  isLoad: true
                }
              })
            }}
            type="button"
            className="btn btn-primary clear-select"
          >Clear Selected ({filterData?.set?.length})</button> : ""
      case "auto_memo":
        return Boolean(filterData?.auto_memo?.length) ?
          <button
            onClick={() => {
              automemoRef?.current?.reset();
              // @ts-ignore
              return setFilterData(prevState => {
                return {
                  ...prevState,
                  auto_memo: [],
                  isLoad: true
                }
              })
            }}
            type="button"
            className="btn btn-primary clear-select"
          >Clear Selected ({filterData?.auto_memo?.length})</button> : ""
      case "type":
        return Boolean(filterData?.type?.length) ?
          <button
            onClick={() => {
              typeRef?.current?.reset();
              // @ts-ignore
              return setFilterData(prevState => {
                return {
                  ...prevState,
                  type: [],
                  color: [],
                  isLoad: true
                }
              })
            }}
            type="button"
            className="btn btn-primary clear-select"
          >Clear Selected ({filterData?.type?.length})</button> : ""
      case "color":
        return Boolean(filterData?.color?.length) ?
          <button
            onClick={() => {
              colorRef?.current?.reset();
              // @ts-ignore
              return setFilterData(prevState => {
                return {
                  ...prevState,
                  color: [],
                  isLoad: true
                }
              })
            }}
            type="button"
            className="btn btn-primary clear-select"
          >Clear Selected ({filterData?.color?.length})</button> : ""
      case "printRun":
        return Boolean(filterData?.printRun?.length) ?
          <button
            onClick={() => {
              printRunRef?.current?.reset();
              // @ts-ignore
              return setFilterData(prevState => {
                return {
                  ...prevState,
                  printRun: [],
                  isLoad: true
                }
              })
            }}
            type="button"
            className="btn btn-primary clear-select"
          >Clear Selected ({filterData?.printRun?.length})</button> : ""
      default:
        return ""
    }
  }

  const resetFilterMobileUI = () => {
    if(filterValue!=="all") return null;
    const filterOld = { ...filterData };
    if (filterOld.isLoad !== undefined) {
      delete filterOld.isLoad
    }
    return <>
      {Boolean(!checkFilter(filterOld ?? {})) && <div
        onClick={() => resetPage(false)}
        className="btn btn-primary clear-select">
        <div>Reset Filters</div>
      </div>}

    </>
  }

  const renderResetFilter = () => {
    if(filterValue!=="all") return null;
    const filterOld = { ...filterData };
    if (filterOld.isLoad !== undefined) {
      delete filterOld.isLoad
    }
    return <>
      {Boolean(!checkFilter(filterOld ?? {})) && <button
        onClick={() => resetPage(false)}
        className="btn btn-primary clear-select">
        Reset Filters
      </button>}
    </>
  }

  const renderNumberFilter = () => {
    const filterOld = { ...filterData };
    if (filterOld.isLoad !== undefined) {
      delete filterOld.isLoad
    }
    if (filterOld.sport) {
      delete filterOld.sport
    }
    return <>
      {Boolean(!checkFilter(filterOld ?? {})) &&  <span className="filter-number">{Object.values(filterOld).flat().length}</span> }
    </>
  }
  const onHandleMode = () => {
    if (!isInline) {
      return setIsSelect(prevState => !prevState)
    }
    if (isSelect) {
      setIsSelect(false)
    }
  }

  const defaultValueSport = () => {
    if (isEmpty(query)) {
      return userInfo?.userDefaultSport ?? 1
    }
  return +(query?.sport ?? query?.sport_criteria)
  }

  const onUpdateWishList = (code: string) => {
    // @ts-ignore
    setData(prevState => {
      return { ...prevState, cards: prevState.cards?.map(item=> item.code === code ? ({...item,wishlist: 1}): item )};
    });
  }

  return (
    <div className="container-fluid container-search-page">
       <CaptCha
        isOpen={isCaptCha}
        onSuccess={onSuccessCaptcha}
        onClose={() => setIsCaptCha(false)} />
      <div className="row">
        {
            //@ts-ignore
            width >= 768 &&
          <>
            <div className="col-lg-2 col-md-2 g-0 border-end">
              <div className="shop__sidebar mt-3">
                <div className={`sidebar__categories ${!data.cards.length && !data.isLoading ? "d-none": ""} `}>
                  <div className="section-title">
                    <div className="accordion" id="sportFilter">
                      <div className="accordion-item">
                        {!query.search_term && <h2 className="accordion-header">
                          <button
                            type="button"
                            className="accordion-button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapsesportFilter"
                          > Sport <span>{sumBy(filters.sports, function (o) { return o.options?.length ?? 1; })}</span> </button>
                        </h2>}
                        <div id="collapsesportFilter" className="accordion-collapse collapse show" data-bs-parent="#sportFilter">
                          <div >
                            <FilterSport
                              isAll={Boolean(query.q)}
                              isDefault={(Boolean(query.q) && !Boolean(query?.sport))}
                              // @ts-ignore
                              ref={sportRef}
                              onChange={onChangeFilter}
                              isSearch={false}
                              name="sport"
                              isCount={Boolean(query.q)}
                              defaultValue={defaultValueSport()}
                              options={filters.sports} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion" id="publisherFilter">
                      <CheckBoxDesktop
                        title="Publisher"
                        prioritize={prioritize}
                        ref={publisherRef}
                        onChange={onChangeFilter}
                        name="publisher"
                        options={filters.publishers}
                      />
                    </div>
                    <div className="accordion" id="YearFilter">
                      <CheckBoxDesktop
                        prioritize={prioritize}
                        ref={yearRef}
                        onChange={onChangeFilter}
                        name="year"
                        options={filters.years}
                        title="Year"
                      />
                    </div>
                    <div className="accordion" id="CollectionFilter">
                      <CheckBoxDesktop
                        title="Collection"
                        prioritize={prioritize}
                        ref={setRef}
                        onChange={onChangeFilter}
                        name="set"
                        options={filters.collections} />
                    </div>
                    <div className="accordion" id="auto_memoFilter">
                      <CheckBoxDesktop
                        title="Autograph/Memorabilia"
                        prioritize={prioritize}
                        ref={automemoRef}
                        name="auto_memo"
                        onChange={onChangeFilter}
                        isSearch={false}
                        options={filters.auto_memo} />
                    </div>
                    {Boolean(filterData?.set?.length) && <>
                      <div className="accordion" id="typeFilter">
                        <CheckBoxDesktop
                          title="Base/Insert"
                          prioritize={prioritize}
                          ref={typeRef}
                          isRefresh={true}
                          onChange={onChangeFilter}
                          name="type"
                          options={filterCollection.type} />
                      </div>
                      {Boolean(filterData?.type?.length) &&
                        <div className="accordion" id="ParallelFilter">
                          <CheckBoxDesktop
                            title="Parallel"
                            prioritize={prioritize}
                            ref={colorRef}
                            isRefresh={true}
                            onChange={onChangeFilter}
                            name="color"
                            options={optionsParallel} />
                        </div>
                      }
                    </>}
                    <div className="accordion" id="PrintRunFilter">
                      <CheckBoxDesktop
                        title="Print Run"
                        ref={printRunRef}
                        prioritize={prioritize}
                        onChange={onChangeFilter}
                        name="printRun"
                        options={optionsPrintRun} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
        <div className="col-lg-10 col-md-10 pt-5 pb-5 col-search-page">
        {
            //@ts-ignore
            width < 768 && <>
            <div className={`filter-mobile position-relative filter-mobile--search ${!data.cards.length && !data.isLoading ? "d-none": ""}`}>
              <div className="button-filter ">
                <button onClick={() => setFilterValue("sport")} type="button" className={`btn btn-primary btn-sm sport-button ${Boolean(filterData?.sport?.length) ? "active" : ""}`} data-bs-toggle="modal" data-bs-target="#filterModal">
                  {Boolean(filterData?.sport?.length) ? filterData?.sport[0]?.name : "All Sports"}
                </button>
                <button onClick={() => setFilterValue("publisher")} type="button" className={`btn btn-primary btn-sm ${Boolean(filterData?.publisher?.length) ? "active" : ""}`} data-bs-toggle="modal" data-bs-target="#filterModal">Publisher {Boolean(filterData?.publisher?.length) && <span>{filterData?.publisher?.length}</span>} </button>
                <button onClick={() => setFilterValue("year")} type="button" className={`btn btn-primary btn-sm ${Boolean(filterData?.year?.length) ? "active" : ""}`} data-bs-toggle="modal" data-bs-target="#filterModal">Year {Boolean(filterData?.year?.length) && <span>{filterData?.year?.length}</span>}</button>
                <button onClick={() => setFilterValue("set")} type="button" className={`btn btn-primary btn-sm ${Boolean(filterData?.set?.length) ? "active" : ""}`} data-bs-toggle="modal" data-bs-target="#filterModal">Collection {Boolean(filterData?.set?.length) && <span>{filterData?.set?.length}</span>}</button>
                <button onClick={() => setFilterValue("auto_memo")} type="button" className={`btn btn-primary btn-sm ${Boolean(filterData?.auto_memo?.length) ? "active" : ""}`} data-bs-toggle="modal" data-bs-target="#filterModal"> Autograph/Memorabilia {Boolean(filterData?.auto_memo?.length) && <span>{filterData?.auto_memo?.length}</span>}</button>
                {Boolean(filterData?.set?.length) && <>
                  <button onClick={() => setFilterValue("type")} type="button" className={`btn btn-primary btn-sm ${Boolean(filterData?.type?.length) ? "active" : ""}`} data-bs-toggle="modal" data-bs-target="#filterModal"> Base/Insert {Boolean(filterData?.type?.length) && <span>{filterData?.type?.length}</span>}</button>
                  {Boolean(filterData?.type?.length) && <button onClick={() => setFilterValue("color")} type="button" className={`btn btn-primary btn-sm ${Boolean(filterData?.color?.length) ? "active" : ""}`} data-bs-toggle="modal" data-bs-target="#filterModal">Parallel {Boolean(filterData?.color?.length) && <span>{filterData?.color?.length}</span>}</button>}
                </>}
                <button onClick={() => setFilterValue("printRun")} type="button" className={`btn btn-primary btn-sm ${Boolean(filterData?.printRun?.length) ? "active" : ""}`} data-bs-toggle="modal" data-bs-target="#filterModal"> Print Run {Boolean(filterData?.printRun?.length) && <span>{filterData?.printRun?.length}</span>}</button>
                {resetFilterUIMobile()}
                <div className="btn btn-filter btn-primary btn-sm" >
                  <button onClick={() => setFilterValue("all")} type="button" data-bs-toggle="modal" data-bs-target="#filterModal" className="btn btn-link p-0">
                    <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.5 1.59025L0.5 0.6C0.5 0.268629 0.768629 0 1.1 0L14.9 0C15.2314 0 15.5 0.268629 15.5 0.6V1.59025C15.5 1.76301 15.4255 1.92739 15.2957 2.04131L9.70435 6.94576C9.57447 7.05968 9.5 7.22406 9.5 7.39682V11.2136C9.5 11.435 9.37808 11.6384 9.18283 11.7428L7.38283 12.7049C6.98314 12.9185 6.5 12.6289 6.5 12.1757L6.5 7.39682C6.5 7.22406 6.42553 7.05968 6.29565 6.94576L0.704347 2.04131C0.574469 1.92739 0.5 1.76301 0.5 1.59025Z" fill="#18213A" />
                    </svg>
                  </button>
                  <span onClick={() => setFilterValue("all")} data-bs-toggle="modal" data-bs-target="#filterModal" >
                    Filters {renderNumberFilter()}
                  </span>
                  <button onClick={() => setFilterValue("sport")} data-bs-toggle="modal" data-bs-target="#sortModal" type="button" className="btn btn-link p-0">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.9697 4.37115L12.9697 16.3105L11.4697 16.3105L11.4697 4.37115L9.75 6.09082L8.68934 5.03016L12.2197 1.49983L15.75 5.03016L14.6893 6.09082L12.9697 4.37115Z" fill="#18213A" />
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M5.03033 13.4394L5.03033 1.5H6.53033L6.53033 13.4394L8.25 11.7197L9.31066 12.7804L5.78033 16.3107L2.25 12.7804L3.31066 11.7197L5.03033 13.4394Z" fill="#18213A" />
                    </svg>
                  </button>
                </div>
                {/* start modal */}
                <div className="modal fade" id="sortModal" tabIndex={-1} aria-labelledby="sortModalLabel" aria-hidden="true">
                  <div className={`modal-dialog ${filterValue === "all" ? "modal-all" : "align-items-end"}  modal-filter modal-lg modal-dialog-centered modal-sort`}>
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="sortModalLabel"> Sort by </h5>
                        <button type="button" className="btn btn-link text-decoration-none" data-bs-dismiss="modal" aria-label="Close" >  Close </button>
                      </div>
                      <div className={`modal-body filter-custom`}>
                        <div className="position-relative">
                          <div className=" col-lg-2 col-md-2 g-0 ">
                            <div className="shop__sidebar mt-3">
                              <div className="sidebar__categories">
                                <div className="section-title">
                                   <SortMobile className="section-title-item" onChange={onChangeSort} value={sortCards} options={MetaData.sort_card_list} />
                                  {/* <FilterSport
                                    isAll={Boolean(query.search_term)}
                                    isDefault={(Boolean(query.search_term) && !Boolean(query?.sport))}
                                    ref={sportRef}
                                    onChange={onChangeFilter}
                                    isSearch={false}
                                    name="sport"
                                    isCount={Boolean(query.search_term)}
                                    defaultValue={+(query?.sport ?? query?.sport_criteria)}
                                    options={filters.sports} /> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal fade" id="filterModal" tabIndex={-1} aria-labelledby="filterModalLabel" aria-hidden="true">
                  <div className={`modal-dialog ${filterValue === "all" ? "modal-all" : "align-items-end"}  modal-filter modal-lg modal-dialog-centered ${filterValue ==="sport" ? 'modal-sport' : ''}
                    ${filterValue ==="publisher" ? 'modal-publisher' : ''} 
                    ${filterValue ==="year" ? 'modal-year' : ''} 
                    ${filterValue ==="set" ? 'modal-collection' : ''} 
                    ${filterValue ==="auto_memo" ? 'modal-auto_memo' : ''} 
                    ${filterValue ==="printRun" ? 'modal-print_run' : ''} 
                    ${filterValue ==="all" ? 'modal-all' : ''}`
                  }>
                    <div className="modal-content">
                      <div className="modal-header">
                        <div className="d-none">{renderLengthFilterMobile()}</div>
                        <h5 className="modal-title" id="filterModalLabel">{renderTitleFilterMobile()} 
                        <span>{(filterValue ==="sport" || filterValue=== "all" )? renderLengthFilterMobile(): lengthFilter}</span></h5>
                        <button type="button" ref={buttonRef} className="btn btn-link text-decoration-none" data-bs-dismiss="modal" aria-label="Close" >  Close </button>
                      </div>
                      <div className={`modal-body ${filterValue !== "all" ? "filter-custom" : ""}`}>
                        <div className="position-relative">
                          <div className=" col-lg-2 col-md-2 g-0 border-end">
                            <div className="shop__sidebar mt-3">
                              <div className="sidebar__categories">
                                <div className="section-title">
                                  <div className={`accordion ${filterValue === "sport" || filterValue === "all" ? "" : "d-none"}`} id="sportFilter">
                                    <div className="accordion-item">
                                      {filterValue === "all" && <h2 className="accordion-header">
                                        <button
                                          type="button"
                                          className="accordion-button"
                                          data-bs-toggle="collapse"
                                          data-bs-target="#collapsesportFilter"
                                        > Sport <span>{sumBy(filters.sports, function (o) { return o.options?.length ?? 1; })}</span> </button>
                                      </h2>}
                                      <div id="collapsesportFilter" className="accordion-collapse collapse show" data-bs-parent="#sportFilter">
                                        <div>
                                          <FilterSport
                                            isAll={Boolean(query.q)}
                                            isDefault={(Boolean(query.q) && !Boolean(query?.sport))}
                                            // @ts-ignore
                                            ref={sportRef}
                                            onChange={(e: any, key: string) => { 
                                              onChangeFilter(e, key);
                                              // @ts-ignore
                                              buttonRef?.current.click();
                                            }}
                                            isSearch={false}
                                            name="sport"
                                            isCount={Boolean(query.q)}
                                            defaultValue={defaultValueSport()}
                                            options={filters.sports} />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className={`accordion ${filterValue === "publisher" || filterValue === "all" ? "" : "d-none"}`} id="publisherFilter">
                                    <div className="accordion-item">
                                      <CheckBoxMobile
                                        prioritize={prioritize}
                                        ref={publisherRef}
                                        setIsScroll={setIsScroll}
                                        filterValue={filterValue}
                                        onChange={onChangeFilter}
                                        name="publisher"
                                        options={filters.publishers}
                                        title="Publisher"
                                        isButton={filterValue === "all"}
                                        numberFilter={filterData?.publisher?.length}
                                      />
                                    </div>
                                  </div>
                                  <div className={`accordion ${filterValue === "year" || filterValue === "all" ? "" : "d-none"}`} id="YearFilter">
                                    <div className="accordion-item">
                                      <CheckBoxMobile
                                        prioritize={prioritize}
                                        ref={yearRef}
                                        onChange={onChangeFilter}
                                        name="year"
                                        options={filters.years}
                                        title="Year"
                                        isButton={filterValue === "all"}
                                        numberFilter={filterData?.year?.length}
                                        setIsScroll={setIsScroll}
                                        filterValue={filterValue}
                                      />
                                    </div>
                                  </div>
                                  <div className={`accordion ${filterValue === "set" || filterValue === "all" ? "" : "d-none"}`} id="CollectionFilter">
                                    <div className="accordion-item">
                                      <CheckBoxMobile
                                        prioritize={prioritize}
                                        ref={setRef}
                                        onChange={onChangeFilter}
                                        name="set"
                                        options={filters.collections}
                                        title="Collection"
                                        isButton={filterValue === "all"}
                                        numberFilter={filterData?.set?.length}
                                        setIsScroll={setIsScroll}
                                        filterValue={filterValue}
                                      />
                                    </div>
                                  </div>
                                  <div className={`accordion ${filterValue === "auto_memo" || filterValue === "all" ? "" : "d-none"}`} id="auto_memoFilter">
                                    <div className="accordion-item">
                                      <CheckBoxMobile
                                        prioritize={prioritize}
                                        ref={automemoRef}
                                        name="auto_memo"
                                        onChange={onChangeFilter}
                                        isSearch={false}
                                        options={filters.auto_memo}
                                        title="Autograph/Memorabilia"
                                        isButton={filterValue === "all"}
                                        numberFilter={filterData?.auto_memo?.length}
                                        setIsScroll={setIsScroll}
                                        filterValue={filterValue}
                                      />
                                    </div>
                                  </div>
                                  {Boolean(filterData?.set?.length) && <>
                                    <div className={`accordion ${filterValue === "type" || filterValue === "all" ? "" : "d-none"}`} id="typeFilter">
                                      <div className="accordion-item">
                                        <CheckBoxMobile
                                          prioritize={prioritize}
                                          ref={typeRef}
                                          isRefresh={true}
                                          onChange={onChangeFilter}
                                          name="type"
                                          options={filterCollection.type}
                                          title="Base/Insert"
                                          isButton={filterValue === "all"}
                                          numberFilter={filterData?.type?.length}
                                          setIsScroll={setIsScroll}
                                          filterValue={filterValue}
                                        />
                                      </div>
                                    </div>
                                    {Boolean(filterData?.type?.length) &&
                                      <div className={`accordion ${filterValue === "color" || filterValue === "all" ? "" : "d-none"}`} id="ParallelFilter">
                                        <div className="accordion-item">
                                          <CheckBoxMobile
                                            prioritize={prioritize}
                                            ref={colorRef}
                                            isRefresh={true}
                                            onChange={onChangeFilter}
                                            name="color"
                                            options={optionsParallel}
                                            title="Parallel"
                                            isButton={filterValue === "all"}
                                            numberFilter={filterData?.color?.length}
                                            setIsScroll={setIsScroll}
                                            filterValue={filterValue}
                                          />
                                        </div>
                                      </div>
                                    }
                                  </>}
                                  <div className={`accordion ${filterValue === "printRun" || filterValue === "all" ? "" : "d-none"}`} id="PrintRunFilter">
                                    <div className="accordion-item">
                                      <CheckBoxMobile
                                        ref={printRunRef}
                                        prioritize={prioritize}
                                        onChange={onChangeFilter}
                                        name="printRun"
                                        options={optionsPrintRun}
                                        title="Print Run"
                                        isButton={filterValue === "all"}
                                        numberFilter={filterData?.printRun?.length}
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
          <h1 className="filter-title"> {renderTitle()} </h1>
          <div className={`d-flex justify-content-between align-items-start p-head-search p-head-search--mobile ${isSelect ? 'p-sticky-header p-sticky-header--full' : ''}`}>
            {isSelect ? <div className="d-flex align-items-center ml-1 btn-group-head-search hai">
              <div className="me-2 fz-14">
                <span className="fw-bold">{cardSelected.length}</span> cards selected
              </div>
              {Boolean(cardSelected.length) &&
               <button
               type="button"
               onClick={() => {
                 setCardData(undefined);
                 if (loggingIn) {
                   setIsOpen(true)
                 }
                 else {
                   setIsOpenLogin(true);
                 }
               }}
               className="me-2 btn  btn-portfolio"
                > Add to { t('portfolio.text')} </button>
              }
              {/* {cardSelected.length < 2 &&
                <button type="button" className="me-2 btn btn-wishlist">Add to Wishlist</button>
              } */}
              <button type="button" onClick={onSelectAll} className="me-2 btn btn-secondary btn-select-all"> Select All </button>
              {Boolean(cardSelected.length) &&
                <button type="button" onClick={onClear} className="me-2 btn btn-outline-secondary btn-clear-section"> Clear </button>
              }
            </div> : <div className="d-flex align-items-start p-head-search-total">
              <div className="me-2 mt-2 total-item-card">{renderTotal()} found {renderSportName()} </div>
              <div className="d-flex flex-wrap p-head-search-filter--mobile">
                {resetFilterUI()}
              </div>
            </div>}
            {isSelect &&
              <div className="only-mobile group-head-search-content">
                <div className="p-head-search-collection-profile">
                  <div className="d-flex align-items-center ml-1 btn-group-head-search  btn-group-head-search--mobile">
                      <div className="group-head-search-info">
                        <div className="group-head-search-info-text d-flex">
                          <div> Select All </div>
                          <div> <span className="fw-bold">{cardSelected.length}</span> cards selected</div>
                        </div>
                        <img onClick={onHandleMode} src={IconCloseMobile} alt="" title="" />
                      </div>
                      {
                        cardSelected.length > 0 &&
                        <div className="group-head-search-btn">
                          <button
                            disabled={!cardSelected.length}
                            type="button"
                            onClick={() => {
                              setCardData(undefined);
                              if (loggingIn) {
                                setIsOpen(true)
                              }
                              else {
                                setIsOpenLogin(true);
                              }
                            }}
                            className="me-2 btn  btn-portfolio"
                          >Add to { t('portfolio.text')} </button>
                          {/* <button type="button" className="me-2 btn btn-wishlist">Add to Wishlist</button> */}
                        </div>
                      }
                  </div>
                </div>
              </div>
            }
            <div className="action-list action-list--desktop d-flex justify-content-start align-items-center">
              {/* <div className="me-2"> Sort by: </div> */}
              <div style={{ width: 168 }} className="hidden-select">
                <Select onChange={onChangeSort} value={sortCards} options={MetaData.sort_card_list} className="react-select-smart" classNamePrefix="react-select-smart" />
              </div>
              <div className="d-flex btn-group-card">
                <button type="button" onClick={() => setIsInline(prevState => !prevState)} className={` ${!isInline ? "active" : ""} ms-2 btn btn-outline-secondary`}>
                  <i className="fa fa-th" aria-hidden="true"></i>
                </button>
                <button type="button" onClick={() => setIsInline(prevState => !prevState)} className={` ${isInline ? "active" : ""} btn btn-outline-secondary pl-0`}>
                  {/* <i className="fa fa-list" aria-hidden="true"></i> */}
                  <img src={IconList.src} alt="" title="" />
                </button>
              </div>
              <button type="button" onClick={() => setIsSelect(prevState => !prevState)} className={`ms-2 btn btn-outline-secondary ${isSelect ? "active" : ""} btn-search-plus d-flex justify-content-center align-items-center`}>
                {isSelect ? <IconMinis /> : <IconPlus />}
              </button>
            </div>
            <div className="only-mobile">
              <div className="action-list d-flex justify-content-start align-items-center">
                {/* <div className="me-2"> Sort by: </div> */}
                <div className="d-flex btn-group-card">
                  <button type="button" onClick={() => setIsInline(prevState => !prevState)} className={` ${!isInline ? "active" : ""} ms-2 btn btn-outline-secondary p-0`}>
                    <IconDotMoBile isActive={!isInline ? true : false} />
                  </button>
                  <button type="button" onClick={() => setIsInline(prevState => !prevState)} className={` ${isInline ? "active" : ""} btn btn-outline-secondary pl-0`}>
                    {/* <i className="fa fa-list" aria-hidden="true"></i> */}
                    <IconLineMoBile />
                  </button>
                </div>
                <button type="button" onClick={() => setIsSelect(prevState => !prevState)} className={`ms-2 btn btn-outline-secondary ${isSelect ? "active" : ""} btn-search-plus d-flex justify-content-center align-items-center`}>
                  {isSelect ? <IconMinis /> : <IconPlus />}
                </button>
              </div>
            </div>
          </div>
          <Cards<CardModel>
            isLoadMore={false}
            isInline={isInline}
            cardElement={
              (item: CardModel) => {
                return (
                  <CardElement
                    isInline={isInline}
                    valueName="code"
                    // @ts-ignore
                    imageUrl={(item?.imgArr?.length && item?.imgArr[0] !== null) ? `https://img.priceguide.cards/${item.sport==="Non-Sport"?"ns":"sp"}/${item?.imgArr[0]}.jpg`: undefined }
                    cardSelected={cardSelected}
                    onSelectItem={onSelectItem}
                    isSelect={isSelect}
                    key={item.id}
                    onAddWishList={() => onAddWishList(item)}
                    onAddCollection={() => {
                      setCardData(undefined);
                      setCardSelected([item.code]);
                      if (loggingIn) {
                        setIsOpen(true)
                      }
                      else {
                        setIsOpenLogin(true);
                      }
                    }}
                    item={item} />
                );
              }
            }
            onLoadMore={onLoadMore}
            isLoading={data.isLoading}
            cards={data.cards} />
            <div className={`${!data.isLoading && Boolean(data.rows) ?"": "d-none"}`}>
              {Boolean(pagesSelected[pagesSelected.length - 1] < (Math.ceil(
                (data?.rows ?? 0) / rowsPerPage )))  && (
                  <div className="d-flex justify-content-center">
                    <button
                    onClick={onLoadMore}
                    type="button"
                    className="btn btn-light load-more"
                    > Load More </button>
                  </div>
                )}
            <div className="d-flex justify-content-center mt-3">
              <Pagination pagesSelected={pagesSelected} onSelectPage={handlePageClick} totalPage={Math.ceil((data.rows ?? 0) / rowsPerPage)} />
            </div>
          </div>
        </div>
      </div >
      <ChosseCollection
        selectCollection={selectWishlist}
        table="wishlist"
        title="wishlist"
        isOpen={isOpenWishList}
        setIsOpen={setIsOpenWishList}
      />
      <ChosseCollection
        selectCollection={selectCollection}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <LoginModal
        onSuccess={() => {
          setIsOpenLogin(false);
          if (cardData) {
            setIsOpenWishList(true)
          } else {
            setIsOpen(true)
          }
        }}
        isOpen={isOpenLogin}
        onClose={() => setIsOpenLogin(false)} />
      {
        cardData && loggingIn && <SelectGrading
          wishList={wishList}
          cardData={cardData}
          isOpen={isOpenGrade}
          onSuccess={onUpdateWishList}
          setIsOpen={setIsOpenGrade}
        />
      }
    </div >
  );
}

export default CardList;