import { ActionTypes } from "./action_types";

const categoryAction = {
  getValueDefault: () => ({
    type: ActionTypes.reducer.category.getValueDefault,
  }),

  setValueUpdate: (object: any) => ({
    type:  ActionTypes.reducer.category.setValueDefault,
    payload: object,
  }),
};

export default categoryAction;
