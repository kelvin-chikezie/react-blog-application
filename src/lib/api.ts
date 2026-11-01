export const API_BASE_URL='https://api.oluwasetemi.dev'

export interface Post {
  id: string | number
  title: string
  content?: string
  body?: string
  description?: string
  excerpt?: string
  slug?: string
  createdAt?: string
  created_at?: string
  updatedAt?: string
  updated_at?: string
  publishedAt?: string
  published?: string
  author?: { name?: string; username?: string; displayName?: string } | string
  [key: string]: unknown
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=85'
]

function unwrapPosts(payload: unknown): Post[] {
  if (Array.isArray(payload)) return payload as Post[]
  if (payload && typeof payload === 'object') {
    const data = payload as Record<string, unknown>
    for (const key of ['posts', 'data', 'results', 'items']) {
      const value = data[key]
      if (Array.isArray(value)) return value as Post[]
      if (value && typeof value === 'object' && Array.isArray((value as Record<string, unknown>).posts)) {
        return (value as { posts: Post[] }).posts
      }
    }
  }
  return []
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(API_BASE_URL + path, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers
    }
  })
  if (!response.ok) {
    let detail = ''
    try {
      const body = await response.json() as Record<string, unknown>
      detail = String(body.message ?? body.error ?? '')
    } catch {
      // The API returned a non-JSON error response.
    }
    throw new Error(detail || 'Request failed with status ' + response.status)
  }
  return response.json() as Promise<T>
}

export async function getPosts(): Promise<Post[]> {
  return unwrapPosts(await request<unknown>('/posts'))
}

export async function getPost(id: string): Promise<Post> {
  const payload = await request<unknown>('/posts/' + encodeURIComponent(id))
  if (payload && typeof payload === 'object' && 'data' in payload) {
    const data = (payload as { data: unknown }).data
    if (data && typeof data === 'object' && 'post' in data) return (data as { post: Post }).post
    return data as Post
  }
  if (payload && typeof payload === 'object' && 'post' in payload) return (payload as { post: Post }).post
  return payload as Post
}

export async function createPost(input: { title: string; content: string }): Promise<Post> {
  const payload = await request<unknown>('/posts', { method: 'POST', body: JSON.stringify(input) })
  if (payload && typeof payload === 'object' && 'data' in payload) return (payload as { data: Post }).data
  if (payload && typeof payload === 'object' && 'post' in payload) return (payload as { post: Post }).post
  return payload as Post
}

function plainText(value: unknown): string {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

export function postExcerpt(post: Post): string {
  const raw = post.excerpt || post.description || post.content || post.body || 'A story worth taking a moment to read.'
  const text = plainText(raw)
  return text.length > 155 ? text.slice(0, 152).trimEnd() + '…' : text
}

export function postContent(post: Post): string {
  return String(post.content ?? post.body ?? post.description ?? post.excerpt ?? 'This story does not have any content yet.')
}

export function postDate(post: Post): string {
  const value = post.publishedAt ?? post.published ?? post.createdAt ?? post.created_at ?? post.updatedAt ?? post.updated_at
  if (!value) return 'Recently published'
  const date = new Date(String(value))
  return Number.isNaN(date.getTime())
    ? 'Recently published'
    : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export function postAuthor(post: Post): string {
  if (typeof post.author === 'string') return post.author
  if (post.author && typeof post.author === 'object') {
    return post.author.displayName ?? post.author.name ?? post.author.username ?? 'Fieldnotes'
  }
  return 'Fieldnotes'
}

export function postReadTime(post: Post): number {
  const words = plainText(post.content ?? post.body ?? post.description ?? post.excerpt).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}

export function postCategory(post: Post): string {
  const record = post as Record<string, unknown>
  const candidate = record.category ?? record.categories ?? record.tags ?? record.labels
  const first = Array.isArray(candidate) ? candidate[0] : candidate
  if (typeof first === 'string') return first
  if (first && typeof first === 'object') {
    const item = first as Record<string, unknown>
    return String(item.name ?? item.title ?? item.label ?? '')
  }
  if (first) return String(first)
  return ''
}

function imageUrl(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
    const item = value as Record<string, unknown>
    return String(item.url ?? item.src ?? item.href ?? '')
  }
  return ''
}

export function postImage(post: Post, index = 0): string {
  const record = post as Record<string, unknown>
  const candidates = [
    record.coverImage, record.cover_image, record.featuredImage, record.featured_image,
    record.thumbnail, record.thumbnailUrl, record.thumbnail_url, record.imageUrl,
    record.image_url, record.image, record.photo, record.media,
    Array.isArray(record.images) ? record.images[0] : undefined
  ]
  for (const candidate of candidates) {
    const url = imageUrl(candidate)
    if (/^(https?:\/\/|\/)/i.test(url)) return url
  }
  return fallbackImage(index)
}

export function fallbackImage(index = 0): string {
  return fallbackImages[Math.abs(index) % fallbackImages.length]
}

export function authorAvatar(post: Post): string {
  if (!post.author || typeof post.author !== 'object') return ''
  const author = post.author as Record<string, unknown>
  const image = author.image
  return imageUrl(image)
}