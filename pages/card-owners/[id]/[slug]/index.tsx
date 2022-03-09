import React, { useEffect, useState } from "react";
import { api } from "configs/axios";
import { useRouter } from 'next/router'
import Link from 'next/link'
import Skeleton from "react-loading-skeleton";
import { userClass } from "utils/constant";
import { inRange, isEmpty } from "lodash";
import { formatCurrency, gen_card_url } from "utils/helper";
// @ts-ignore
import $ from "jquery";
import { User } from "model/user";
import { MyStorage } from "helper/local_storage";
import Head from "next/head";

type PropTypes = {
  location: any;
};

type DataType = {
  descriptive_stats: any;
  user_data: any[];
};

const CardOwnersPage: React.FC<PropTypes> = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const [data, setData] = useState<DataType>();
  
  useEffect(() => {
    const getDataOwenrs = async () => {
      setIsLoading(true);
      try {
        const result =
          await api.v1.collectors_catalog.pg_app_collectors_catalog({
            card_code: router?.query?.id,
            table: "portfolio",
          });
        if (result.success) {
          setData(result.data);
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    };
    if(!isEmpty(router.query)){
      getDataOwenrs();
    }
  }, [router.query]);

  const getLevelUser = (point: number) => {
    const level = userClass.find((item) => {
      return inRange(point, item.min, item.max);
    });
    if (level) {
      return level?.level;
    }
    return userClass[userClass.length-1]?.level;
  };
  const onScroll = () => {
    if(!$("#customScroll").hasClass('custom-scroll-sticky')) {
      $("#customScroll").addClass('custom-scroll-sticky');
    } else {
      if($("#customScroll table").offset().left == 14 ) {
        $("#customScroll").removeClass('custom-scroll-sticky');
      }
    }
  }

  const renderLinkProfile = (id: number) => {
    
    let user: User = MyStorage.user;

    if (user?.userid === id) {
      return '/profile/personal';
    }
    return `/profile/${id}`
  }
  return (
    <>
      <Head>
        <title>{
          //@ts-ignore
          props?.titlePage ?? ''}</title>
        <meta name="description" content={
          //@ts-ignore
          props?.descriptionPage ?? ''} />
      </Head>
      <section id="page-resd">
        <div className="container-fluid container--card-owner">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb breadcrumb--card-owner mt-25 pb-10 mb-80 line-bottom">
              {isLoading ? <Skeleton width={150} /> : <>
                <li className="breadcrumb-item">
                  <Link href={`/collections/${data?.descriptive_stats?.sport?.name.replace(/\s/g, '').toLowerCase()}`}>
                    <a title="Search">
                      {data?.descriptive_stats?.sport?.name} Card Collections
                    </a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href={`/${data?.descriptive_stats?.set?.url}`}>
                    <a title={`${data?.descriptive_stats?.year?.name} ${data?.descriptive_stats?.set?.name} ${data?.descriptive_stats?.sport?.name} Cards`}>
                      {data?.descriptive_stats?.set?.title} Cards
                    </a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href={`/checklist/${data?.descriptive_stats?.type.id}/${data?.descriptive_stats?.color.code}/${data?.descriptive_stats?.color.url}`}>
                    <a title={`${data?.descriptive_stats?.type?.name} - ${data?.descriptive_stats?.color?.name}`}>
                      {data?.descriptive_stats?.type?.name} - {data?.descriptive_stats?.color?.name}
                    </a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href={`/card-details/${data?.descriptive_stats.code}/${gen_card_url(data?.descriptive_stats.webName, data?.descriptive_stats.OnCardCode)}`}>
                    <a title={data?.descriptive_stats?.lastname}>
                      {data?.descriptive_stats?.lastname}
                    </a>
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Card Owners
                </li>
              </>}
            </ol>
          </nav>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="title-sub"> {isLoading ? <Skeleton /> : <>
                {data?.descriptive_stats.lastname} #{data?.descriptive_stats.OnCardCode}
              </>}  </div>
              <h2 className="title"> Card Owners </h2>
              <div className="content mb-160">
                <div className="table-responsive" id="customScroll" onScroll={onScroll}>
                  <table className="table table-striped mwidth-600">
                    <thead>
                      <tr>
                        <th className="text-center wid-40">#</th>
                        <th>User</th>
                        <th>User Class</th>
                        <th>Grade</th>
                        <th>Latest Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading &&
                        Array.from(Array(5).keys()).map(
                          (item: any, key: number) => (
                            <tr key={key}>
                              <td className="text-center">
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton />
                              </td>
                            </tr>
                          )
                        )}
                      {data?.user_data.map((item: any, key: number) => (
                        <tr key={key}>
                          <td className="text-center">{key + 1}</td>
                          <td>
                            <Link href={renderLinkProfile(item?.id)}>
                              <a className="user_link text-decoration-none">
                                {item.username}
                              </a>
                            </Link>
                          </td>
                          <td>{getLevelUser(item.user_points)}</td>
                          <td>
                            {item?.cards?.map((card: any, index: number) => (
                              <React.Fragment key={index}>
                                {Boolean(index) && <br />}
                                {card.grade}
                              </React.Fragment>
                            ))}
                          </td>
                          <td>
                            {item?.cards?.map((card: any, index: number) => (
                              <React.Fragment key={index}>
                                {Boolean(index) && <br />}
                                {Boolean(card.lastest_value) ? formatCurrency(card.lastest_value) : "N/A"}
                              </React.Fragment>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section></>
  );
};

export const getServerSideProps = async (context: any) => { 
  try {
    
    const ctx = context?.query;
    
    let titlePage = `Card Owners ${ctx.slug} | PriceGuide.Cards`;
    let descriptionPage = `${ctx.slug} Card Owners`;

    return {props:{
     titlePage,
     descriptionPage
    }}

  } catch (error) {
    
  }
  return {
    props: {},
  };
}

export default CardOwnersPage;
