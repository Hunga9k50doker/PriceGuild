import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { SmartSearchType, SportType } from "interfaces"
import { api } from 'configs/axios';
import { components } from 'react-select';
import { useRouter } from "next/router";
import { useDebouncedCallback } from "utils/useDebouncedEffect"

const groupStyles = {
  // custome
};
type PropTypes = {

  sport?: SportType | null,
  error?: boolean,
  placeholder?: string,
  onChange?: (value: any) => void,
}

function InputSearch({
  sport,
  placeholder = "Search user",
  ...props
}: PropTypes) {
  const [selectedValue, setSelectedValue] = useState<SmartSearchType | null>(null);
  let router = useRouter();
  const [keySearch, setKeySearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const valueComponent = (option: any) => {
    return (
      <div>
        <div className="d-flex">
          <div className="me-2 rounded-circle" style={{ height: 42, width: 42, backgroundColor: "#ececec" }} ></div>
          <div className="content-user text-ellipsis text-nowrap">
            <div className="fs16 fw-bold text-ellipsis">{option?.full_name}</div>
            <div className="text-ellipsis">
              @{option?.username}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const _loadSuggestions = (query: string, callback: any) => {
    const body: any = {
      page: 1,
      search_input: query
    }
    setIsLoading(true);
    api.v1.friends.searchFriends(body)
      .then((resp) => {
        if (resp.success) {
          setIsLoading(false);
          return callback(resp.data);
        }
        if (!resp.success) {
          // @ts-ignore
          if (resp.data?.verify_redirect) {
            return router.push('/verify-email')
          }
        }
        setIsLoading(false);
        callback([]);
      })
      .catch((error: any) => {
        if(error?.response?.status === 403) {
          return router.push('/verify-email')
        }
        setIsLoading(false);
        console.log(error);
      });
  };

  const loadSuggestions = useDebouncedCallback(_loadSuggestions, 450);

  const getOptionValue = (option: any) => option?.search_criteria ?? option?.card_code;

  useEffect(() => {
    setSelectedValue(null)
  }, [sport])

  const onSelectValue = (value: any) => {
    props.onChange && props.onChange(value)
  }

  const onSearch = () => {
    let urlObject: { [key: string]: string | number } = {};
    if (sport?.id) {
      urlObject.sport = sport.id
    }
    urlObject.q = keySearch.replace("#", "''")
    redirects(urlObject)
  }

  const redirects = (urlObject: { [key: string]: string | number }) => {
    let str = Object.entries(urlObject).map(([key, val]) => `${key}=${val}`).join('&');
    return router.push(`/search?${str}`)
  }

  const handleInputChanged = (input: string, reason: any) => {
    if (
      reason.action === "input-blur" ||
      reason.action === "menu-close") {
      setIsMenu(false);
      return;
    }
    setIsMenu(true);
    setKeySearch(input)
  }

  const Group = (props: any) => (
    <div style={groupStyles}>
      <components.Group {...props} />
    </div>
  );

  const SingleValue = (props: any) => {
    return (
      <components.SingleValue {...props}>
        {props.data.label}
      </components.SingleValue>
    );
  };

  const onKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      setIsMenu(false);
      return onSearch()
    }
  }
  return (
    <>
      <fieldset className="form-group form-group-sm">
        <div className="select-box-sm">
          <div
            className="d-flex"
          >
            <AsyncSelect
              noOptionsMessage={() => "No data"}
              value={selectedValue}
              isPortal={true}
              cacheOptions
              components={{ SingleValue, Group }}
              className="react-select-user"
              getOptionValue={getOptionValue}
              getOptionLabel={valueComponent as any}
              menuPosition="fixed"
              classNamePrefix="react-select-user"
              onChange={(value) => {
                onSelectValue(value)
                setSelectedValue(value);
              }}
              onKeyDown={onKeyDown}
              Group
              menuIsOpen={isMenu}
              inputValue={keySearch}
              onInputChange={handleInputChanged}
              isLoading={isLoading}
              defaultOptions
              loadOptions={loadSuggestions}
              placeholder={placeholder}
              styles={{
                option: (base) => ({
                  ...base,
                  height: "100%",
                  width: "100%",
                }),
                menu: (provided, state) => ({
                  ...provided,
                  width: state.selectProps.width,
                  color: state.selectProps.menuColor,
                }),
              }}
            />
          </div>
        </div>

      </fieldset>

    </>
  );
}



export default React.memo(InputSearch);
