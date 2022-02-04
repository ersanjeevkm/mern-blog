import { useContext, useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SinglePost.css";
import { Context } from "../../context/Context";
import { Logout } from "../../context/Actions";

export default function SinglePost() {
  const location = useLocation();
  const postId = location.pathname.split("/")[2];
  const [post, setPost] = useState({});
  const { auth_token, user, dispatch } = useContext(Context);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [update, setUpdate] = useState(false);

  const photoUrl = `https://lh3.googleusercontent.com/d/${post.photo}`;

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get("/post/" + postId);
      setPost(res.data);
      setTitle(res.data.title);
      setDesc(res.data.desc);
    };
    getPost();
  }, [postId]);

  const handleDelete = async () => {
    await axios
      .delete("/post/" + postId, { headers: { auth_token: auth_token } })
      .then(() => navigate("/", { replace: true }))
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 400 || err.response.status === 401) {
            dispatch(Logout());
            navigate("/login", { replace: true });
          }
        }
      });
  };

  const handleUpdate = async () => {
    await axios
      .put(
        "/post/" + postId,
        { title, desc },
        { headers: { auth_token: auth_token } }
      )
      .then(() => setUpdate(false))
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 400 || err.response.status === 401) {
            dispatch(Logout());
            navigate("/login", { replace: true });
          }
        }
      });
  };

  return (
    <>
      {Object.keys(post).length ? (
        <div className="singlePost">
          <div className="singlePostWrapper">
            <img
              src={photoUrl}
              alt=""
              className="singlePostImg"
              referrerPolicy="no-referrer"
              autoFocus
            />
            {update ? (
              <input
                type="text"
                value={title}
                className="singlePostTitleInput"
                onChange={(e) => setTitle(e.target.value)}
              />
            ) : (
              <h1 className="singlePostTitle">
                {title}
                {post.userId._id === user?._id && (
                  <div className="singlePostEdit">
                    <i
                      className="singlePostIcon far fa-edit"
                      onClick={() => setUpdate(true)}
                    ></i>
                    <i
                      className="singlePostIcon far fa-trash-alt"
                      onClick={handleDelete}
                    ></i>
                  </div>
                )}
              </h1>
            )}

            <div className="singlePostInfo">
              <span className="singlePostAuthor">
                Author:
                <Link to={`/?user=${post.userId.username}`} className="link">
                  <b>{post.userId.username}</b>
                </Link>
              </span>
              <span className="singlePostDate">
                {new Date(post.createdAt).toDateString()}
              </span>
            </div>
            {update ? (
              <textarea
                className="singlePostDescInput"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            ) : (
              <p className="singlePostDesc">{desc}</p>
            )}
            {update && (
              <button className="singlePostBtn" onClick={handleUpdate}>
                Update
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="singlePost">
          <div className="singlePostWrapper">
            <h1 className="singlePostTitle">Sorry post not found</h1>
          </div>
        </div>
      )}
    </>
  );
}
