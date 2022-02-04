import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Write.css";
import axios from "axios";
import { Context } from "../../context/Context";
import { Logout } from "../../context/Actions";

export default function Write() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(false);
  const [disable, setDisable] = useState(false);
  const { auth_token, user, dispatch } = useContext(Context);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setDisable(true);
    setError(false);
    e.preventDefault();

    const newPost = {
      title,
      desc,
    };

    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);

      await axios
        .post("/upload", data, { headers: { auth_token } })
        .then((res) => (newPost.photo = res.data.fileId))
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
        .post("/post", newPost, { headers: { auth_token } })
        .then((res) => {
          setDisable(false);
          window.location.replace("/post/" + res.data._id);
        })
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
  };

  return (
    <>
      {error && (
        <span style={{ color: "red", marginTop: "10px" }}>
          Something went wrong
        </span>
      )}
      <div className="write">
        {file && (
          <img className="writeImg" src={URL.createObjectURL(file)} alt="" />
        )}
        <form className="writeForm" onSubmit={handleSubmit}>
          <div className="writeFormGroup">
            <label htmlFor="fileInput">
              <i className="writeIcon fas fa-plus"></i>
            </label>
            <input
              id="fileInput"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <input
              className="writeInput"
              placeholder="Title"
              type="text"
              autoFocus={true}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="writeFormGroup">
            <textarea
              className="writeInput writeText"
              placeholder="Tell your story..."
              type="text"
              autoFocus={true}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <button className="writeSubmit" type="submit" disabled={disable}>
            Publish
          </button>
        </form>
      </div>
    </>
  );
}
