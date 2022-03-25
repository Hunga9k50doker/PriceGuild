import { FilterResponse, FilterApi } from "api/filter";
import { takeLatest, call, put } from "redux-saga/effects";
import { ActionTypes } from "redux/actions/action_types";
import { FilterType, SearchCardType } from "interfaces";
import { FilterAction } from "redux/actions/filter_action";
import { convertListDataToGrouped } from "utils/helper";
import mockup_filter from 'utils/mockup_filter.json'

function* pgAppdata(action: { type: string; action: SearchCardType }) {
  try {
    let response: FilterResponse = yield call(
      FilterApi.getFilter,
      action.action
    );
    // let response = mockup_filter;
    response.data.collections.sort(FilterType.compare);
    response.data.publishers.sort(FilterType.compare);

    convertListDataToGrouped<FilterType>(
      response.data.publishers,
      FilterType.firstLetter
    );
    // @ts-ignore
    action.setDataFilterState && action.setDataFilterState(response.data);
    yield put(
      FilterAction.updateFiltersCardDetail({
        publishers: convertListDataToGrouped(
          response.data.publishers,
          FilterType.firstLetter,
          (item1, item2) => {
            return item1.name.localeCompare(item2.name);
          }
        ),
        collections: convertListDataToGrouped(
          response.data.collections,
          FilterType.firstLetter,
          (item1, item2) => {
            return item1.name.localeCompare(item2.name);
          }
        ),
        printRuns: response.data.printRuns,
        years: response.data.years.map((item) => ({
          name: item.toString(),
          id: item,
        })),
        auto_memo: response.data.auto_memo,
        sports: response.data.sports,
      })
    );
  } catch (error) {
    console.log("error: ", error);
    yield put(
      FilterAction.updateFiltersCardDetail({
        publishers: [],
        collections: [],
        printRuns: [],
        years: [],
        auto_memo: [],
        sports: [],
      })
    );
  }
}

function* pgAppdata1stSaga() {
  yield takeLatest(ActionTypes.sagas.filter.getFilter, pgAppdata);
}

export default pgAppdata1stSaga;
