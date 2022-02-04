const Reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        auth_token: null,
        user: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      const { auth_token, ...others } = action.payload;
      return {
        auth_token,
        user: others,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        auth_token: null,
        user: null,
        isFetching: false,
        error: true,
      };
    case "LOGOUT":
      return {
        auth_token: null,
        user: null,
        isFetching: false,
        error: false,
      };
    case "UPDATE_START":
      return {
        ...state,
        isFetching: true,
      };
    case "UPDATE_SUCCESS":
      return {
        auth_token: state.auth_token,
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "UPDATE_FAILURE":
      return {
        auth_token: state.auth_token,
        user: state.user,
        isFetching: false,
        error: true,
      };
    default:
      return state;
  }
};

export default Reducer;
