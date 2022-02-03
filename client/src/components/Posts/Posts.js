import Post from "../Post/Post";
import "./Posts.css";

export default function Posts({ posts }) {
  return (
    <div className="posts">
      {posts.length
        ? posts.map((post) => <Post post={post} />)
        : "Sorry No Post"}
    </div>
  );
}
