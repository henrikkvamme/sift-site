// An interactive copy of the Sift feed, hover summary, and video page. All text is fixed sample
// content from demo-data.ts. The server renders the feed, so it shows without JavaScript.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject, type SubmitEvent } from 'react'

import { ICONS, VIDEOS, type Answer, type KeyPoint, type Video } from './demo-data'
import './demo.css'

const SEARCH_ICON = 'm21 21-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14'
const SEND_ICON = 'M12 19V5m-6 6 6-6 6 6'
const TYPED_ANSWER: Answer = {
  intro: 'This demo only has sample answers. Add Sift to Chrome to ask anything about a real video.',
}

const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Counts the visible characters of a reply that streams in quickly, as a model would stream it.
 * The stream starts when the component mounts and stops when it unmounts. With `instant` or with
 * reduced motion, all text shows at once.
 */
const useStream = (total: number, instant: boolean, onDone?: () => void): number => {
  const [shown, setShown] = useState(() => (instant || prefersReducedMotion() ? total : 0))
  const onDoneRef = useRef(onDone)
  useEffect(() => {
    onDoneRef.current = onDone
  })
  useEffect(() => {
    let count = shown
    if (count >= total) {
      onDoneRef.current?.()
      return
    }
    const perFrame = Math.max(6, Math.ceil(total / 36))
    const step = () => {
      count = Math.min(total, count + perFrame)
      setShown(count)
      if (count >= total) onDoneRef.current?.()
      else frame = requestAnimationFrame(step)
    }
    let frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
    // A stream runs once for each mount. Give the component a new key to restart it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return shown
}

/**
 * Splits the visible character count across the parts of a reply, in render order. A block, such
 * as a list item, stays hidden until its first part starts to show.
 */
class Reveal {
  #shown: number
  #offset = 0
  #pending: boolean

  /** With `pending`, no text shows yet, but every block keeps its empty place, as before a stream starts. */
  constructor(shown: number, pending = false) {
    this.#shown = shown
    this.#pending = pending
  }

  started(): boolean {
    return this.#pending || this.#shown > this.#offset
  }

  take(text: string): string {
    const visible = text.slice(0, Math.max(0, this.#shown - this.#offset))
    this.#offset += text.length
    return visible
  }
}

const overviewLength = (video: Video): number =>
  video.items.reduce((sum, [, bold, text]) => sum + bold.length + text.length, video.overview.length)

const pointsLength = (points: readonly KeyPoint[]): number =>
  points.reduce((sum, [bold, text, time]) => sum + bold.length + text.length + time.length + 2, 0)

const Icon = ({ path }: { path: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={path} />
  </svg>
)

const Overview = ({ video, reveal }: { video: Video; reveal: Reveal }) => (
  <div className="demo-overview">
    <p className="demo-overview-title">{reveal.take(video.overview)}</p>
    <ul className="demo-overview-list">
      {video.items.map(([icon, bold, text]) => (
        <li key={bold} hidden={!reveal.started()}>
          <Icon path={ICONS[icon]} />
          <span>
            <strong>{reveal.take(bold)}</strong> <span>{reveal.take(text)}</span>
          </span>
        </li>
      ))}
    </ul>
  </div>
)

const KeyPoints = ({ points, reveal }: { points: readonly KeyPoint[]; reveal: Reveal }) => (
  <ul className="demo-points">
    {points.map(([bold, text, time]) => (
      <li key={bold} hidden={!reveal.started()}>
        <strong>{reveal.take(bold)}</strong> <span>{reveal.take(text)}</span>{' '}
        <span className="demo-time">{reveal.take(`[${time}]`)}</span>
      </li>
    ))}
  </ul>
)

const PreviewSummary = ({ video, instant, onDone }: { video: Video; instant: boolean; onDone: () => void }) => {
  const shown = useStream(overviewLength(video), instant, onDone)
  return <Overview video={video} reveal={new Reveal(shown)} />
}

const ReplyContent = ({ answer, reveal }: { answer: Answer; reveal: Reveal }) => (
  <div className="demo-answer">
    <p hidden={!reveal.started()}>{reveal.take(answer.intro)}</p>
    <KeyPoints points={answer.points ?? []} reveal={reveal} />
  </div>
)

const ReplyStream = ({ answer, onDone }: { answer: Answer; onDone: () => void }) => {
  const shown = useStream(answer.intro.length + pointsLength(answer.points ?? []), false, onDone)
  return <ReplyContent answer={answer} reveal={new Reveal(shown)} />
}

/**
 * A sample answer. Sift "thinks" for 260 ms, then streams the answer. While it thinks, the empty
 * answer keeps its place, so the thread scrolls to the same position as before.
 */
const Reply = ({ answer, onDone }: { answer: Answer; onDone: () => void }) => {
  const [streaming, setStreaming] = useState(false)
  useEffect(() => {
    const thinking = setTimeout(() => setStreaming(true), 260)
    return () => clearTimeout(thinking)
  }, [])
  return streaming ? <ReplyStream answer={answer} onDone={onDone} /> : <ReplyContent answer={answer} reveal={new Reveal(0, true)} />
}

interface Message {
  readonly id: number
  readonly question: string
  readonly answer: Answer
}

interface WatchProps {
  video: Video
  instant: boolean
  body: RefObject<HTMLDivElement | null>
  onSummaryDone: () => void
  onBack: () => void
}

const Watch = ({ video, instant, body, onSummaryDone, onBack }: WatchProps) => {
  const heading = useRef<HTMLHeadingElement>(null)
  const lastQuestion = useRef<HTMLParagraphElement>(null)
  const nextId = useRef(0)
  const busy = useRef(false)
  const [summaryDone, setSummaryDone] = useState(false)
  const [answering, setAnswering] = useState(false)
  const [remaining, setRemaining] = useState(video.followUps)
  const [messages, setMessages] = useState<readonly Message[]>([])
  const [draft, setDraft] = useState('')
  const shown = useStream(overviewLength(video) + pointsLength(video.points), instant, () => {
    setSummaryDone(true)
    onSummaryDone()
  })

  useLayoutEffect(() => {
    heading.current?.focus({ preventScroll: true })
  }, [])

  useLayoutEffect(() => {
    const bubble = lastQuestion.current
    if (bubble === null) return
    body.current?.scrollTo({ top: bubble.offsetTop - 24, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [messages.length, body])

  const ask = (question: string, answer: Answer) => {
    if (busy.current) return
    busy.current = true
    setAnswering(true)
    setMessages((current) => [...current, { id: nextId.current++, question, answer }])
  }

  const answered = useCallback(() => {
    busy.current = false
    setAnswering(false)
  }, [])

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const question = draft.trim()
    if (question === '') return
    setDraft('')
    ask(question, TYPED_ANSWER)
  }

  const reveal = new Reveal(shown)
  return (
    <>
      <button className="demo-back" type="button" onClick={onBack}>
        ← Feed
      </button>
      <h3 className="demo-title" tabIndex={-1} ref={heading}>
        {video.title}
      </h3>
      <p className="demo-channel">{video.channel}</p>
      <div className="demo-details">
        <strong>{`${video.views} · ${video.age} · ${video.duration}`}</strong>
        <p>{video.description}</p>
      </div>
      <p className="demo-label">New chat</p>
      <div className="demo-thread">
        <Overview video={video} reveal={reveal} />
        <KeyPoints points={video.points} reveal={reveal} />
        {messages.map((message, index) => [
          <p key={`q${message.id}`} className="demo-question" ref={index === messages.length - 1 ? lastQuestion : undefined}>
            {message.question}
          </p>,
          <Reply key={`a${message.id}`} answer={message.answer} onDone={answered} />,
        ])}
      </div>
      <div
        className="demo-chips"
        role="group"
        aria-label="Follow-up suggestions"
        hidden={!summaryDone || answering || remaining.length === 0}
      >
        {remaining.map((followUp) => (
          <button
            key={followUp.question}
            className="demo-chip"
            type="button"
            onClick={() => {
              setRemaining((current) => current.filter((candidate) => candidate !== followUp))
              ask(followUp.question, followUp)
            }}
          >
            {followUp.question}
          </button>
        ))}
      </div>
      <form className="demo-composer" onSubmit={submit}>
        <input
          type="text"
          placeholder="Ask anything about this video..."
          aria-label="Message Sift"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button className="demo-send" type="submit" aria-label="Send">
          <Icon path={SEND_ICON} />
        </button>
      </form>
    </>
  )
}

interface Preview {
  readonly index: number
  readonly above: boolean
  readonly phase: 'preparing' | 'summary'
  /** The summary has loaded before, so it shows at once. */
  readonly instant: boolean
}

interface Watching {
  readonly index: number
  readonly key: number
  readonly instant: boolean
}

export default function Demo() {
  const root = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const rows = useRef<(HTMLLIElement | null)[]>([])
  // Summaries that have streamed to the end once. They show at once after that.
  const loaded = useRef(new Set<number>())
  // The row whose summary card is waiting to open or is open.
  const active = useRef<number | null>(null)
  const timers = useRef<number[]>([])
  const touched = useRef(false)
  const opener = useRef<HTMLButtonElement | null>(null)
  const restoreFocus = useRef(false)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [watching, setWatching] = useState<Watching | null>(null)
  const watchingRef = useRef(watching)
  useEffect(() => {
    watchingRef.current = watching
  })

  const closePreview = useCallback(() => {
    for (const timer of timers.current) clearTimeout(timer)
    timers.current = []
    active.current = null
    setPreview(null)
  }, [])

  const showPreview = useCallback(
    (index: number) => {
      if (active.current === index) return
      closePreview()
      active.current = index
      timers.current.push(
        window.setTimeout(() => {
          const row = rows.current[index]
          const frame = body.current
          if (!row || !frame) return
          const rowBox = row.getBoundingClientRect()
          const bodyBox = frame.getBoundingClientRect()
          const above = bodyBox.bottom - rowBox.bottom < 260 && rowBox.top - bodyBox.top > 260
          const instant = loaded.current.has(index)
          setPreview({ index, above, phase: instant ? 'summary' : 'preparing', instant })
          if (instant) return
          timers.current.push(
            window.setTimeout(() => {
              setPreview((current) => (current?.index === index ? { ...current, phase: 'summary' } : current))
            }, 240),
          )
        }, 300),
      )
    },
    [closePreview],
  )

  const hidePreview = (index: number) => {
    if (active.current === index) closePreview()
  }

  const openVideo = (index: number, button: HTMLButtonElement) => {
    closePreview()
    opener.current = button
    if (body.current) body.current.scrollTop = 0
    setWatching((current) => ({ index, key: (current?.key ?? 0) + 1, instant: loaded.current.has(index) }))
  }

  const showFeed = () => {
    setWatching(null)
    if (body.current) body.current.scrollTop = 0
  }

  useLayoutEffect(() => {
    if (watching !== null || !restoreFocus.current) return
    restoreFocus.current = false
    opener.current?.focus()
  }, [watching])

  // Open the first summary once, the first time the demo comes into view, so it reads as live.
  useEffect(() => {
    const element = root.current
    if (!element || !window.matchMedia('(hover: hover)').matches || !('IntersectionObserver' in window)) return
    let timer: number | undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        timer = window.setTimeout(() => {
          if (!touched.current && watchingRef.current === null) showPreview(0)
        }, 500)
      },
      { threshold: 0.6 },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [showPreview])

  useEffect(() => closePreview, [closePreview])

  const markTouched = () => {
    touched.current = true
  }

  const watched = watching === null ? undefined : VIDEOS[watching.index]
  return (
    <div
      className="demo-window"
      id="sift-demo"
      data-view={watching === null ? 'feed' : 'watch'}
      ref={root}
      onPointerEnter={markTouched}
      onFocus={markTouched}
    >
      <div className="demo-bar">
        <button className="demo-brand" type="button" aria-label="Back to the demo feed" onClick={showFeed}>
          <img src="./sift-128.png" width="24" height="24" alt="" />
          <span>Sift</span>
        </button>
        <div className="demo-search" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d={SEARCH_ICON} />
          </svg>
          <span>Search YouTube</span>
        </div>
        <div className="demo-account" aria-hidden="true">
          <span className="demo-avatar">S</span>
          <span className="demo-account-name">Sift</span>
          <span className="demo-plan">Pro</span>
        </div>
      </div>
      <div className="demo-body" ref={body}>
        <ol className="demo-feed" aria-label="Demo feed" hidden={watching !== null}>
          {VIDEOS.map((video, index) => {
            const open = preview?.index === index ? preview : null
            const previewId = `demo-preview-${index}`
            return (
              <li
                key={video.title}
                className={open ? 'demo-row demo-row--active' : 'demo-row'}
                ref={(element) => {
                  rows.current[index] = element
                }}
                onPointerEnter={(event) => {
                  if (event.pointerType !== 'touch') showPreview(index)
                }}
                onPointerLeave={() => hidePreview(index)}
              >
                <button
                  className="demo-row-button"
                  type="button"
                  aria-describedby={open ? previewId : undefined}
                  onFocus={() => showPreview(index)}
                  onBlur={() => hidePreview(index)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') hidePreview(index)
                  }}
                  onClick={(event) => openVideo(index, event.currentTarget)}
                >
                  <span className="demo-row-title">{video.title}</span>
                  <span className="demo-row-meta">
                    <span>{video.channel}</span>
                    <span>{`${video.views} · ${video.age}`}</span>
                  </span>
                </button>
                <aside
                  className={open?.above ? 'demo-preview demo-preview--above' : 'demo-preview'}
                  id={previewId}
                  role="tooltip"
                  hidden={!open}
                >
                  {open?.phase === 'preparing' && <p className="demo-preparing">Preparing summary…</p>}
                  {open?.phase === 'summary' && (
                    <PreviewSummary video={video} instant={open.instant} onDone={() => loaded.current.add(index)} />
                  )}
                </aside>
              </li>
            )
          })}
        </ol>
        <section className="demo-watch" aria-label="Demo video" hidden={watched === undefined}>
          {watching !== null && watched !== undefined && (
            <Watch
              key={watching.key}
              video={watched}
              instant={watching.instant}
              body={body}
              onSummaryDone={() => loaded.current.add(watching.index)}
              onBack={() => {
                restoreFocus.current = true
                showFeed()
              }}
            />
          )}
        </section>
      </div>
    </div>
  )
}
