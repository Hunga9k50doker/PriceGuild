import React, { useEffect, useState } from "react";
import { FilterType, filterDataType } from "interfaces"
import { cloneDeep, sumBy } from "lodash";
import { type } from "os";

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
}

export type FilterHandle = {
  reset: (value?: any) => void;
  getLengthOption: () => number;
  getIsScrollFilter?: () => boolean;
  getOptionData: () => Array<FilterType>;
};

type PrioritizeType = {
  name: string,
  isChange: boolean,
}


const CheckBoxFilter = React.forwardRef<FilterHandle, PropsType>((props, ref) => {
  const [options, setOptions] = useState<Array<FilterType>>([])
  const [checkedState, setCheckedState] = useState<Array<FilterType>>([]);
  const [keySearch, setKeySearch] = useState<string>("")
  const [optionsSearch, setOptionsSearch] = useState<Array<FilterType> | undefined>()
  
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
    getOptionData() {
      return options ?? [];
    }
  }));

  const renderLength = () => {
    return sumBy((optionsSearch?? options), function (o) { return o.options?.length ?? 1; })
  }
  
  const checker = (arr: any, target: any) => target.every((v: any) => checkedState?.map((item) => item.id).includes(v.id));

  const renderContent = (e: FilterType, i: number) => {
    if (e?.options) {
      return <div key={i} className={`checkbox-select-list ${props.isMultipleLv ? "multiple-Lv" : ""} `}>
        {props.isMultipleLv ?
          <div className="ms-1 form-check cursor-pointer">
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
          <div className="checkbox-select__title-wrapp">{e.name}</div>
        }
        {/* <div className="d-flex">
        <input
          className="form-check-input"
          type="checkbox"
          id={e.id.toString() + props.name}
          onChange={() => onChangeCheckBox(e)}
          checked={Boolean(checkedState.find(item => item.id === e.id))}
          value={e.id}
        />     
        </div>  */}
        {e?.options?.map((item: FilterType, key: number) => renderCheckBox(item, key))}
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
    return <li key={i} >
      <div className="ms-1 form-check">
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

  return (
    <div>
      <div id="app" className="checkbox-select">
        <div id="dropdown" className="checkbox-select__dropdown activeSearch" >
          <div className="checkbox-select__search-wrapp">
            {props.isSearch !== false && <div className="d-flex">
              <input value={keySearch} onChange={onSearch} name={props.name} type="text" placeholder="Search" />
              {Boolean(keySearch) && <i onClick={onClearSearch} className="fa fa-times" aria-hidden="true"></i>}
            </div>}
          </div>
          <ul className={`customScroll ${props.isSearch === false ? "mt-0" : ""}  checkbox-select__filters-wrapp mb-0`}>
            {(optionsSearch?? options)?.map((item, key: number) => renderContent(item, key))}
          </ul>
        </div>
      </div>
    </div>
  );
})

export default React.memo(CheckBoxFilter);
