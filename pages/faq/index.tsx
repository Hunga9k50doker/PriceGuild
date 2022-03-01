import React, { useEffect, useState } from "react";
import { api } from "configs/axios";
import { isEmpty } from "lodash";
import Skeleton from 'react-loading-skeleton'
import { ToastSystem } from "helper/toast_system";
import Link from "next/link";

const FAQPage = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const getDataFaq = async () => {
      try {
        const result = await api.v1.getDataFAQ();
        if (result.success) {
          return setData(result.data);
        }
        ToastSystem.error(result.message);
      } catch (err) {
        console.log(err);
      }
    };
    getDataFaq();
  }, []);

  return (
    <section id="page-resd">
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mt-25 pb-10 mb-80 line-bottom">
            <li className="breadcrumb-item">
              <Link href="/" >
                    <a title="Home">
                        Home
                    </a>
                </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page"> FAQ </li>
          </ol>
        </nav>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="title txt-left-mob"> Frequently Asked Questions </h1>
            <div className="entry-content maxw-750">
              {data?.map((item: any, key: number) => (
                <React.Fragment key={key}>
                  <div className="questions">
                   {item?.question}
									</div>
                  <p dangerouslySetInnerHTML={{__html: item?.answer}}/>
                </React.Fragment>
              ))} 
							{isEmpty(data) && Array.from(Array(10).keys()).map((item: any) =>
								<div key={item}>
									 <div className="questions">
									 <Skeleton />
									</div>
									<p><Skeleton count={5} /></p>
								</div>
							)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQPage;
