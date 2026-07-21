'use client'

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'

import { useDesktopStore } from '@/lib/desktopStore'

const PROMPT = 'C:\\CUSTARDSQUARE>'

type HistoryLine = {
  kind: 'in' | 'out'
  text: string
}

function runCommand(raw: string): string[] {
  const input = raw.trim()
  const normalized = input.toLowerCase()

  if (!normalized) {
    return []
  }

  if (normalized === 'help') {
    return [
      'custardsquare OS terminal — flavour, not a real shell.',
      '',
      'Commands:',
      '  help              list commands',
      '  open articles     open Articles window',
      '  open search       open Search window',
      '  open about        open About window',
      '  open resume       open Resume window',
      '  open skills       open Skills window',
      '  open credits      open Credits window',
      '  clear             clear the screen',
      '  ver               show OS version',
    ]
  }

  if (normalized === 'ver' || normalized === 'version') {
    return ['custardsquare OS [Version 0.9 dream build]']
  }

  if (normalized === 'clear' || normalized === 'cls') {
    return ['__CLEAR__']
  }

  if (normalized.startsWith('open ')) {
    const target = normalized.slice(5).trim()
    return [`__OPEN__:${target}`]
  }

  return [`Unknown command: ${input}`, "Type 'help' for a list of commands."]
}

export function TerminalWindow() {
  const openWindow = useDesktopStore((state) => state.openWindow)
  const [history, setHistory] = useState<HistoryLine[]>([
    { kind: 'out', text: 'custardsquare OS Terminal' },
    { kind: 'out', text: "Type 'help' for commands." },
  ])
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight })
  }, [history])

  function submit(command: string) {
    const lines = runCommand(command)
    if (lines[0] === '__CLEAR__') {
      setHistory([])
      setValue('')
      return
    }

    const openTarget = lines.find((line) => line.startsWith('__OPEN__:'))
    const output = lines.filter((line) => !line.startsWith('__OPEN__:'))

    if (openTarget) {
      const target = openTarget.slice('__OPEN__:'.length)
      if (target === 'articles') {
        openWindow('articles', 'Articles')
        output.push('Opening Articles…')
      } else if (target === 'search') {
        openWindow('search', 'Find Articles')
        output.push('Opening Search…')
      } else if (target === 'about') {
        openWindow('about', 'About')
        output.push('Opening About…')
      } else if (target === 'resume') {
        openWindow('resume', 'Resume — RESUME.md')
        output.push('Opening Resume…')
      } else if (target === 'skills') {
        openWindow('skills', 'Skills')
        output.push('Opening Skills…')
      } else if (target === 'credits') {
        openWindow('credits', 'Credits')
        output.push('Opening Credits…')
      } else if (target === 'terminal') {
        output.push('Already in Terminal.')
      } else {
        output.push(
          `Cannot open '${target}'. Try: articles, search, about, resume, skills, credits.`,
        )
      }
    }

    setHistory((current) => [
      ...current,
      { kind: 'in', text: `${PROMPT} ${command}` },
      ...output.map((text) => ({ kind: 'out' as const, text })),
    ])
    setValue('')
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    submit(value)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'l' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      setHistory([])
    }
  }

  return (
    <div className="terminal-window">
      <div
        className="terminal-window__screen"
        onClick={() => inputRef.current?.focus()}
        ref={scrollerRef}
      >
        {history.map((line, index) => (
          <p
            className={
              line.kind === 'in' ? 'terminal-window__line terminal-window__line--in' : 'terminal-window__line'
            }
            key={`${index}-${line.text.slice(0, 12)}`}
          >
            {line.text || '\u00a0'}
          </p>
        ))}
        <form className="terminal-window__prompt" onSubmit={onSubmit}>
          <label className="terminal-window__prompt-label" htmlFor="terminal-input">
            {PROMPT}
          </label>
          <input
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="terminal-window__input"
            id="terminal-input"
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            ref={inputRef}
            spellCheck={false}
            value={value}
          />
        </form>
      </div>
    </div>
  )
}
