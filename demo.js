// An interactive copy of the Sift feed. All summaries are fixed sample text in this file.
const ICONS = {
  goal: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12m0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4',
  people:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-4M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8m8 0a4 4 0 0 1 0 8',
  idea: 'M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 2H9s0-1-1-2',
  growth: 'M3 3v18h18M6 15l5-5 4 3 6-8m-6 0h6v6',
  time: 'M9 2h6m-3 0v3m0 4v5l3 2M12 5a8 8 0 1 0 0 16 8 8 0 0 0 0-16',
  tool: 'M14 6a5 5 0 0 0-6 6L2 18l4 4 6-6a5 5 0 0 0 6-6l-4 4-4-4 4-4z',
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18',
  world: 'M2 12h20M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 0c-5 5-5 15 0 20m0-20c5 5 5 15 0 20',
  caution: 'm12 3 10 18H2L12 3zm0 6v5m0 3v1',
}

const VIDEOS = [
  {
    title: 'How to build your creative confidence',
    channel: 'TED',
    views: '2.4M views',
    age: '14 years ago',
    duration: '12 min',
    description: 'David Kelley on finding the confidence to create, one small step at a time.',
    overview: 'Creative confidence grows through small acts of making.',
    items: [
      ['goal', 'Start small', 'Manageable challenges build the confidence to try harder things.'],
      ['people', 'Design for people', 'Look at how an experience feels, not just how it works.'],
      ['idea', 'Make before judging', 'Fear of getting it wrong often stops us before we begin.'],
    ],
    points: [
      ['Build confidence by doing.', 'Small creative challenges make the next step feel possible.', '0:12'],
      ['Put ideas into practice.', 'A rough version gives you something to improve instead of waiting for certainty.', '11:20'],
    ],
    followUps: [
      {
        question: 'What is one thing I can try today?',
        intro: 'Sketch three fixes for one small problem. Show someone a rough version before judging it.',
        points: [
          ['Pick a small problem.', 'Choose something you can improve in an afternoon.', '3:05'],
          ['Make it rough on purpose.', 'Paper and tape are enough to get a reaction.', '6:40'],
        ],
      },
      {
        question: 'Why do people lose creative confidence?',
        intro: 'Usually after one early judgment, such as a teacher or friend calling their work bad.',
        points: [['Fear of judgment.', 'People opt out to avoid being judged again.', '1:48']],
      },
    ],
  },
  {
    title: 'The essence of calculus',
    channel: '3Blue1Brown',
    views: '11M views',
    age: '9 years ago',
    duration: '17 min',
    description: 'Chapter 1 of a visual series. Calculus as something you could have invented yourself.',
    overview: 'You could rediscover calculus from one question about a circle.',
    items: [
      ['goal', 'One question', 'Why is the area of a circle π times its radius squared?'],
      ['growth', 'Thin slices', 'Cut the circle into rings and add them up as the rings get thinner.'],
      ['idea', 'Two inverse ideas', 'Derivatives and integrals undo each other.'],
    ],
    points: [
      ['Area becomes a sum.', 'The rings form a triangle with area πr².', '4:20'],
      ['Areas under graphs.', 'The same trick finds the area under many curves.', '9:30'],
    ],
    followUps: [
      {
        question: 'Do I need algebra first?',
        intro: 'Basic algebra helps, but the video builds each idea from pictures.',
        points: [['Visual first.', 'Formulas come after you can see why they work.', '1:15']],
      },
    ],
  },
  {
    title: 'The first 20 hours: How to learn anything',
    channel: 'TEDx Talks',
    views: '43M views',
    age: '13 years ago',
    duration: '20 min',
    description: 'Josh Kaufman on getting reasonably good at a new skill in about 20 hours of practice.',
    overview: 'About 20 focused hours take you from knowing nothing to reasonably good.',
    items: [
      ['tool', 'Deconstruct the skill', 'Split it into smaller parts and practice the most important ones first.'],
      ['time', 'Remove barriers', 'Put away distractions so you can practice, not just plan.'],
      ['goal', 'Practice 20 hours', 'Commit to the time, so the frustrating start does not stop you.'],
    ],
    points: [
      ['10,000 hours is for experts.', 'You need far less to be good enough for yourself.', '5:10'],
      ['Learn enough to self-correct.', 'Read a little, then notice your own mistakes as you practice.', '9:45'],
    ],
    followUps: [
      {
        question: 'How should I plan my first hour?',
        intro: 'Pick one small part of the skill and practice it until you can notice your mistakes.',
        points: [['Use a short list.', 'Choose three or four basics from one or two good sources.', '10:30']],
      },
    ],
  },
  {
    title: 'Why city design matters',
    channel: 'Not Just Bikes',
    views: '7.1M views',
    age: '5 years ago',
    duration: '15 min',
    description: 'How streets built around cars shape daily life, compared with a city built for people.',
    overview: 'Street design decides how freely people, and especially children, can move.',
    items: [
      ['world', 'Built for cars', 'Wide roads and parking push places too far apart to walk.'],
      ['people', 'Freedom for kids', 'Safe streets let children get around on their own.'],
      ['growth', 'Change is possible', 'Cities have redesigned streets within a few decades.'],
    ],
    points: [
      ['Distance shapes habits.', 'When shops are far away, every errand needs a car.', '3:40'],
      ['Better streets feel calmer.', 'Less traffic noise makes everyday trips pleasant.', '10:15'],
    ],
    followUps: [
      {
        question: 'What makes a street feel safe?',
        intro: 'Low speeds, narrow lanes, and space kept apart for people on foot and on bikes.',
        points: [['Design sets the speed.', 'Drivers slow down on narrow streets without signs.', '7:20']],
      },
    ],
  },
  {
    title: 'The mind behind Linux',
    channel: 'TED',
    views: '6.8M views',
    age: '10 years ago',
    duration: '21 min',
    description: 'Linus Torvalds talks about his work, open source, and why he calls himself an engineer.',
    overview: 'Linus Torvalds calls himself an engineer who fixes the problems in front of him.',
    items: [
      ['code', 'Good taste in code', 'Simple solutions remove special cases instead of adding them.'],
      ['people', 'Open collaboration', 'Linux grew because thousands of people could add to it.'],
      ['tool', 'Git came from need', 'He wrote Git to manage the Linux project itself.'],
    ],
    points: [
      ['Not a visionary.', 'He prefers to look at the road in front of him.', '12:40'],
      ['Working alone helps.', 'He does most of his work from home, in quiet.', '2:30'],
    ],
    followUps: [
      {
        question: 'What does he mean by good taste?',
        intro: 'Code that handles the general case so the special case disappears.',
        points: [['A short example.', 'He compares two ways to remove an item from a list.', '15:05']],
      },
    ],
  },
  {
    title: 'Building a toaster from scratch',
    channel: 'TED',
    views: '279K views',
    age: '15 years ago',
    duration: '11 min',
    description: 'Thomas Thwaites tries to make a cheap toaster himself, from raw materials.',
    overview: 'Making a toaster from scratch shows how complex everyday things are.',
    items: [
      ['tool', 'From raw materials', 'He mines iron ore and tries to make his own plastic.'],
      ['world', 'A global chain', 'A cheap product depends on many industries and countries.'],
      ['caution', 'Mixed results', 'The finished toaster works only for a few seconds.'],
    ],
    points: [
      ['Simple is not easy.', 'A product that costs a few pounds hides a lot of work.', '2:15'],
      ['A different view of things.', 'The project changes how he values ordinary objects.', '9:40'],
    ],
    followUps: [
      {
        question: 'Which part was hardest?',
        intro: 'The plastic case. He had no way to make plastic from oil at home.',
        points: [['A workaround.', 'He melts down old plastic to form the case.', '6:05']],
      },
    ],
  },
]

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const svgNS = 'http://www.w3.org/2000/svg'

