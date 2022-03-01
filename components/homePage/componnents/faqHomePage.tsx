import React, { useEffect, useState } from "react";
import { api } from "configs/axios";
import { isEmpty } from "lodash";
import Skeleton from "react-loading-skeleton";
import { useRouter } from 'next/router'
import { ToastSystem } from "helper/toast_system";

const FaqHomePage = () => {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getDataFaq = async () => {
      try {
        const result = await api.v1.getDataFAQ();
        if (result.success) {
          result.data = result.data.slice(0, 5);
         return setData(result.data);
        }
        ToastSystem.error(result.message);
      } catch (err) {
        console.log(err);
      }
    };
    getDataFaq();
  }, []);

  const onReadMore = () => {
    router.push("/faq")
  }

  return (
    <div className="content-home faq-container">
      <div className="row">
        <div className="col-12 col-sm-7">
          <h2 className="title"> FAQ </h2>
          {data?.map((item: any, key: number) => (
            <div key={key} className="detail-faq">
              <div className="title-description">{item?.question}</div>
              <div dangerouslySetInnerHTML={{ __html: item?.answer }} />
            </div>
          ))}
          {isEmpty(data) &&
            Array.from(Array(10).keys()).map(
              (item: any) => (
                <div key={item} className="detail-faq">
                  <div className="title-description">
                    <Skeleton />
                  </div>
                  <Skeleton />
                </div>
              )
            )}
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-sm-7  d-flex justify-content-center align-items-center">
          <button onClick={onReadMore} type="button" className="btn-red-more" title="Read More"> Read More </button>
        </div>
      </div>
    </div>
  );
};

export default FaqHomePage;
