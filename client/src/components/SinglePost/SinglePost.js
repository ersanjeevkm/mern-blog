import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./SinglePost.css";

export default function SinglePost() {
  const location = useLocation();
  const postId = location.pathname.split("/")[2];
  const [post, setPost] = useState({});

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get("/post/" + postId);
      setPost(res.data);
    };
    getPost();
  }, [postId]);

  return (
    <>
      {Object.keys(post).length ? (
        <div className="singlePost">
          <div className="singlePostWrapper">
            {post.photo && (
              <img src={post.photo} alt="" className="singlePostImg" />
            )}
            <h1 className="singlePostTitle">
              {post.title}
              <div className="singlePostEdit">
                <i className="singlePostIcon far fa-edit"></i>
                <i className="singlePostIcon far fa-trash-alt"></i>
              </div>
            </h1>

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
            <p>{post.desc}</p>
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
