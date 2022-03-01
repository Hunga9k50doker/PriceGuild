import React, { useEffect, useState } from "react";
import { FilterType } from "interfaces"
import { cloneDeep, sumBy, isEmpty } from "lodash";
import { formatNumber } from "utils/helper";
import Skeleton from 'react-loading-skeleton'
import { useRouter } from 'next/router'
// @ts-ignore
import $ from "jquery";
import useWindowDimensions from "utils/useWindowDimensions";

type PropsType = {
  options: Array<FilterType>,
  name: string,
  onChange?: (value: any, key: string) => void,
  isSearch?: boolean,
  isRefresh?: boolean,
  defaultValue?: string | number,
  isAll?: boolean,
  isDefault?: boolean
  isFullHeight?: boolean,
  isCount?: boolean,
  isLoadingState?: boolean
}

export type FilterHandle = {
  reset: () => void;
  setSport: (id: number| string) => void;
};

const defaultSelect: FilterType = {
  name: "All",
  id: "all"
}

const LIMIT = 4;

const CheckBoxFilter = React.forwardRef<FilterHandle, PropsType>(({ isLoadingState = true, isCount = false, defaultValue, isFullHeight = false, isAll = false, ...props }, ref) => {
  const [options, setOptions] = useState<Array<FilterType>>([])
  const [checkedState, setCheckedState] = useState<Array<FilterType>>([]);
  const [optionsSearch, setOptionsSearch] = useState<Array<FilterType> | undefined>()
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [readMore, setReadMore] = useState<boolean>(true)
  const [optionData, setOptionData] = useState({
    count: 0,
    type: props.name,
    isOption: false,
    levelHide: 0,
    countAtLv: 0,
    total: props.options.length,
  })
  useEffect(() => {
    if (defaultValue && !checkedState?.length) {
      const checkedState = options.find(item => item.id == defaultValue || item.name.replace(/\s/g, '').toLowerCase() == defaultValue);
      if (checkedState) {
        // @ts-ignore
        setCheckedState([checkedState])
      }
    }

  }, [defaultValue, options])

  const { width } = useWindowDimensions();

  useEffect(() => {
    if (isLoadingState) {
      setIsLoading(true) 
    }
  }, [router.query])


  useEffect(() => {
    if (props.options.length) {
      setOptions(props.options)
      setIsLoading(false)
    }
  }, [props.options])

  useEffect(() => {
    if (props.isDefault) {
      setCheckedState([defaultSelect])
    }
  }, [props.isDefault])

  React.useImperativeHandle(ref, () => ({
    // start() has type inferrence here
    reset() {
      if (props.isDefault) {
        return setCheckedState([defaultSelect])
      }
      setCheckedState([])
    },
    setSport(idSport: number| string) {
      const checkedState = options.find(item => item.id == idSport || item.name.replace(/\s/g, '').toLowerCase() == idSport);
      if (checkedState) {
        // @ts-ignore
        setCheckedState([checkedState])
      }
    } 
  }));

  const renderContent = (e: FilterType, i: number) => {
    if (e?.options) {
      return <div key={i}>
        <div className="checkbox-select__title-wrapp fw-bold">{e.name}</div>
        {e?.options?.map((item: FilterType, key: number) => renderCheckBox(item, key))}
      </div>
    }
    return renderCheckBox(e, i);
  }


  const onChangeCheckBox = (option: FilterType) => {
    const checkedData = [option];
    setCheckedState(checkedData)
    props.onChange && props.onChange(checkedData, props.name)
  }

  const renderCheckBox = (e: FilterType, i: number) => {
    //@ts-ignore
    return <li key={i} className={`${!optionData.isOption && width < 768 ? (i > LIMIT ? 'hide-checklist-input' : '') : ''}`} >
      <div className="form-check no-input">
        <input
          className="form-check-input d-none"
          type="radio"
          id={e.id.toString() + props.name}
          name={props.name}
          onChange={() => onChangeCheckBox(e)}
          checked={Boolean(checkedState.find(item => item.id === e.id))}
          value={e.id}
        />
        <label className={`form-check-label cursor-pointer ${Boolean(checkedState.find(item => item.id === e.id)) ? "text-decoration-underline" : ""}`} htmlFor={e.id.toString() + props.name}>
          {e.name}
        </label>
        {isCount && <span className="form-check-count"> {formatNumber(e?.doc_count)}</span>}
      </div>
    </li>
  }

  const onSearch = (event: any) => {
    if (event.target.value) {
      const data = onFilter(cloneDeep(options), event.target.value.toLowerCase());
      return setOptionsSearch(data)
    }
    setOptionsSearch(undefined)
  }

  const onFilter = (data: Array<FilterType>, text: string) => {
    return data?.filter(e => {
      if (e.options?.length) {
        const dataSearch = e.options.filter(search => search.name.toLowerCase().includes(text?.toLowerCase()))
        if (dataSearch?.length) {
          e.options = dataSearch;
          return true
        }
        return false

      }
      if (e.name.toLowerCase().includes(text?.toLowerCase())) {
        return true;
      }
      return false
    })
  }
  React.useEffect(() => {
    if (!isEmpty(options)) {
      countAllOption();
    }
    }, [options]);
  
  const countAllOption = () => {
    let count = 0;
    let lv = 0;
    let isOp = false;
    let atLvCount = 0;
    // @ts-ignore
    options.forEach((data, i) => {
      
      if (data?.options) {
        isOp = true;
        count += data?.options?.length;
        if (count <= 10) {
          lv = i;
          atLvCount = count;
        }
      } else {
        isOp = false;
        count += 1;
        atLvCount = count;
      }
   })
  
    setOptionData((prevState) => {
      return { ...prevState, count: count, levelHide: lv, isOption: isOp, countAtLv: atLvCount };
    })
  }
  React.useEffect(() => {
    if (optionData.isOption) {
      if (optionData.countAtLv !== 0 && optionData.countAtLv < optionData.count) {
        return setReadMore(true);
      }
    } else {
      if (optionData.count - LIMIT) {
        return setReadMore(true);
      }
    }
    return setReadMore(false)
  }, [optionData]);

  const hideReadMore = () => {
    if (!optionData.isOption) {
      $(`ul.checkbox-select__filters-wrapp li`).removeClass("hide-checklist-input")
    } else {
      $(`ul.checkbox-select__filters-wrapp .checkbox-select-list`).removeClass("hide-checklist")
    }
    setReadMore(false);
    }
  
  return (
    <div>
      <div
        className="checkbox-select">
        <div id="dropdown" className="checkbox-select__dropdown activeSearch" >
          {props.isSearch !== false &&
            <div className="checkbox-select__search-wrapp">
              <input onChange={onSearch} name={props.name} type="text" placeholder="Search" />
            </div>
          }
          
          <ul className={`${props.isSearch === false ? "mt-0" : ""} ${!isFullHeight ? "filter-sport checkbox-select__filters-wrapp" : ""}  ${
            //@ts-ignore
            width > 768 ? 'customScroll' : ''}  mb-0`}>
    
            {
              isLoading ?  <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              </> :
                <>
              {Boolean(isAll !== false) && <li>
              <div className="form-check no-input">
                <input
                  id={"all" + props.name}
                  className="form-check-input d-none"
                  onChange={() => onChangeCheckBox(defaultSelect)}
                  type="radio"
                  name={props.name}
                  checked={checkedState[0]?.id === "all"}
                  value={"all"}
                />
                <label className={`form-check-label cursor-pointer ${checkedState[0]?.id === "all" ? "text-decoration-underline" : ""}`} htmlFor={"all" + props.name}>
                  All Sports
                </label>
                {isCount && <span className="form-check-count"> ({formatNumber(sumBy((optionsSearch ?? options), "doc_count"))})</span>}
              </div>
            </li>}
                 {(optionsSearch ?? options)?.map((item, key: number) => renderContent(item, key))}
                </>
            }
           
          </ul>
          {
            //@ts-ignore
            readMore && !optionData.isOption && optionData.count > LIMIT && width < 768 &&
              <div className={`btn-see-more-checklist`}>
                <div className="text-see-more" onClick={() => {hideReadMore()}}>See more (
                  {optionData.count - (LIMIT + 1)}
                  )</div>
              </div>
            }
        </div>
      </div>
    </div>
  );
})

export default React.memo(CheckBoxFilter);
