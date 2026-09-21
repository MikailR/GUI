import { Fragment } from 'react'
import { POSTS, type Post } from '../content/data'
import { Symbol } from '../icons/Symbol'
import { AppFrame } from './frame'
import type { AppProps } from './types'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Writing({ shell, route, onRoute }: AppProps) {
  const selected = POSTS.find((post) => post.slug === route) ?? (shell === 'mac' ? POSTS[0] : undefined)
  const nested = shell === 'ios' && selected !== undefined

  const list = (
    <div className="post-list">
      {shell === 'mac' ? <div className="mac-sidebar-title">Essays</div> : null}
      {POSTS.map((post) => (
        <button
          key={post.slug}
          type="button"
          className="post-item"
          aria-current={selected?.slug === post.slug || undefined}
          onClick={() => onRoute(post.slug)}
        >
          <span className="post-item-top">
            <span className="post-item-tag">{post.tag}</span>
            <span className="post-item-date">{formatDate(post.date)}</span>
          </span>
          <span className="post-item-title">{post.title}</span>
          <span className="post-item-summary">{post.summary}</span>
          <span className="post-item-meta">
            {post.readMins} min read {shell === 'ios' ? <Symbol name="chevron.right" size={12} weight={2.6} /> : null}
          </span>
        </button>
      ))}
    </div>
  )

  return (
    <AppFrame
      shell={shell}
      title="Writing"
      detailTitle={selected?.title}
      nested={nested}
      onBack={() => onRoute('')}
      sidebar={list}
      sidebarWidth={280}
      plainHeader={nested}
    >
      {selected ? <Reader post={selected} /> : null}
    </AppFrame>
  )
}

function Reader({ post }: { post: Post }) {
  return (
    <article className="reader selectable">
      <header className="reader-head">
        <span className="reader-tag">{post.tag}</span>
        <h1>{post.title}</h1>
        <p className="reader-summary">{post.summary}</p>
        <p className="reader-meta">
          {formatDate(post.date)} · {post.readMins} min read
        </p>
      </header>
      <div className="reader-body">
        {post.body.map((block, index) => (
          <Fragment key={index}>{renderBlock(block)}</Fragment>
        ))}
      </div>
    </article>
  )
}

function renderBlock(block: string) {
  if (block.startsWith('## ')) return <h2>{block.slice(3)}</h2>
  if (block.startsWith('> ')) return <blockquote>{block.slice(2)}</blockquote>
  if (block.startsWith('```')) {
    const code = block.replace(/^```\n?/, '').replace(/\n?```$/, '')
    return (
      <pre>
        <code>{code}</code>
      </pre>
    )
  }
  return <p>{renderInline(block)}</p>
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`)/g)
  return parts.map((part, index) =>
    part.startsWith('`') && part.endsWith('`') ? <code key={index}>{part.slice(1, -1)}</code> : part,
  )
}
