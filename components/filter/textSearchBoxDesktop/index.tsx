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
  isButton?: boolean,
}

export type FilterHandleTextSearch = {
    reset: (value?: any) => void;
    getLengthOption?: () => number;
    getOptionData?: () => Array<FilterType>;
    getValue: () => string;
    clearSearch: () => void;
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
    },
    clearSearch() {
        return onClearSearch();
    }
  }));


  const onClearSearch = () => {
    setKeySearch("")
    props.onChange && props.onChange(props.name, '')
  }

  const onSearch = () => {
    props.onChange && props.onChange(props.name, keySearch)
  }
  const _handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
        props.onChange && props.onChange(props.name, keySearch)
    }
  }
  return (

    <div className="accordion-item">
      {Boolean(props.isButton) && <h2 className="accordion-header">
        <button
          type="button"
          className="accordion-button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse${props.name}`}
        >
          {props.title}
        </button>
      </h2>}
      <div id={`collapse${props.name}`} className="accordion-collapse collapse show" data-bs-parent={`#${props.name}Filter`}>
        <div className="checkbox-select">
          <div id="dropdown" className="checkbox-select__dropdown activeSearch" >
            <div className="checkbox-select__search-wrapp">
              {props.isSearch !== false && <div className="position-relative checkbox-select__search-wrapp-input">
                <input value={keySearch} onChange={(e) => setKeySearch(e.target.value)} onKeyPress={_handleKeyPress} name={props.name} type="text" placeholder="Search"/>
                <img onClick={onSearch} className="position-absolute icon-close-input-filter cursor-pointer" src={IconSearch.src} alt="IconSearch" />
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})

export default React.memo(CheckBoxFilter);
