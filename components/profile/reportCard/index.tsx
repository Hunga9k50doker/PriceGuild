import React, { useState } from 'react';
import Select from 'react-select'
import { useSelector, useDispatch } from 'react-redux';
import Selectors from "redux/selectors";
import { useForm, SubmitHandler } from "react-hook-form";
import { SearchApis } from 'api/search';

type Inputs = {
  portf_req_sport: any,
  portf_req_year: any,
  portf_req_pub: any,
  portf_req_collection: any,
  portf_req_set_detail: any,
  portf_card_number: any,
  portf_req_player: any,
  portf_req_other: any,
};


const ReportCard = () => {
  const [stateSubmit, setStateSubmit] = useState<boolean>(false);
  const { sports } = useSelector(Selectors.config);
  const [sportSelected, setSportSelected] = useState<any>();
  
  const { register, handleSubmit, watch, reset, formState: { errors }, setValue } = useForm<Inputs>();

  const watchSport = watch("portf_req_sport")

  const onSubmit: SubmitHandler<Inputs> = async data => {
    setStateSubmit(true);
    let prms = { ...data };

    if (prms.portf_req_sport === "Other") {
      prms.portf_req_sport = prms.portf_req_sport + ' - ' + prms.portf_req_other;
    }

    SearchApis.reportCantFindCard(prms);
  };
  const getOptionValue = (option: any) => option.id;

  React.useEffect(() => {
    if (stateSubmit) { 
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [stateSubmit])
  
  const onBack = () => {
    setStateSubmit(false);
    reset({
      portf_req_sport: null,
      portf_req_year: "",
      portf_req_pub: "",
      portf_req_collection: "",
      portf_req_set_detail: "",
      portf_card_number: "",
      portf_req_player: "",
      portf_req_other: "",
    })
    setSportSelected(undefined)
  }

  return (
    <div className="col-sm-12 col-lg-10 col-md-10 col-12 min-vh-100 col-10__helper col-mobile">
      <div className="col-lg-5 col-md-5 col-sm-12 col-12 helper">
        
        {
          !Boolean(stateSubmit) ? 
            <div>
              <div >
                <h3 className="mb-0 title-profile">Can’t find a card?</h3>
                <div className="fw-bold  mt-4 helper__info"><span>Request a card to be added to the </span>  PriceGuide.Cards database</div>
                <div className="helper__description">When requesting cards that are not yet included in the Price Guide, the whole collection would be added (when processed) - so it is not necessary to submit requests for more cards from the same collection.</div>
              </div>
              <div className="form-info">
                <div className="mb-3 mt-3 hidden-select">
                  <label className="form-label">Sport</label>
                  <Select
                    onChange={(value) => {
                      setValue('portf_req_sport', value?.sportName ?? '');
                      setSportSelected(value)
                    }}
                    value={sportSelected}
                    getOptionValue={getOptionValue}
                    getOptionLabel={(option) => option.sportName}
                    className="customScroll"
                    options={[...sports, {id: 0,sportName: "Other"}]}
                    styles={{
                      // @ts-ignore
                      dropdownIndicator: (provided, state) => ({
                        ...provided,
                        transition: 'all .2s ease',
                        transform: state.selectProps.menuIsOpen && "rotate(180deg)"
                      })
                    }}
                  />
                </div>

                {watchSport === "Other" && 
                <div className="mb-3 mt-3">
                <label className="form-label">Other</label>
                <input {...register("portf_req_other")} type="text" className="form-control" />
              </div>
                }
                <div className="mb-3 mt-3">
                  <label className="form-label">Year</label>
                  <input {...register("portf_req_year")} type="text" className="form-control" />
                </div>
                <div className="mb-3 mt-3">
                  <label className="form-label">Publisher</label>
                  <input {...register("portf_req_pub")}  type="text" className="form-control" />
                </div>
                <div className="mb-3 mt-3">
                  <label className="form-label">Collection</label>
                  <input {...register("portf_req_collection")}  type="text" className="form-control" />
                </div>
                <div className="mb-3 mt-3">
                  <label className="form-label">Card Set Details</label>
                  <input {...register("portf_req_set_detail")} type="text" className="form-control" />
                </div>
                <div className="mb-3 mt-3">
                  <label className="form-label">Card Number</label>
                  <input {...register("portf_card_number")} type="text" className="form-control" />
                </div>
                <div className="mb-3 mt-3">
                  <label className="form-label">Player Name</label>
                  <input {...register("portf_req_player")}  type="text" className="form-control" />
                </div>
                <div className="mb-3 d-flex justify-content-end align-items-center">
                  {/* <button type="button" className="btn btn-secondary w-100 me-1">Cancel</button> */}
                  <button onClick={handleSubmit(onSubmit)} type="button" className="btn btn-secondary w-100 ms-1 btn-submit">Submit</button>
                </div>
              </div> 
            </div>
           : 
          <div>
              <div  className="d-flex justify-content-center flex-column align-items-center helper-request mx-0">
                <h3 className="mb-0 title-profile">Request sent</h3>
                <div className="fw-bold  mt-4 helper__info">Thanks for your request. Your request is being processed.</div>
                <button onClick={onBack}className="btn">Back to request form</button>
              </div>
          </div>
        }
       
      
      </div>
    </div>
  );
}

export default React.memo(ReportCard);
