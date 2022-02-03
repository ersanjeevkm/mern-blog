import { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginStart, LoginSuccess, LoginFailure } from "../../context/Actions";
import { Context } from "../../context/Context";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const userRef = useRef();
  const pwdRef = useRef();
  const { dispatch, isFetching } = useContext(Context);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(LoginStart());
    try {
      const res = await axios.post("/auth/login", {
        username: userRef.current.value,
        password: pwdRef.current.value,
      });
      dispatch(
        LoginSuccess({ ...res.data, auth_token: res.headers.auth_token })
      );
      navigate("/", { replace: true });
    } catch (err) {
      dispatch(LoginFailure());
    }
  };

  return (
    <div className="login">
      <span className="loginTitle">Login</span>
      <form className="loginForm" onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          className="loginInput"
          type="text"
          placeholder="Enter your username..."
          ref={userRef}
        />
        <label>Password</label>
        <input
          className="loginInput"
          type="password"
          placeholder="Enter your password..."
          ref={pwdRef}
        />
        <button className="loginButton" disabled={isFetching}>
          Login
        </button>
      </form>
      <button className="loginRegisterButton" type="submit">
        <Link className="link" to="/register">
          Register
        </Link>
      </button>
    </div>
  );
}
