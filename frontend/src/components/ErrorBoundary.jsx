import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        maxWidth: '600px',
        margin: 'auto',
        color: 'var(--text)'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>⚠️</div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--orange)' }}>Something went wrong</h2>
        <p style={{ marginBottom: '20px', color: 'var(--text2)' }}>
          We're sorry, an unexpected error occurred in the dashboard.
        </p>
        
        {this.state.error && (
          <details style={{ textAlign: 'left', background: 'var(--surface2)', padding: '12px', borderRadius: 8, marginBottom: '20px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, marginBottom: '8px' }}>Error Details (click to expand)</summary>
            <pre style={{ fontSize: '0.8rem', color: 'var(--text2)', margin: 0, whiteSpace: 'pre-wrap' }}>
              {this.state.error?.message || 'Unknown error'}
              {this.state.errorInfo?.componentStack?.slice(0, 500)}
            </pre>
          </details>
        )}
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={this.handleReload}
            style={{
              padding: '12px 24px',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            🔄 Reload Page
          </button>
          <button
            onClick={() => window.location.href = '/auth'}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: 'var(--primary)',
              border: '1px solid var(--primary)',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;

