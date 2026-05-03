'use client'

import { createContext, useCallback, useContext, useMemo, useReducer, useState, type ReactNode } from 'react'
import type { KudoComposeFormState, KudosUser } from '@/types/kudos'

// MVP form state managed via useReducer. T002 (react-hook-form) is a follow-up
// migration when the dependency lands; the action shape below maps cleanly to
// RHF's `setValue` / `reset` API.

type FormErrors = Partial<Record<keyof KudoComposeFormState, string>>

type FormAction =
  | { type: 'SET_FIELD'; field: keyof KudoComposeFormState; value: unknown }
  | { type: 'SET_RECIPIENT'; recipient: KudosUser | null }
  | { type: 'TOGGLE_HASHTAG'; tag: string }
  | { type: 'SET_IMAGES'; urls: readonly string[] }
  | { type: 'SET_ERRORS'; errors: FormErrors }
  | { type: 'RESET' }

const INITIAL_STATE: KudoComposeFormState = {
  receiverId: '',
  title: '',
  content: '',
  hashtags: [],
  imageUrls: [],
  isAnonymous: false,
  anonymousNickname: '',
}

interface InternalState {
  form: KudoComposeFormState
  recipient: KudosUser | null
  errors: FormErrors
  isDirty: boolean
}

const INITIAL_INTERNAL: InternalState = {
  form: INITIAL_STATE,
  recipient: null,
  errors: {},
  isDirty: false,
}

function reducer(state: InternalState, action: FormAction): InternalState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
        isDirty: true,
      }
    case 'SET_RECIPIENT':
      return {
        ...state,
        recipient: action.recipient,
        form: { ...state.form, receiverId: action.recipient?.id ?? '' },
        isDirty: true,
      }
    case 'TOGGLE_HASHTAG': {
      const exists = state.form.hashtags.includes(action.tag)
      const next = exists
        ? state.form.hashtags.filter((t) => t !== action.tag)
        : [...state.form.hashtags, action.tag]
      return {
        ...state,
        form: { ...state.form, hashtags: next },
        isDirty: true,
      }
    }
    case 'SET_IMAGES':
      return {
        ...state,
        form: { ...state.form, imageUrls: action.urls },
        isDirty: true,
      }
    case 'SET_ERRORS':
      return { ...state, errors: action.errors }
    case 'RESET':
      return INITIAL_INTERNAL
    default:
      return state
  }
}

interface KudoComposeContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  form: KudoComposeFormState
  recipient: KudosUser | null
  errors: FormErrors
  isDirty: boolean
  setField: <K extends keyof KudoComposeFormState>(field: K, value: KudoComposeFormState[K]) => void
  setRecipient: (recipient: KudosUser | null) => void
  toggleHashtag: (tag: string) => void
  setImages: (urls: readonly string[]) => void
  setErrors: (errors: FormErrors) => void
  reset: () => void
}

const KudoComposeContext = createContext<KudoComposeContextValue | null>(null)

interface KudoComposeProviderProps {
  children: ReactNode
}

export function KudoComposeProvider({ children }: KudoComposeProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, dispatch] = useReducer(reducer, INITIAL_INTERNAL)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => {
    setIsOpen(false)
    // Defer reset so closing animation can use the previous state, then clear.
    setTimeout(() => dispatch({ type: 'RESET' }), 200)
  }, [])

  const setField = useCallback(
    <K extends keyof KudoComposeFormState>(field: K, value: KudoComposeFormState[K]) => {
      dispatch({ type: 'SET_FIELD', field, value })
    },
    []
  )
  const setRecipient = useCallback((recipient: KudosUser | null) => {
    dispatch({ type: 'SET_RECIPIENT', recipient })
  }, [])
  const toggleHashtag = useCallback((tag: string) => {
    dispatch({ type: 'TOGGLE_HASHTAG', tag })
  }, [])
  const setImages = useCallback((urls: readonly string[]) => {
    dispatch({ type: 'SET_IMAGES', urls })
  }, [])
  const setErrors = useCallback((errors: FormErrors) => {
    dispatch({ type: 'SET_ERRORS', errors })
  }, [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  const value = useMemo<KudoComposeContextValue>(
    () => ({
      isOpen,
      open,
      close,
      form: state.form,
      recipient: state.recipient,
      errors: state.errors,
      isDirty: state.isDirty,
      setField,
      setRecipient,
      toggleHashtag,
      setImages,
      setErrors,
      reset,
    }),
    [isOpen, open, close, state, setField, setRecipient, toggleHashtag, setImages, setErrors, reset]
  )

  return <KudoComposeContext.Provider value={value}>{children}</KudoComposeContext.Provider>
}

export function useKudoComposeContext(): KudoComposeContextValue {
  const ctx = useContext(KudoComposeContext)
  if (!ctx) throw new Error('useKudoComposeContext must be used within <KudoComposeProvider>')
  return ctx
}
