import { createContext, useEffect, useReducer } from "react";
import axios from "axios";
import Reducer from "./Reducer";

const INIT_STATE = {
  auth_token: JSON.parse(localStorage.getItem("auth_token")) || null,
  user: null,
  isFetching: false,
  error: false,
};

export const Context = createContext(INIT_STATE);

export const ContextProvider = ({ children }) => {
  let [state, dispatch] = useReducer(Reducer, INIT_STATE);

  useEffect(() => {
    const newState = async () => {
      try {
        const res = await axios.get("/user", {
          headers: { auth_token: state.auth_token },
        });
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { ...res.data, auth_token: state.auth_token },
        });
      } catch (err) {
        dispatch({ type: "LOGOUT" });
        {
          window.location.pathname !== "/login" &&
            window.location.assign("/login");
        }
      }
    };

    if (state.auth_token) newState();
  }, []);

  useEffect(() => {
    if (state.auth_token)
      localStorage.setItem("auth_token", JSON.stringify(state.auth_token));
    else localStorage.setItem("auth_token", null);
  }, [state.auth_token]);

  return (
    <Context.Provider value={{ ...state, dispatch }}>
      {children}
    </Context.Provider>
  );
};
