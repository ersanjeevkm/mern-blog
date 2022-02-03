import "./Post.css";
import { Link } from "react-router-dom";

export default function Post({ post }) {
  const photoUrl = "https://drive.google.com/uc?id=" + post.photo;

  return (
    <div className="post">
      <img src={photoUrl} alt="" className="postImg" />

      <div className="postInfo">
        <div className="postCats">
          {post.categories.map((cat) => (
            <span className="postCat">{cat.name}</span>
          ))}
        </div>
        <Link className="link" to={`/post/${post._id}`}>
          <span className="postTitle">{post.title}</span>
        </Link>
        <hr />
        <span className="postDate">
          {new Date(post.createdAt).toDateString()}
        </span>
      </div>
      <p className="postDesc">{post.desc}</p>
    </div>
  );
}
