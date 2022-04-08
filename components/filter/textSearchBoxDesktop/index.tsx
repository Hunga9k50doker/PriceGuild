import React, { useEffect, useState } from "react";
import { FilterType, filterDataType } from "interfaces"
import { cloneDeep, sumBy } from "lodash";
import IconSearch from "assets/images/search.png"

type PropsType = {
  name: string,
  onChange?: (value: any, key: string) => void,
  isSearch?: boolean,
  valueFilter?: filterDataType | undefined,
  isRefresh?: boolean,
  defaultValue?: string | number,
  title?: string,
}

export type FilterHandleTextSearch = {
  reset: (value?: any) => void;
  getLengthOption?: () => number;
  getOptionData?: () => Array<FilterType>;
  getValue: () => string;
};

type PrioritizeType = {
  name: string,
  isChange: boolean,
}


const CheckBoxFilter = React.forwardRef<FilterHandleTextSearch, PropsType>((props, ref) => {
  const [keySearch, setKeySearch] = useState<string>("")

 
  
  React.useImperativeHandle(ref, () => ({
    reset(value) {
      setKeySearch(value ?? '')
      },
      getValue() {
          return keySearch;
      }
  }));




  const onSearch = (event: any) => {
    setKeySearch(event.target.value);
    props.onChange && props.onChange(props.name, event.target.value)
  }

  return (

    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          type="button"
          className="accordion-button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse${props.name}`}
        >
          {props.title}
        </button>
      </h2>
      <div id={`collapse${props.name}`} className="accordion-collapse collapse show" data-bs-parent={`#${props.name}Filter`}>
        <div className="checkbox-select">
          <div id="dropdown" className="checkbox-select__dropdown activeSearch" >
            <div className="checkbox-select__search-wrapp">
              {props.isSearch !== false && <div className="position-relative checkbox-select__search-wrapp-input">
                <input value={keySearch} onChange={onSearch} name={props.name} type="text" placeholder="Search"/>
                <img className="position-absolute icon-close-input-filter curson-poiter" src={IconSearch.src} alt="IconSearch" />
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})

export default React.memo(CheckBoxFilter);
