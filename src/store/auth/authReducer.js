import {
  AUTH_SUCCESS,
  AUTH_FAILURE,
  SET_PROFILE,
  REMOVE_PROFILE,
} from "./authActionTypes";

const initialState = {
  isAuthenticated: false,
  user: {},
  users: [],
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SEARCH_USER_SUCCESS":
      return { ...state, users: action.payload };
    case AUTH_SUCCESS:
      return { ...state, isAuthenticated: true };
    case AUTH_FAILURE:
      return { ...state, isAuthenticated: false };
    case SET_PROFILE:
      return { ...state, user: action.payload };
    case REMOVE_PROFILE:
      return { ...state, user: {} };
    default:
      return state;
  }
};

export default authReducer;
