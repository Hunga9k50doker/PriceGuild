import React, { useEffect, useState } from "react";
import Select from "react-select";
import { api } from "configs/axios";
import { SportType } from "interfaces";
import InputSearch from "components/smartSearch/inputSearch";
import { useDispatch } from "react-redux";
import { ConfigAction } from "redux/actions/config_action";

const defaultSport: SportType = {
  id: 0,
  sportName: "All Sports",
};

type PropsType = {
  onGetDataSprot?: (item: Array<SportType>) => void;
  sportId?: number;
  onSelectSport?: (item: SportType) => void;
  defaultSearch?: string;
  defaultSport?: string;
  isHomePage?: number;
  sportName?: string;
  isArrow?: number;
};

function SmartSearch(props: PropsType) {
  const dispatch = useDispatch();
  const [sports, setSports] = useState<Array<SportType>>([]);
  const [sport, setSport] = useState<SportType | null>(defaultSport);

  React.useEffect(() => {
    if (props.defaultSport && sports?.length) {
      // @ts-ignore
      setSport(sports.find((item) => item.id === +props.defaultSport));
    }
  }, [props.defaultSport, sports]);

  useEffect(() => {
    const listSport = async (): Promise<void> => {
      try {
        const res = await api.v1.getListSport();
        if (res.success) {
          dispatch(ConfigAction.updateSports([...res.data]));
          if (props.sportId || props.sportName) {
            const sportSelected =
              res.data.find((item) => item.id === props.sportId || item?.sportName.replace(/\s/g, "")?.toLowerCase() === props.sportName) ??
              defaultSport;
            setSport(sportSelected);
            props.onSelectSport && props.onSelectSport(sportSelected);
          }
          res.data.unshift(defaultSport);
          setSports(res.data);
          props.onGetDataSprot && props.onGetDataSprot(res.data);
        }
      } catch (error) {
        console.log("error........", error);
      }
    };
    listSport();
  }, [props.sportId, props.sportName]);

  const getOptionValue = (option: any) => option.id;

  return (
    <div
      className={`d-flex smart-search-card ${props.isHomePage && props.isHomePage == 1 ? "smart-search-card-home" : ""} ${
        props.isArrow == 1 ? "show" : ""
      }`}
    >
      <div style={{ flex: 1 }}>
        <Select
          isDisabled={Boolean(props.sportId || props.sportName)}
          className="react-select-sport"
          classNamePrefix="react-select-sport"
          isClearable={false}
          value={sport}
          onChange={(e) => setSport(e)}
          getOptionValue={getOptionValue}
          getOptionLabel={(option) => option.sportName}
          options={sports}
          styles={{
            // @ts-ignore
            dropdownIndicator: (provided, state) => ({
              ...provided,
              transition: "all .2s ease",
              transform: state.selectProps.menuIsOpen && "rotate(180deg)",
            }),
          }}
          isSearchable={false}
        />
      </div>
      <div className="smart-search-card-input" style={{ flex: 4 }}>
        <InputSearch defaultSearch={props.defaultSearch} sport={sport} />
      </div>
    </div>
  );
}

export default SmartSearch;
