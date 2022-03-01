import React, { useEffect, useState } from "react";
import { RookieCardType } from "interfaces";
import BlogsApis from "api/blog_api";
import LazyLoad from "react-lazyload";
import CardDetail from "components/cardDetail";
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton';
import { formatCurrency } from "utils/helper";
import { useRouter } from 'next/router'
type ParamTypes = {
  id: string
}


const Loading = () => (
  <div className="post loading">
    <h5>Loading...</h5>
  </div>
);

const RookieCardDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [rookieData, setRookieData] = useState<RookieCardType | undefined>();
  
  const getDataRookie = async () => {
    try {
      let response = await BlogsApis.getRookieDetail(Number(id));
      setRookieData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataRookie();
  }, []);

  const gotoCard = (code: string) => {
   // history.push(`/card-detail?code=${code}`);
  }

  return (
    <div className="container rookie-cards">
      {!rookieData ? <Skeleton style={{ height: 25, width: 150 }} /> : <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="javascript:void(0)">Rookie Cards</a>
          </li>
          <li className="breadcrumb-item" aria-current="page">
            <Link href={`/rookie-cards/${rookieData?.sport_id}`}>{rookieData?.sport_name}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {rookieData?.playername}
          </li>
        </ol>
      </nav>}

      <div className="">
        <div style={{ paddingRight: "15%", paddingLeft: "15%" }}>
          <h2 className="my-3">{!rookieData ? <Skeleton style={{ height: 25, width: 150 }} /> : `${rookieData?.playername} Rookie Cards`}</h2>
          {!rookieData ? <Skeleton count={5} /> : <div
            dangerouslySetInnerHTML={{
              __html: rookieData?.introtext ?? "",
            }}
          />}
        </div>
        {!!rookieData &&
          rookieData.cards.map((rookieItem) => (
            <LazyLoad key={rookieItem.card_code} placeholder={<Loading />}>
              <div className="mb-5">
                <h3 className="my-3">{`${rookieItem.setYear} ${rookieItem.setName} - ${rookieItem.typeName}`}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: rookieItem?.card_description ?? "",
                  }}
                />
                <div className="mt-4 d-flex justify-content-center align-items-center">
                  <div className="col-lg-6 col-md-6 mb-3" >
                    <div className="product__item">
                      <div className={`position-relative p-2`}>
                        <div className={`content-product  row `}>
                          <div className="col-4 image-product ">
                            <div className="mb-1 position-relative" style={{ backgroundColor: "#CECECE", height: 146 }}>
                            </div>
                          </div>
                          <div className="col-8">
                            <div className="mb-1" style={{ fontSize: 14 }}>
                              {rookieData.sport_name} * {rookieItem.setYear} * {rookieItem.publisherName}</div>
                            <div className="mb-2" style={{ fontSize: 18, fontWeight: 400, cursor: 'pointer' }}>
                              {rookieItem.nameForWeb}
                            </div>
                            <div style={{ fontSize: 18, fontWeight: "bold" }}>{formatCurrency(rookieItem.minPrice) +
                              " - " +
                              formatCurrency(rookieItem.maxPrice)} </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDetail key={rookieItem.card_code} isGradedCardTitle={false} classContent="mt-5 mb-3 " isHideDetail={false} isHideGrid={true} isHideSaleChart={true} code={rookieItem.card_code} />
                <div className="d-flex mt-5 justify-content-center">
                  <button type="button" onClick={() => gotoCard(rookieItem.card_code)} className="btn btn-secondary">See Detailed Overview</button>
                </div>
              </div>
            </LazyLoad>
          ))}
      </div>
    </div>
  );
};

export default React.memo(RookieCardDetail);
