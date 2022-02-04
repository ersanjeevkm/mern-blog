import "./Post.css";
import { Link } from "react-router-dom";

export default function Post({ post }) {
  const photoUrl = `https://lh3.googleusercontent.com/d/${post.photo}=s400`;

  return (
    <div className="post">
      <img
        src={photoUrl}
        alt=""
        className="postImg"
        referrerPolicy="no-referrer"
      />

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
