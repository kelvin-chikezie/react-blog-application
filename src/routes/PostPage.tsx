import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react'
import { fallbackImage, getPost, postAuthor, postDate, postContent, postImage, postReadTime } from '../lib/api'

export default function PostPage() {
  const { postId } = useParams({ from: '/posts/$postId' })
  const query = useQuery({ queryKey: ['post', postId], queryFn: () => getPost(postId) })

  if (query.isPending) {
    return <main className="state-page"><div className="loading-pulse" /><p>Loading story…</p></main>
  }

  if (query.isError) {
    return (
      <main className="state-page">
        <span className="section-kicker">STORY NOT FOUND</span>
        <h1>We could not find this one.</h1>
        <p>{query.error.message}</p>
        <Link to="/" className="button button-dark"><ArrowLeft size={15} /> Back to stories</Link>
      </main>
    )
  }

  const post = query.data
  return (
    <article className="article-page">
      <Link to="/" className="back-link"><ArrowLeft size={15} /> All stories</Link>
      <div className="article-topline">
        <span className="section-kicker">FIELDNOTES JOURNAL</span>
        <span className="article-number">{postDate(post)}</span>
      </div>
      <h1>{post.title || 'Untitled story'}</h1>
      <p className="article-deck">{String(post.excerpt ?? post.description ?? '')}</p>
      <div className="article-byline">
        <span>{postAuthor(post)}</span>
        <span><CalendarDays size={14} /> {postDate(post)}</span>
        <span><Clock3 size={14} /> {postReadTime(post)} min read</span>
      </div>
      <div className="article-cover">
        <img
          src={postImage(post, 0)}
          alt=""
          onError={event => {
            if (!event.currentTarget.dataset.fallback) {
              event.currentTarget.dataset.fallback = 'true'
              event.currentTarget.src = fallbackImage(0)
            }
          }}
        />
      </div>
      <div className="article-content">
        {postContent(post).split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      <div className="article-end"><span>END OF STORY</span><span>Thanks for reading <ArrowUpRight size={14} /></span></div>
      <Link to="/" className="button button-dark article-return"><ArrowLeft size={15} /> More stories</Link>
    </article>
  )
}