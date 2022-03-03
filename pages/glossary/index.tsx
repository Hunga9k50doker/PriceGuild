import React from "react";
import { api } from 'configs/axios';
import { ToastSystem } from 'helper/toast_system';
import { GlossaryType } from "interfaces"
import Skeleton from 'react-loading-skeleton';
import { useDebouncedCallback } from "utils/useDebouncedEffect"
import IconSearch from "assets/images/search.svg";
import { isEmpty } from 'lodash';
import Link from "next/link";
import IconSearchGlossary from 'assets/images/icon-search-glossary.svg';
import Head from 'next/head';

type DataType = {
  glossaries: GlossaryType[];
  categories: string[];
  isLoading: boolean;
}
const loadingArray = Array.from(Array(10).keys());

const Glossary = () => {

  const [keySearch, setKeySearch] = React.useState<string | undefined>();
  const [category, setCategory] = React.useState<string | undefined>();
  const [data, setData] = React.useState<DataType>({
    glossaries: [],
    categories: [],
    isLoading: true
  });
  const [showSearchMobile, setShowSearchMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    getListGlossary()
  }, [])

  const getListGlossary = async (keySearchState: string | undefined = undefined, categoryState: string | undefined = undefined) => {
    try {
      setData(prevState => {
        return { ...prevState, isLoading: true }
      })
      let params: any = {
        search_term: keySearchState ?? keySearch,
        category: categoryState ?? category,
      }
      params = {
        search_term: params.search_term === "" ? undefined : params.search_term,
        category: params.category === "" ? undefined : params.category,
      }
      const result = await api.v1.glossary.getListGlossary(params);
      if (result.success) {
        return setData(prevState => {
          // Object.assign would also work
          return { ...result.data, isLoading: false, categories: prevState?.categories.length ? prevState?.categories : result.data.categories };
        })
      }
      ToastSystem.error(result.message ?? result.error);
    }
    catch (err) { }
  }

  const selectedCategory = (value: string) => {
    if (category === value) {
      getListGlossary(undefined, "")
      return setCategory(undefined)
    }
    getListGlossary(undefined, value)
    setCategory(value)
  }

  const loadSuggestions = useDebouncedCallback(getListGlossary, 450);

  const handleChange = (event: any) => {
    setKeySearch(event?.target?.value)
    if (event?.target?.value.length >= 4 || event?.target?.value === "")
      loadSuggestions(event?.target?.value)
  }
  const onClear = () => {
    setKeySearch("");
    loadSuggestions("")
  }

  return (
    <div className="container-fluid glossary">
      <Head>
        <title>Trading Card Glossary | PriceGuide.Cards</title>
        <meta name="description" content="The Trading Card Glossary has a list of all terminology used within the industry, a perfect recourse for new and experianced collectors alike." />
      </Head>
      <div className="content-home">
        <div className="row">
          <nav aria-label="breadcrumb pr-0">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/" >
                    <a title="Home">
                        Home
                    </a>
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page"> Trading Card Glossary </li>
            </ol>
          </nav>
        </div>
        <div className="row glossary-content">
          <div className="col-12 col-sm-12 col-md-8 glossary-content-left">
            <div className="d-flex justify-content-between">
              <h1 className="title-profile title-profile--glossary"><span>Trading Card</span> Glossary</h1>
              <div className="section-icon">
                <img src={IconSearchGlossary} alt="" className="icon-search-mobile" onClick={() => setShowSearchMobile(!showSearchMobile)}/>
              </div>
            </div>
            {data.isLoading && loadingArray?.map(item =>
              <div key={item} className="py-3">
                <div className="fw-bold"><Skeleton /></div>
                <hr />
                <React.Fragment >
                  <div className="fw-bold mb-2"><Skeleton /></div>
                  <div className="mb-2">
                    <Skeleton count={4} />
                  </div>
                </React.Fragment>
              </div>
            )}
            {data.glossaries?.map((glossary, index) =>
              <div key={index} className={`py-3 glossary-item ${index == 0 ? 'glossary-item-first' : ''}` }>
                <div className="fw-bold glossary-item__head">{glossary.category}</div>
                <hr />
                {glossary.glossary?.map((item, key) =>
                  <React.Fragment key={key}>
                    <div className="fw-bold mb-2 glossary-item__title">{item.title}</div>
                    <div className="mb-2 white-space-pre-line glossary-item__content">
                      {item.description}
                      {/* <hr /> */}
                    </div>
                  </React.Fragment>)}
              </div>
            )}
          </div>
          {showSearchMobile &&
            <div className="section-search-mobile">
              <div className="search mt-5 position-relative">
                <div><img src={IconSearch} alt="" className="position-absolute" /></div>
                <input
                  onChange={handleChange}
                  type="text"
                  value={keySearch}
                  className="form-control"
                  placeholder="Search"
                />
                <span className="close" onClick={() => {setShowSearchMobile(!showSearchMobile)}}> Close </span>
              </div>
              <div className="mt-3 d-flex button-key flex-wrap">
                {data?.categories?.map((item, key) =>
                  <button
                    onClick={() => selectedCategory(item)}
                    key={key}
                    type="button"
                    className={`${category === item ? "active" : ""} btn `}>
                    {item}
                  </button>
                )}
              </div>
            </div>
          }
          <div className="col-12 col-sm-4 col-md-4 px-5 glossary-right">
            <div >
              <div className="search mt-5 position-relative">
                <img src={IconSearch} alt="" className="position-absolute" />
                <input
                  onChange={handleChange}
                  type="text"
                  value={keySearch}
                  className="form-control"
                  placeholder="Search"
                />
                {!isEmpty(keySearch) && <div onClick={onClear} className="cursor-pointer custom-input-close position-absolute" >
                  <svg width="12.8" height="12.8" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99985 8.27997L12.1199 13.4L13.3999 12.12L8.27985 6.99997L13.3999 1.87997L12.1199 0.599968L6.99985 5.71997L1.87985 0.599968L0.599854 1.87997L5.71985 6.99997L0.599854 12.12L1.87985 13.4L6.99985 8.27997Z" fill="#18213A" />
                  </svg>
                </div>}
              </div>
              <div className="mt-3 d-flex button-key flex-wrap">
                {data?.categories?.map((item, key) =>
                  <button
                    onClick={() => selectedCategory(item)}
                    key={key}
                    type="button"
                    className={`${category === item ? "active" : ""} btn `}>
                    {item}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Glossary;
