import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBlogs, getBlogBySlug } from '../services/api';
import { formatDate } from '../utils/helpers';
import './Blog.css';

export function BlogList() {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => { getBlogs().then(res => setBlogs(res.data)).catch(() => {}); }, []);

  return (
    <div className="blog-page"><div className="container">
      <div className="static-hero"><h1>Tin Tức & Hướng Dẫn</h1><p>Kiến thức về mô hình lắp ráp</p></div>
      {blogs.length === 0 ? (
        <p style={{textAlign:'center', padding:'60px 0', color:'var(--color-text-muted)'}}>Chưa có bài viết nào.</p>
      ) : (
        <div className="blog-grid">
          {blogs.map(b => (
            <Link key={b.id} to={`/tin-tuc/${b.slug}`} className="blog-card">
              {b.imageUrl && <img src={b.imageUrl} alt={b.title} className="blog-card-img" />}
              <div className="blog-card-body">
                <span className="blog-date">{formatDate(b.createdAt)}</span>
                <h3>{b.title}</h3>
                {b.summary && <p>{b.summary}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div></div>
  );
}

export function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  useEffect(() => { getBlogBySlug(slug).then(res => setBlog(res.data)).catch(() => {}); }, [slug]);
  if (!blog) return <div className="blog-page"><div className="container"><p>Đang tải...</p></div></div>;

  return (
    <div className="blog-page"><div className="container">
      <div className="blog-detail">
        <Link to="/tin-tuc" className="blog-back">← Quay lại</Link>
        <h1>{blog.title}</h1>
        <div className="blog-meta"><span>Bởi {blog.author}</span> • <span>{formatDate(blog.createdAt)}</span></div>
        {blog.imageUrl && <img src={blog.imageUrl} alt="" className="blog-cover" />}
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
    </div></div>
  );
}
