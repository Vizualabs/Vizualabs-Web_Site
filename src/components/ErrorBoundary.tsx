import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
  onError?: (error: unknown) => void
}

interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * Generic class-based boundary — React has no hook equivalent. Used to
 * isolate failures in specific, non-critical widgets (e.g. the WebGL fire)
 * so they degrade quietly instead of taking the whole page down.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    this.props.onError?.(error)
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}
