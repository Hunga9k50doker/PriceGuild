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
}

const App = ({
  sport,
  placeholder = "Search for Сards",
  defaultSearch = "",
  ...props
}: PropTypes) => {

  const [value, setValue] = useState("");
  let router = useRouter();
  const [valueState, setValueState] = useState();
  const [suggestions, setSuggestions] = useState([])
  const [keySearch, setKeySearch] = useState<string>("");
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
    onChange: onChange
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
  }, [router.query])

  const onClear = () => {
    setKeySearch("")
    setValue("")
    // @ts-ignore
    setValueState()
    setSuggestions([])
  }

  return (
    <div className="position-relative">
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
      {!isEmpty(valueState) && <div onClick={onClear} className="cursor-pointer custom-input-close position-absolute" >
        <svg width="12.8" height="12.8" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99985 8.27997L12.1199 13.4L13.3999 12.12L8.27985 6.99997L13.3999 1.87997L12.1199 0.599968L6.99985 5.71997L1.87985 0.599968L0.599854 1.87997L5.71985 6.99997L0.599854 12.12L1.87985 13.4L6.99985 8.27997Z" fill="#18213A" />
        </svg>
      </div>}
      <button disabled={isEmpty(keySearch)} onClick={onSearch} type="button" className="btn btn-primary">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.361 20.2168L16.601 15.2662C17.8249 13.8113 18.4954 11.9807 18.4954 10.075C18.4954 5.62251 14.8729 2 10.4205 2C5.96797 2 2.34546 5.62251 2.34546 10.075C2.34546 14.5275 5.96797 18.15 10.4205 18.15C12.092 18.15 13.6849 17.6458 15.0467 16.6888L19.8429 21.677C20.0434 21.8852 20.313 22 20.602 22C20.8755 22 21.1349 21.8957 21.3319 21.7061C21.7504 21.3034 21.7637 20.6357 21.361 20.2168ZM10.4205 4.10652C13.7115 4.10652 16.3889 6.78391 16.3889 10.075C16.3889 13.3661 13.7115 16.0435 10.4205 16.0435C7.12936 16.0435 4.45198 13.3661 4.45198 10.075C4.45198 6.78391 7.12936 4.10652 10.4205 4.10652Z" fill="white" />
        </svg>
      </button>
    </div>
  );

}

export default App
