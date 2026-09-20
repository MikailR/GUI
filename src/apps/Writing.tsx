import { useEffect, useMemo, useRef } from 'react'
import { POSTS, type Post } from '../content/data'
import { Glyph } from '../icons/Glyph'
import type { AppScreenProps } from '../os/types'
import { AppPage, BackButton, Prose, formatDate } from './shared'

export default function Writing({ shell, route, routeVersion, onRoute }: AppScreenProps) {
  const post = useMemo(() => POSTS.find((p) => p.slug === route) ?? null, [route])
  const readerRef = useRef<HTMLDivElement | null>(null)

  // Scroll the reader to the top whenever a (possibly identical) post is requested.
  useEffect(() => {
    readerRef.current?.scrollTo({ top: 0 })
  }, [route, routeVersion])

  if (shell === 'phone') {
    if (post) {
      return (
        <AppPage shell={shell} title={post.title} eyebrow={`${post.tag} · ${formatDate(post.date)} · ${post.readMins} min`}>
          <Article post={post} onOpen={onRoute} />
        </AppPage>
      )
    }
    return (
      <AppPage shell={shell} title="Writing" eyebrow={`${POSTS.length} essays`}>
        <PostList posts={POSTS} selected={null} onSelect={onRoute} />
      </AppPage>
    )
  }

  return (
    <AppPage shell={shell} title="Writing" flush>
      <div className={`writing ${post ? 'has-selection' : ''}`}>
        <aside className="writing__side">
          <div className="writing__side-head">
            <h2>Essays</h2>
            <span className="writing__count">{POSTS.length}</span>
          </div>
          <PostList posts={POSTS} selected={post?.slug ?? null} onSelect={onRoute} compact />
        </aside>
        <div className="writing__reader" ref={readerRef}>
          {post ? (
            <>
              <div className="writing__reader-nav">
                <BackButton label="Essays" onClick={() => onRoute(null)} />
              </div>
              <Article post={post} onOpen={onRoute} />
            </>
          ) : (
            <div className="writing__placeholder">
              <Glyph name="sparkle" size={28} />
              <h3>Pick an essay</h3>
              <p>Short pieces on materials, motion and the browser as a runtime.</p>
            </div>
          )}
        </div>
      </div>
    </AppPage>
  )
}

interface PostListProps {
  posts: Post[]
  selected: string | null
  onSelect: (slug: string) => void
  compact?: boolean
}

function PostList({ posts, selected, onSelect, compact = false }: PostListProps) {
  return (
    <ul className={`post-list ${compact ? 'post-list--compact' : ''}`}>
      {posts.map((p) => (
        <li key={p.slug}>
          <button
            type="button"
            className={`post-row ${selected === p.slug ? 'is-selected' : ''}`}
            onClick={() => onSelect(p.slug)}
            aria-current={selected === p.slug ? 'true' : undefined}
          >
            <span className="post-row__meta">
              <span className="post-row__tag">{p.tag}</span>
              <span>{formatDate(p.date)}</span>
            </span>
            <span className="post-row__title">{p.title}</span>
            {!compact ? <span className="post-row__summary">{p.summary}</span> : null}
            <span className="post-row__read">{p.readMins} min read</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

function Article({ post, onOpen }: { post: Post; onOpen: (slug: string) => void }) {
  const index = POSTS.findIndex((p) => p.slug === post.slug)
  const next = POSTS[(index + 1) % POSTS.length]
  return (
    <article className="article">
      <header className="article__head">
        <div className="article__meta">
          <span className="chip chip--tint">{post.tag}</span>
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.readMins} min read</span>
        </div>
        <h1 className="article__title">{post.title}</h1>
        <p className="article__summary">{post.summary}</p>
      </header>
      <Prose body={post.body} />
      <footer className="article__foot">
        <span className="article__foot-label">Next</span>
        <button type="button" className="article__next" onClick={() => onOpen(next.slug)}>
          <span>{next.title}</span>
          <Glyph name="chevron-right" size={16} />
        </button>
      </footer>
    </article>
  )
}
