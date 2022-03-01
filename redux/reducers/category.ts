import { IChooseCategory } from "interfaces";
import { ActionTypes } from "redux/actions/action_types";

let initialState: IChooseCategory = {
  category_id: -1
};

const categoryReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ActionTypes.reducer.category.setValueDefault: {
      return initialState;
    }

    case ActionTypes.reducer.category.getValueDefault: {
      return {
        category_id: action.payload.category_id
      };
    }

    default: {
      return state;
    }
  }
};

export default categoryReducer;
