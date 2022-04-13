import React, { useEffect, useState } from "react";
import { FilterType, filterDataType } from "interfaces"
import { cloneDeep, isEmpty, sumBy } from "lodash";
// @ts-ignore
import $ from "jquery";

type PropsType = {
  options: Array<FilterType>,
  name: string,
  onChange?: (value: any, key: string) => void,
  isSearch?: boolean,
  valueFilter?: filterDataType | undefined,
  isRefresh?: boolean,
  defaultValue?: string | number,
  isAll?: boolean,
  prioritize?: PrioritizeType[],
  isChangeValue?: boolean,
  isMultipleLv?: boolean,
  isButton?: boolean,
  title?: string,
  numberFilter?: number,
  filterValue?: string,
  setIsScroll?: (status : boolean) => void,
}

export type FilterHandle = {
  reset: (value?: any) => void;
  getLengthOption: () => number;
  getIsScrollFilter?: () => boolean;
  getOptionData: () => Array<FilterType>;
  getLengthChecked: () => number;
};

type PrioritizeType = {
  name: string,
  isChange: boolean,
}
const LIMIT = 6

const CheckBoxFilter = React.forwardRef<FilterHandle, PropsType>((props, ref) => {
  const [options, setOptions] = useState<Array<FilterType>>([])
  const [checkedState, setCheckedState] = useState<Array<FilterType>>([]);
  const [keySearch, setKeySearch] = useState<string>("")
  const [optionsSearch, setOptionsSearch] = useState<Array<FilterType> | undefined>()
  const refScroll = React.createRef<HTMLUListElement>();
  const [isScroll, setIsScroll] = useState<boolean>(false)
  const [readMore, setReadMore] = useState<boolean>(true)
  const [optionData, setOptionData] = useState({
    count: 0,
    type: props.name,
    isOption: false,
    levelHide: 0,
    countAtLv: 0,
    total: props.numberFilter,
  })
  useEffect(() => {
    if (!(props?.prioritize ?? []).length) {
      setOptions(props.options)
      if (props.isChangeValue !== false) {
        setCheckedState([])
      }
    }
    else {
      let key = 0;
      props?.prioritize?.forEach(function (item, index) {
        if (item.isChange) {
          key = index;
        }
      })
      let dataFiler = props?.prioritize?.filter((item, index) => index <= key).map(item => item.name);
      if (!dataFiler?.includes(props.name)) {
        setOptions(props.options)
        setCheckedState([])
      }
    }

  }, [props.options])

  React.useImperativeHandle(ref, () => ({
    reset(value) {
      setCheckedState(value ?? [])
    },

    getLengthOption() {
      return renderLength()
    },
    getIsScrollFilter() {
      return getIsScroll()
    },
    getOptionData() {
      return options ?? []
    },
    getLengthChecked() {
      return checkedState?.length ?? 0;
    }
  }));

  const renderLength = () => {
    return sumBy((optionsSearch ?? options), function (o) { return o.options?.length ?? 1; })
  }

  const checker = (arr: any, target: any) => target.every((v: any) => checkedState?.map((item) => item.id).includes(v.id));

  const renderContent = (e: FilterType, i: number) => {
    if (e?.options) {
      return <div key={i} className={`checkbox-select-list ${props.isMultipleLv ? "multiple-Lv" : ""} ${optionData?.isOption && optionData?.levelHide < (i++) ? (readMore ? 'hide-checklist' : '') : ''}`}>
        {props.isMultipleLv ?
          <div className={`ms-1 form-check cursor-pointer ${i > 9 ? 'hide-checklist': ''}`}>
            <input
              className="form-check-input cursor-pointer"
              type="checkbox"
              id={e.name.toString() + props.name}
              onChange={() => onChangeCheckBoxMultiple(checker(checkedState, e?.options ?? []), e?.options ?? [])}
              checked={checker(checkedState, e?.options ?? [])}
            // value={e.id}
            />
            <label className="form-check-label text-capitalize" htmlFor={e.name.toString() + props.name}>
              {e.name}
            </label>
          </div>
          :
          <div className={`checkbox-select__title-wrapp`}>{e.name}</div>
        }
        
        { e?.options?.map((item: FilterType, key: number) => renderCheckBox(item, key))}
      </div>
    }
    return renderCheckBox(e, i);
  }


  const onChangeCheckBox = (option: FilterType) => {
    let checkedData = [...checkedState];
    if (checkedData.find((item: FilterType) => item.id === option.id)) {
      checkedData = checkedData.filter(item => item.id !== option.id);
      setCheckedState(checkedData)
    }
    else {
      checkedData.push(option)
      setCheckedState(checkedData)
    }
    props.onChange && props.onChange(checkedData, props.name)
  }

  const onChangeCheckBoxMultiple = (isCheck: boolean, option: FilterType[]) => {
    let checkedData = [...checkedState];
    if (isCheck) {
      checkedData = checkedData.filter(item => !option?.map(value => value.id).includes(item.id));
      setCheckedState(checkedData)
    } else {
      checkedData = checkedData.filter(item => !option?.map(value => value.id).includes(item.id));
      // @ts-ignore
      checkedData = [...checkedData, ...option];
      setCheckedState(checkedData)
    }
    props.onChange && props.onChange(checkedData, props.name)
  }


  const renderCheckBox = (e: FilterType, i: number) => {
    return <li key={i} className={`${!optionData.isOption ? ( i > LIMIT ? 'hide-checklist-input': '') : '' }`}>
      <div className={`ms-1 form-check`}>
        <input
          className="form-check-input cursor-pointer"
          type="checkbox"
          id={e.id.toString() + props.name}
          onChange={() => onChangeCheckBox(e)}
          checked={Boolean(checkedState.find(item => item.id === e.id))}
          value={e.id}
        />
        <label className="form-check-label" htmlFor={e.id.toString() + props.name}>
          {e.name}
        </label>
      </div>
    </li>
  }

  const onSearch = (event: any) => {
    setKeySearch(event.target.value)
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

  const onClearSearch = () => {
    setKeySearch("")
    setOptionsSearch(undefined)
  }



    const getIsScroll = () => {
      // @ts-ignore
        return refScroll.current?.clientHeight < refScroll.current.scrollHeight
    }


  React.useLayoutEffect(() => {
       // @ts-ignore
      if (refScroll.current.clientHeight < refScroll.current.scrollHeight) {
       return setIsScroll(true)
      }
      setIsScroll(false)      
    }, [refScroll]);

  React.useEffect(() => {
    if (props?.filterValue === props?.name) {
      props.setIsScroll && props.setIsScroll(isScroll)
    }
  }, [props.filterValue, isScroll]);

  React.useEffect(() => {
    if (!isEmpty(options)) {
      countAllOption();
    }
  }, [options]);

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

  // const checkRenderReadMore = (data: any, i: number) => {
  //   if (data?.isOption && data?.levelHide < (i++)) {
  //       return `${readMore} ? hide-checklist : ''`;
  //   }
  //   return '';
  // }
  const hideReadMore = () => {
    if (!optionData.isOption) {
      $(`.checkbox-select__filters-wrapp#ul${props.name} li`).removeClass("hide-checklist-input")
    } else {
      $(`.checkbox-select__filters-wrapp#ul${props.name} .checkbox-select-list`).removeClass("hide-checklist")
    }
    setReadMore(false);
  }

  return (
    <React.Fragment>
      {Boolean(props.isButton) && <h2 className="accordion-header">
        <button
          type="button"
          className="accordion-button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse${props.name}`}
        ><div className="d-flex justify-content-between w-100">
            <div> {props.title}
              <span>{renderLength()}</span>
            </div>
            {Boolean(props.numberFilter) && <span className="counter-choose">{props.numberFilter}</span>}
          </div>
        </button>
      </h2>}
      <div id={`collapse${props.name}`} className="accordion-collapse collapse show" data-bs-parent={`#${props.name}Filter`}>
        <div className="checkbox-select">
          <div id="dropdown" className="checkbox-select__dropdown activeSearch" >
            {props.isSearch !== false && <div className="checkbox-select__search-wrapp">
              <div className="d-flex checkbox-select__search-wrapp-input">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.2405 12.4776L10.0672 9.17711C10.8831 8.20718 11.3301 6.9868 11.3301 5.71634C11.3301 2.74802 8.91512 0.333008 5.9468 0.333008C2.97848 0.333008 0.563477 2.74802 0.563477 5.71634C0.563477 8.68466 2.97848 11.0997 5.9468 11.0997C7.06115 11.0997 8.12307 10.7636 9.03098 10.1255L12.2284 13.451C12.3621 13.5898 12.5418 13.6663 12.7345 13.6663C12.9168 13.6663 13.0898 13.5968 13.2211 13.4704C13.5001 13.202 13.509 12.7568 13.2405 12.4776ZM5.9468 1.73735C8.14086 1.73735 9.92579 3.52228 9.92579 5.71634C9.92579 7.91039 8.14086 9.69532 5.9468 9.69532C3.75275 9.69532 1.96782 7.91039 1.96782 5.71634C1.96782 3.52228 3.75275 1.73735 5.9468 1.73735Z" fill="#6D7588"/>
                </svg>
                <input value={keySearch} onChange={onSearch} name={props.name} type="text" placeholder="Search" />
                {Boolean(keySearch) && <i onClick={onClearSearch} className="fa fa-times input-close" aria-hidden="true"></i>}
              </div>
            </div>}
            <ul
              ref={refScroll}
              id={`ul${props.name}`}
              className={`customScroll ${props.isSearch === false ? "mt-0" : ""} checkbox-select__filters-wrapp mb-0`}>
              {(optionsSearch ?? options)?.map((item, key: number) => renderContent(item, key))} 
              {/*isScroll && <div style={{height:55}}/>*/} 
            </ul>
            
            {readMore && optionData.isOption &&
              <div className={`btn-see-more-checklist`}>
                <div className="text-see-more" onClick={() => {hideReadMore()}}>See more (
                  {optionData.count - optionData.countAtLv}
                  )</div>
              </div>
            }
            {readMore && !optionData.isOption && optionData.count > LIMIT &&
              <div className={`btn-see-more-checklist`}>
                <div className="text-see-more" onClick={() => {hideReadMore()}}>See more (
                  {optionData.count - (LIMIT + 1)}
                  )</div>
              </div>
            }
          </div>
        </div>
      </div>
    </React.Fragment>
  );
})

export default React.memo(CheckBoxFilter);
