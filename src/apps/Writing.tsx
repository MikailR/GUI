import { useState } from 'react'
import { posts } from '../data/content'

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

export function Writing() {
  const [slug, setSlug] = useState<string | null>(posts[0].slug)
  const post = posts.find((p) => p.slug === slug) ?? null

  return (
    <div className={`writing ${post ? 'reading' : ''}`}>
      <aside className="w-list">
        <div className="w-list-head">
          <p className="eyebrow">essays · {posts.length}</p>
          <h2 className="display xs">Writing</h2>
        </div>
        <ul className="plain">
          {posts.map((p) => (
            <li key={p.slug}>
              <button className={`w-row ${p.slug === slug ? 'on' : ''}`} onClick={() => setSlug(p.slug)}>
                <span className="w-row-title">{p.title}</span>
                <span className="w-row-meta mono">
                  {fmt(p.date)} · {p.minutes} min
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <article className="w-article" key={slug}>
        {post ? (
          <>
            <button className="w-back btn ghost" onClick={() => setSlug(null)}>
              ← All essays
            </button>
            <p className="eyebrow">
              {fmt(post.date)} · {post.minutes} minute read
            </p>
            <h1 className="display sm">{post.title}</h1>
            <p className="lede">{post.dek}</p>
            {post.body.map((para, i) => (
              <p key={i} className={`prose ${i === 0 ? 'first' : ''}`}>
                {para}
              </p>
            ))}
            <div className="w-end mono">◆</div>
          </>
        ) : (
          <div className="w-placeholder">Pick an essay.</div>
        )}
      </article>
    </div>
  )
}
