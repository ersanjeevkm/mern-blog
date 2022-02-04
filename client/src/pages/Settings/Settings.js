import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import Sidebar from "../../components/SideBar/SideBar";
import { useContext } from "react";
import { Context } from "../../context/Context";
import {
  UpdateStart,
  UpdateSuccess,
  UpdateFailure,
  Logout,
} from "../../context/Actions";
import axios from "axios";

export default function Settings() {
  const navigate = useNavigate();

  const { user, auth_token, dispatch } = useContext(Context);
  const photoUrl = `https://lh3.googleusercontent.com/d/${user?.profilePic}=s200`;

  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [disable, setDisable] = useState(false);

  const handleDelete = async () => {
    await axios
      .delete("/user/", { headers: { auth_token: auth_token } })
      .then(() => {
        dispatch(Logout());
        navigate("/register", { replace: true });
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 400 || err.response.status === 401) {
            dispatch(Logout());
            navigate("/login", { replace: true });
          }
        }
      });
  };

  const handleSubmit = async (e) => {
    setSuccess(false);
    setDisable(true);
    setError(false);
    e.preventDefault();

    dispatch(UpdateStart());

    const updatedUser = {};

    if (username.length > 0) updatedUser.username = username;
    if (email.length > 0) updatedUser.email = email;
    if (password.length > 0) updatedUser.password = password;

    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);

      await axios
        .post("/upload", data, { headers: { auth_token } })
        .then((res) => (updatedUser.profilePic = res.data.fileId))
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 400 || err.response.status === 401) {
              dispatch(Logout());
              navigate("/login", { replace: true });
            } else {
              setError(true);
              setDisable(false);
            }
          }
        });
    }

    if (!error) {
      await axios
        .put("/user", updatedUser, { headers: { auth_token } })
        .then((res) => {
          setSuccess(true);
          setDisable(false);
          dispatch(UpdateSuccess(res.data));
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 400 || err.response.status === 401) {
              dispatch(Logout());
              navigate("/login", { replace: true });
            } else {
              setError(true);
              setDisable(false);
              dispatch(UpdateFailure());
            }
          }
        });
    }
  };

  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsTitleUpdate">Update Your Account</span>
          <span className="settingsTitleDelete" onClick={handleDelete}>
            Delete Account
          </span>
        </div>
        <form className="settingsForm" onSubmit={handleSubmit}>
          <label>Profile Picture</label>
          <div className="settingsPP">
            <img
              src={file ? URL.createObjectURL(file) : photoUrl}
              alt=""
              referrerPolicy="no-referrer"
            />
            <label htmlFor="fileInput">
              <i className="settingsPPIcon far fa-user-circle"></i>{" "}
            </label>
            <input
              id="fileInput"
              type="file"
              style={{ display: "none" }}
              className="settingsPPInput"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <label>Username</label>
          <input
            type="text"
            placeholder={user.username}
            name="name"
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            placeholder={user.email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="settingsSubmitButton"
            type="submit"
            disabled={disable}
          >
            Update
          </button>
          {success && (
            <span
              style={{ color: "green", textAlign: "center", marginTop: "20px" }}
            >
              Profile has been updated..
            </span>
          )}
          {error && (
            <span
              style={{ color: "red", textAlign: "center", marginTop: "20px" }}
            >
              Try with different credentials/ Something went wrong..
            </span>
          )}
        </form>
      </div>
      <Sidebar />
    </div>
  );
}
