import React, { useState } from 'react';
// @ts-ignore
import Autosuggest from "components/react-autosuggest/dist/index";
import AutosuggestHighlightParse from 'autosuggest-highlight/parse'
import AutosuggestHighlightMatch from 'autosuggest-highlight/match'
import { api } from 'configs/axios';
import { useDebouncedCallback } from "utils/useDebouncedEffect"
// @ts-ignore
import $ from "jquery";
import { SportType } from "interfaces"
import { useRouter } from 'next/router'

import { isEmpty } from 'lodash';
import { ConfigAction } from "redux/actions/config_action";
import { useDispatch } from "react-redux";
// @ts-ignore
function getSuggestionValue(suggestion) {
  return suggestion;
}
// @ts-ignore

// @ts-ignore
function renderSectionTitle(section) {
  return (
    <strong>{section.label}</strong>
  );
}
// @ts-ignore
function getSectionSuggestions(section) {
  return section.options;
}

type PropTypes = {
  sport?: SportType | null,
  error?: boolean,
  placeholder?: string,
  defaultSearch?: string,
  onClose?: () => void,
  onShow?: (isShow: boolean) => void,
}
export type FilterModalHandle = {
  onClearData: () => void,
}

const InputSearchMobile = React.forwardRef<FilterModalHandle, PropTypes>(({
  sport,
  placeholder = "Search for Сards",
  defaultSearch = "",
  ...props
}, ref) => {

  const [value, setValue] = useState("");
  let router = useRouter();
  const [valueState, setValueState] = useState();
  const [suggestions, setSuggestions] = useState([])
  const [keySearch, setKeySearch] = useState<string>("");
  const dispatch = useDispatch();
  //@ts-ignore
  function renderSuggestion(suggestion, { query }) {
    const matches = AutosuggestHighlightMatch(suggestion.label, query);
    const parts = AutosuggestHighlightParse(suggestion.label, matches);

    return (
      <span>
        { // @@ts-ignore
          parts.map((part: any, index: number) => {
            const className = part.highlight ? 'react-autosuggest__suggestion-match' : "";
            return (
              <span className={className} key={index}>
                {part.text}
              </span>
            );
          })}
      </span>
    );
  }

  React.useEffect(() => {
    if (defaultSearch) {
      // @ts-ignore
      setValueState(defaultSearch)
      setValue(defaultSearch)
      setKeySearch(defaultSearch)
    }
  }, [defaultSearch,])

  React.useImperativeHandle(ref, () => ({
    onClearData() {
      onClear()
    },
  }));

  // @ts-ignore
  const onChange = (event, { newValue, method }) => {
    if (method === 'click') {
      onSelectValue(newValue)
    }
    if (method === "type") {
      setKeySearch(newValue)
    }
    setValueState(newValue)
    setValue(newValue?.label ?? newValue)
  };
  // @ts-ignore
  const onFocus = () => {
    dispatch(ConfigAction.updateShowTabBar(false));
  }
  // @ts-ignore
  const handleOnBlur = () => {
    dispatch(ConfigAction.updateShowTabBar(true));
    props.onShow && props.onShow(false);
  }
  // @ts-ignore
  const _loadSuggestions = async ({ value }) => {
    api.v1.elasticSearch.searchAutoComplete({ search_term: value, sport: sport?.id ? sport?.id : undefined })
      .then((resp) => {
        if (resp.success) {
          // @ts-ignore
          return setSuggestions(resp.data)
        }
        setSuggestions([])

      })
      .catch((error) => {
        setSuggestions([])
        console.log(error);
      });
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([])
  };

  const loadSuggestions = useDebouncedCallback(_loadSuggestions, 450);

  const inputProps = {
    placeholder: placeholder,
    value,
    onChange: onChange,
    onFocus: onFocus,
    onBlur: handleOnBlur,
    spellCheck: false,
    autoCapitalize: 'none',
    autoCorrect: 'off',
  };

  const onEnter = () => {
    $(".react-autosuggest__input").blur();
    if (typeof valueState === "string") {
      onSearch()
    } else {
      onSelectValue(valueState)
    }
  }

  const onSelectValue = (value: any) => {
    let urlObject: { [key: string]: string | number | boolean } = {}
    if (value?.search_criteria?.type === "portfolio") {
      return router.push(`/collections/${value?.search_criteria?.group_ref}/card?keyword=${value?.search_criteria?.keyword}&user=${value?.search_criteria?.user_ref} `)
    }
    if (value.card_code) {
      return router.push(`/card-detail?code=${value.card_code}`)
    }
    else {
      if (value?.search_criteria?.publisherID !== undefined) {
        urlObject.publisher = value?.search_criteria?.publisherID
      }
      if (value?.search_criteria?.publisherName !== undefined) {
        urlObject.publisherName = value?.search_criteria?.publisherName
      }
      if (value?.search_criteria?.setID !== undefined) {
        urlObject.set = value?.search_criteria?.setID
      }
      if (value?.search_criteria?.sportID !== undefined) {
        urlObject.sport_criteria = value?.search_criteria?.sportID
      }
      if (value?.search_criteria?.year !== undefined) {
        urlObject.year = value?.search_criteria?.year
      }
      if (value?.search_criteria?.setName !== undefined) {
        urlObject.setName = value?.search_criteria?.setName
      }
      if (value?.search_criteria?.playerName !== undefined) {
        delete urlObject.sport_criteria;
        urlObject.q = value?.search_criteria?.playerName;
        urlObject.sport = value?.search_criteria?.sportID
      }
    }
    // urlObject.smart_search = true;
    redirects(urlObject)
  }

  const onSearch = () => {
    if (typeof valueState !== "string") {
      return onSelectValue(valueState)
    }
    let urlObject: { [key: string]: string | number } = {};
    if (sport?.id) {
      urlObject.sport = sport.id
    }
    // @ts-ignore
    urlObject.q = valueState.replace("#", "%23")
    redirects(urlObject)
  }

  const redirects = (urlObject: { [key: string]: string | number | boolean }) => {
    let str = Object.entries(urlObject).map(([key, val]) => `${key}=${val}`).join('&');
    return router.push(`/search?${str}`)
  }

  React.useEffect(() => {
    $(".react-autosuggest__input").blur();
  }, [router?.query])

  const onClear = () => {
    setKeySearch("")
    setValue("")
    // @ts-ignore
    setValueState()
    setSuggestions([])
  }

  return (
    <div className="d-flex position-relative">
      <button disabled={isEmpty(keySearch)} onClick={onSearch} type="button" className="btn btn-link position-absolute">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.361 18.2168L14.601 13.2662C15.8249 11.8113 16.4954 9.98069 16.4954 8.07499C16.4954 3.62251 12.8729 0 8.42045 0C3.96797 0 0.345459 3.62251 0.345459 8.07499C0.345459 12.5275 3.96797 16.15 8.42045 16.15C10.092 16.15 11.6849 15.6458 13.0467 14.6888L17.8429 19.677C18.0434 19.8852 18.313 20 18.602 20C18.8755 20 19.1349 19.8957 19.3319 19.7061C19.7504 19.3034 19.7637 18.6357 19.361 18.2168ZM8.42045 2.10652C11.7115 2.10652 14.3889 4.78391 14.3889 8.07499C14.3889 11.3661 11.7115 14.0435 8.42045 14.0435C5.12936 14.0435 2.45198 11.3661 2.45198 8.07499C2.45198 4.78391 5.12936 2.10652 8.42045 2.10652Z" fill="#6D7588" />
        </svg>
      </button>
      <div className="position-relative section-search-suggest">
        <form>
          <Autosuggest
            multiSection={true}
            suggestions={suggestions}
            onSuggestionsFetchRequested={loadSuggestions}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            renderSectionTitle={renderSectionTitle}
            getSectionSuggestions={getSectionSuggestions}
            labelName="label"
            onEnter={onEnter}
            inputProps={inputProps} />
            {!isEmpty(valueState) && <div onClick={onClear}
            className="cursor-pointer custom-input-close position-absolute" >
            <svg width="12.8" height="12.8" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99985 8.27997L12.1199 13.4L13.3999 12.12L8.27985 6.99997L13.3999 1.87997L12.1199 0.599968L6.99985 5.71997L1.87985 0.599968L0.599854 1.87997L5.71985 6.99997L0.599854 12.12L1.87985 13.4L6.99985 8.27997Z" fill="#18213A" />
            </svg>
          </div>}
        </form>
        {/* <button type="button" onClick={() => props.onClose && props.onClose()} className="btn btn-primary">Cancel</button> */}
      </div>
    </div>
  );
})

export default InputSearchMobile