const el = (tag, className, text) => {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

const icon = (path) => {
  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('aria-hidden', 'true')
  const shape = document.createElementNS(svgNS, 'path')
  shape.setAttribute('d', path)
  svg.append(shape)
  return svg
}

/**
 * Shows the text in `parts` quickly, as a model would stream it. Each part is an element and
 * the text that goes into it. Returns a function that stops the stream.
 */
const stream = (parts, onDone) => {
  let stopped = false
  const queue = parts.map(([node, text]) => ({ node, text, shown: 0 }))
  for (const item of queue) {
    item.node.textContent = ''
    item.block = item.node.closest('[data-stream-block]')
    if (item.block) item.block.hidden = true
  }
  if (reduceMotion.matches) {
    for (const item of queue) {
      item.node.textContent = item.text
      if (item.block) item.block.hidden = false
    }
    onDone?.()
    return () => {}
  }
  const total = queue.reduce((sum, item) => sum + item.text.length, 0)
  const perFrame = Math.max(6, Math.ceil(total / 36))
  const step = () => {
    if (stopped) return
    let budget = perFrame
    for (const item of queue) {
      if (item.shown >= item.text.length) continue
      if (item.block) item.block.hidden = false
      const take = Math.min(budget, item.text.length - item.shown)
      item.shown += take
      item.node.textContent = item.text.slice(0, item.shown)
      budget -= take
      if (budget === 0) break
    }
    if (queue.every((item) => item.shown >= item.text.length)) onDone?.()
    else requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
  return () => {
    stopped = true
  }
}

const overview = (video) => {
  const parts = []
  const box = el('div', 'demo-overview')
  const title = el('p', 'demo-overview-title')
  parts.push([title, video.overview])
  const list = el('ul', 'demo-overview-list')
  for (const [kind, bold, text] of video.items) {
    const li = el('li')
    li.dataset.streamBlock = ''
    const strong = el('strong')
    const rest = el('span')
    const body = el('span')
    body.append(strong, ' ', rest)
    li.append(icon(ICONS[kind]), body)
    list.append(li)
    parts.push([strong, bold], [rest, text])
  }
  box.append(title, list)
  return { box, parts }
}

const keyPoints = (points) => {
  const parts = []
  const list = el('ul', 'demo-points')
  for (const [bold, text, time] of points) {
    const li = el('li')
    li.dataset.streamBlock = ''
    const strong = el('strong')
    const rest = el('span')
    const stamp = el('span', 'demo-time')
    li.append(strong, ' ', rest, ' ', stamp)
    list.append(li)
    parts.push([strong, bold], [rest, text], [stamp, `[${time}]`])
  }
  return { list, parts }
}

const mount = (root) => {
  const feed = root.querySelector('.demo-feed')
  const watch = root.querySelector('.demo-watch')
  const body = root.querySelector('.demo-body')
  let stopPreview = () => {}
  let hidePreview = () => {}
  let stopWatch = () => {}

  const showFeed = () => {
    stopWatch()
    watch.hidden = true
    watch.replaceChildren()
    feed.hidden = false
    root.dataset.view = 'feed'
    body.scrollTop = 0
  }

  const openVideo = (video, opener) => {
    hidePreview()
    stopWatch()
    feed.hidden = true
    root.dataset.view = 'watch'
    body.scrollTop = 0
    const back = el('button', 'demo-back', '← Feed')
    back.type = 'button'
    back.addEventListener('click', () => {
      showFeed()
      opener?.focus()
    })
    const heading = el('h3', 'demo-title', video.title)
    heading.tabIndex = -1
    const channel = el('p', 'demo-channel', video.channel)
    const details = el('div', 'demo-details')
    details.append(el('strong', '', `${video.views} · ${video.age} · ${video.duration}`), el('p', '', video.description))
    const label = el('p', 'demo-label', 'New chat')
    const thread = el('div', 'demo-thread')
    const summary = overview(video)
    const points = keyPoints(video.points)
    thread.append(summary.box, points.list)
    const chips = el('div', 'demo-chips')
    chips.setAttribute('role', 'group')
    chips.setAttribute('aria-label', 'Follow-up suggestions')
    chips.hidden = true
    const composer = el('form', 'demo-composer')
    const input = el('input')
    input.type = 'text'
    input.placeholder = 'Ask anything about this video...'
    input.setAttribute('aria-label', 'Message Sift')
    const send = el('button', 'demo-send')
    send.type = 'submit'
    send.setAttribute('aria-label', 'Send')
    send.append(icon('M12 19V5m-6 6 6-6 6 6'))
    composer.append(input, send)
    watch.replaceChildren(back, heading, channel, details, label, thread, chips, composer)
    watch.hidden = false
    heading.focus({ preventScroll: true })

    let busy = false
    const ask = (question, answer) => {
      if (busy) return
      busy = true
      chips.hidden = true
      const bubble = el('p', 'demo-question', question)
      const reply = el('div', 'demo-answer')
      const intro = el('p')
      intro.dataset.streamBlock = ''
      const list = keyPoints(answer.points ?? [])
      reply.append(intro, list.list)
      thread.append(bubble, reply)
      body.scrollTo({ top: bubble.offsetTop - 24, behavior: reduceMotion.matches ? 'auto' : 'smooth' })
      const thinking = setTimeout(() => {
        stopWatch = stream([[intro, answer.intro], ...list.parts], () => {
          busy = false
          renderChips()
        })
      }, 260)
      stopWatch = () => clearTimeout(thinking)
    }
    const remaining = [...video.followUps]
    const renderChips = () => {
      chips.replaceChildren()
      for (const followUp of remaining) {
        const chip = el('button', 'demo-chip', followUp.question)
        chip.type = 'button'
        chip.addEventListener('click', () => {
          remaining.splice(remaining.indexOf(followUp), 1)
          ask(followUp.question, followUp)
        })
        chips.append(chip)
      }
      chips.hidden = remaining.length === 0
    }
    composer.addEventListener('submit', (event) => {
      event.preventDefault()
      const question = input.value.trim()
      if (!question) return
      input.value = ''
      ask(question, {
        intro:
          'This demo only has sample answers. Add Sift to Chrome to ask anything about a real video.',
      })
    })
    stopWatch = stream([...summary.parts, ...points.parts], renderChips)
  }

  const previews = []
  VIDEOS.forEach((video, index) => {
    const row = el('li', 'demo-row')
    const button = el('button', 'demo-row-button')
    button.type = 'button'
    button.append(el('span', 'demo-row-title', video.title))
    const meta = el('span', 'demo-row-meta')
    meta.append(el('span', '', video.channel), el('span', '', `${video.views} · ${video.age}`))
    button.append(meta)
    const preview = el('aside', 'demo-preview')
    preview.id = `demo-preview-${index}`
    preview.setAttribute('role', 'tooltip')
    preview.hidden = true
    row.append(button, preview)
    feed.append(row)

    let timer
    const hide = () => {
      clearTimeout(timer)
      if (hidePreview === hide) {
        stopPreview()
        hidePreview = () => {}
      }
      preview.hidden = true
      row.classList.remove('demo-row--active')
      button.removeAttribute('aria-describedby')
    }
    const show = () => {
      if (hidePreview === hide) return
      hidePreview()
      hidePreview = hide
      clearTimeout(timer)
      timer = setTimeout(() => {
        const rowBox = row.getBoundingClientRect()
        const bodyBox = body.getBoundingClientRect()
        const above = bodyBox.bottom - rowBox.bottom < 260 && rowBox.top - bodyBox.top > 260
        preview.classList.toggle('demo-preview--above', above)
        preview.replaceChildren(el('p', 'demo-preparing', 'Preparing summary…'))
        preview.hidden = false
        row.classList.add('demo-row--active')
        button.setAttribute('aria-describedby', preview.id)
        const wait = setTimeout(() => {
          const summary = overview(video)
          preview.replaceChildren(summary.box)
          stopPreview = stream(summary.parts)
        }, 240)
        stopPreview = () => clearTimeout(wait)
      }, 300)
    }
    row.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'touch') show()
    })
    row.addEventListener('pointerleave', hide)
    button.addEventListener('focus', show)
    button.addEventListener('blur', hide)
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') hide()
    })
    button.addEventListener('click', () => openVideo(video, button))
    previews.push(show)
  })

  // Open the first summary once, the first time the demo comes into view, so it reads as live.
  const canHover = window.matchMedia('(hover: hover)').matches
  let touched = false
  root.addEventListener('pointerenter', () => (touched = true), { once: true })
  root.addEventListener('focusin', () => (touched = true), { once: true })
  if (canHover && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        setTimeout(() => {
          if (!touched && root.dataset.view === 'feed') previews[0]?.()
        }, 500)
      },
      { threshold: 0.6 },
    )
    observer.observe(root)
  }

  root.querySelector('.demo-brand').addEventListener('click', showFeed)
  root.hidden = false
  root.closest('figure')?.querySelector('.demo-fallback')?.remove()
}

const root = document.querySelector('#sift-demo')
if (root) mount(root)
