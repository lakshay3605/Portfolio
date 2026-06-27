'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface AiSceneErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface AiSceneErrorBoundaryState {
  hasError: boolean;
}

export class AiSceneErrorBoundary extends Component<
  AiSceneErrorBoundaryProps,
  AiSceneErrorBoundaryState
> {
  constructor(props: AiSceneErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): AiSceneErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('AI cinematic scene error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
