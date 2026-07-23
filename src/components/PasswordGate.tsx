import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  storageKey: string
  title: string
  children: ReactNode
}

const PASSWORD = 'underconstruction'

function isUnlocked(storageKey: string) {
  try {
    return sessionStorage.getItem(storageKey) === '1'
  } catch {
    return false
  }
}

export function PasswordGate({ storageKey, title, children }: Props) {
  const inputId = useId()
  const [unlocked, setUnlocked] = useState(() => isUnlocked(storageKey))
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  if (unlocked) return children

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (value.trim() === PASSWORD) {
      try {
        sessionStorage.setItem(storageKey, '1')
      } catch {
        /* ignore quota / private mode */
      }
      setError(false)
      setUnlocked(true)
      return
    }
    setError(true)
  }

  return (
    <div className="page gate-page">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand__back">←</span>
          <span>Po Yen Tseng</span>
        </Link>
      </header>

      <main className="gate">
        <p className="gate__eyebrow">Protected project</p>
        <h1 className="gate__title">
          <LockIcon className="gate__lock" />
          <span>{title}</span>
        </h1>
        <p className="gate__lede">
          This case study is password protected. Enter the password to continue.
        </p>

        <form className="gate__form" onSubmit={onSubmit} noValidate>
          <label className="gate__label" htmlFor={inputId}>
            Password
          </label>
          <input
            id={inputId}
            className="gate__input"
            type="password"
            name="password"
            autoComplete="current-password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError(false)
            }}
            aria-invalid={error}
            aria-describedby={error ? `${inputId}-error` : undefined}
          />
          {error ? (
            <p id={`${inputId}-error`} className="gate__error" role="alert">
              Incorrect password. Try again.
            </p>
          ) : null}
          <button className="btn btn--primary gate__submit" type="submit">
            Unlock
          </button>
        </form>
      </main>
    </div>
  )
}

export function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 11V8a5 5 0 0 1 10 0v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="15.5" r="1.2" fill="currentColor" />
    </svg>
  )
}
