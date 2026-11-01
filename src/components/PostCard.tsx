import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import type { Post } from '../lib/api'
import { fallbackImage, postAuthor, postCategory, postDate, postExcerpt, postImage, postReadTime } from '../lib/api'

export function PostCard({ post, index }: { post: Post; index: number }) {
  const id = String(post.id ?? post.slug ?? index)
  const title = post.title || 'Untitled story'
  const image = postImage(post, index)
  const category = postCategory(post)

  return (
    <article className="post-card">
      <Link to="/posts/$postId" params={{ postId: id }} className="post-card-image" aria-label={'Read ' + title}>
        <img
          src={image}
          alt=""
          loading="lazy"
          onError={event => {
            if (!event.currentTarget.dataset.fallback) {
              event.currentTarget.dataset.fallback = 'true'
              event.currentTarget.src = fallbackImage(index + 1)
            }
          }}
        />
        {category && <span className="image-category">{category}</span>}
        <span className="image-arrow"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="post-card-copy">
        <div className="post-meta">
          <span>{postAuthor(post)}</span>
          <span className="meta-dot">·</span>
          <span>{postDate(post)}</span>
          <span className="meta-dot">·</span>
          <span>{postReadTime(post)} min read</span>
        </div>
        <h2><Link to="/posts/$postId" params={{ postId: id }}>{title}</Link></h2>
        <p className="post-excerpt">{postExcerpt(post)}</p>
      </div>
    </article>
  )
}