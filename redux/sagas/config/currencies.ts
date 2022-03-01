import { FilterResponse, FilterApi } from "api/filter";
import { takeLatest, call, put } from "redux-saga/effects";
import { ActionTypes } from "redux/actions/action_types";
import { FilterType, SearchCardType } from "interfaces";
import { ConfigAction } from "redux/actions/config_action";
import { convertListDataToGrouped } from "utils/helper";
import { QueryResponse, SelectDefultType } from "interfaces";
import { api } from "configs/axios";

function* currencieData(action: { type: string; action: SearchCardType }) {
  try {
    let response: QueryResponse<Array<string>> = yield call(
      api.v1.config.getCurrencies
    );
    const data: Array<SelectDefultType> = response.data.map((item) => ({
      value: item,
      label: item,
    }));
    yield put(ConfigAction.updateCurrencies(data));
  } catch (error) {
    console.log("error: ", error);
  }
}

function* currenciesSaga() {
  yield takeLatest(ActionTypes.sagas.config.getCurrencies, currencieData);
}

export default currenciesSaga;
