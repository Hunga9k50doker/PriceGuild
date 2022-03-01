import { CompareReducerType } from "interfaces";
import { ActionTypes } from "redux/actions/action_types";
const ISSERVER = typeof window === "undefined";
let listCard = [];
if (!ISSERVER) {
  listCard = JSON.parse(localStorage.getItem("comparison") ?? "[]") ?? [];
}

let initialState: CompareReducerType = {
  cards: listCard,
};

const compareReducer = (
  state = initialState,
  action: any
): CompareReducerType => {
  switch (action.type) {
    case ActionTypes.reducer.compare.addCard: {
      return {
        ...state,
        cards: [...state.cards, action.payload],
      };
    }
    case ActionTypes.reducer.compare.removeCard: {
      return {
        ...state,
        cards: state.cards.filter((c) => c.code !== action.payload),
      };
    }
    default: {
      return state;
    }
  }
};

export default compareReducer;
