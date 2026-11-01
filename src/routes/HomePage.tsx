import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react'
import { fallbackImage, getPosts, postCategory, postDate, postExcerpt, postImage, postReadTime, type Post } from '../lib/api'
import { PostCard } from '../components/PostCard'

function FeaturedStory({ post }: { post: Post }) {
  const id = String(post.id ?? post.slug ?? '')
  return (
    <section className="featured-section" aria-label="Featured story">
      <Link to="/posts/$postId" params={{ postId: id }} className="featured-story">
        <img
          src={postImage(post, 0)}
          alt=""
          fetchPriority="high"
          onError={event => {
            if (!event.currentTarget.dataset.fallback) {
              event.currentTarget.dataset.fallback = 'true'
              event.currentTarget.src = fallbackImage(0)
            }
          }}
        />
        <span className="featured-scrim" />
        <div className="featured-copy">
          <span className="featured-label">FEATURED STORY</span>
          <h1>{post.title || 'Untitled story'}</h1>
          <p>{postExcerpt(post)}</p>
          <span className="featured-meta">{postDate(post)} <span>·</span> {postReadTime(post)} min read</span>
        </div>
        <span className="featured-arrow"><ArrowUpRight size={25} /></span>
      </Link>
    </section>
  )
}

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const postsQuery = useQuery({ queryKey: ['posts'], queryFn: getPosts })
  const allPosts = postsQuery.data ?? []

  const categories = useMemo(
    () => Array.from(new Set(allPosts.map(postCategory).filter(Boolean))),
    [allPosts]
  )

  const filteredPosts = useMemo(() => {
    const term = search.trim().toLowerCase()
    return allPosts.filter(post => {
      const matchesSearch = !term || [
        post.title, post.excerpt, post.description, post.content, post.body, postCategory(post)
      ].some(value => String(value ?? '').toLowerCase().includes(term))
      const matchesCategory = selectedCategory === 'All' || postCategory(post) === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [allPosts, search, selectedCategory])

  const featuredPost = filteredPosts[0]
  const remainingPosts = featuredPost ? filteredPosts.slice(1) : []

  return (
    <>
      {featuredPost && <FeaturedStory post={featuredPost} />}
      <section className="stories-section" id="stories">
        <div className="section-heading">
          <div>
            <span className="section-kicker">THE JOURNAL</span>
            <h2>{search || selectedCategory !== 'All' ? 'Stories for you' : 'Recent blog posts'}</h2>
            <p>Ideas, perspectives, and notes worth spending time with.</p>
          </div>
          <label className="search-box">
            <Search size={16} />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search stories"
              aria-label="Search stories"
            />
          </label>
        </div>

        {categories.length > 0 && (
          <div className="category-filters" aria-label="Filter stories by category">
            {['All', ...categories].map(category => (
              <button
                type="button"
                key={category}
                className={selectedCategory === category ? 'category-chip selected' : 'category-chip'}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'All' ? 'All stories' : category}
              </button>
            ))}
          </div>
        )}

        {postsQuery.isPending ? (
          <div className="loading-grid" aria-label="Loading stories">
            <div /><div /><div />
          </div>
        ) : postsQuery.isError ? (
          <div className="inline-state">
            <h3>We could not load the stories.</h3>
            <p>{postsQuery.error.message}. Check your connection and try again.</p>
            <button className="text-button" onClick={() => void postsQuery.refetch()}>Try again <ArrowRight size={14} /></button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty-state">
            <h3>{search || selectedCategory !== 'All' ? 'No stories found.' : 'The page is quiet for now.'}</h3>
            <p>{search || selectedCategory !== 'All' ? 'Try another search or category.' : 'There are no published posts to show yet. Be the first to add a story.'}</p>
            {!search && <Link to="/new" className="empty-link">Write the first story <ArrowUpRight size={15} /></Link>}
          </div>
        ) : remainingPosts.length === 0 ? (
          <p className="single-result-note">That is the only story matching this view.</p>
        ) : (
          <div className="posts-grid">
            {remainingPosts.map((post, index) => (
              <PostCard key={String(post.id ?? post.slug ?? index)} post={post} index={index + 1} />
            ))}
          </div>
        )}
        {postsQuery.data && postsQuery.data.length > 1 && !postsQuery.isError && (
          <div className="stories-end">YOU HAVE REACHED THE END</div>
        )}
      </section>
    </>
  )
}