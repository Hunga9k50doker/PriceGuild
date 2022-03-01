import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import ScrollspyNav from "components/scrollspy/lib/ScrollspyNav";
import ArrowGray from "assets/images/arrow-gray.svg";

const LoadingCollectionDetail = () => {
  return (
    <>
      <div className="nav-scrollspy">
        <ScrollspyNav
          offset={80}
          scrollTargetIds={[1, 2, 3].map((item) => `section_loading${item}`)}
          activeNavClass="is-active"
          scrollDuration="100"
        >
          <ul className="nav nav-pills nav-justified content-collection">
            {[1, 2, 3].map((item, index) => (
              <li key={index} className="nav-item">
                <a className="nav-link" href={`#section_loading_${item}`}>
                  <span>
                    <Skeleton />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </ScrollspyNav>
      </div>

      <div className="content content-home content-conllection-data">
        {[1, 2, 3]?.map((item, index) => (
          <div
            className="section-collection"
            id={`section_loading_${item}`}
            key={index}
          >
            <div className="fs-3 mb-5 collection_memo_title">
              <Skeleton width={"50%"} />
            </div>
            <div className="">
              {[1].map((type, key) => (
                <React.Fragment key={key}>
                  <div className="row section-memo">
                    <div className="col-12">
                      <div
                        className="memo_types_title d-flex justify-content-between"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapseCollection_${key}`}
                        role="button"
                        aria-expanded="false"
                        aria-controls="collapseCollection"
                      >
                        <div className="memo_types_title--detail">
                          <span className="me-3">
                            <Skeleton width={100} />
                          </span>
                          <span>
                            <Skeleton width={40} />{" "}
                          </span>
                        </div>

                        <img src={ArrowGray} alt="ArrowGray" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {[1, 2, 3, 4, 5, 6].map((colorItem, k) => (
                      <div
                        key={k}
                        className="col-6 box-item-memo collapse show"
                        id={`collapseCollection_${key}`}
                      >
                        <div key={k} style={{ padding: 15 }}>
                          <div>
                            <Skeleton height={50} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default React.memo(LoadingCollectionDetail);
