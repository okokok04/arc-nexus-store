import { Component } from 'react';
import { WalletProvider } from './context/WalletContext.jsx';
import WalletConnect from './components/WalletConnect.jsx';
import RestaurantPanel from './components/RestaurantPanel.jsx';
import EventStream from './components/EventStream.jsx';
import FeedbackLink from './components/FeedbackLink.jsx';
import { captureException } from './lib/monitoring.js';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    captureException(error, { componentStack: errorInfo?.componentStack });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#ff4d4d' }}>
          <h2>Oops! Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">Reload App</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <WalletProvider>
        <div className="app">
          <WalletConnect />
          <main className="main-content">
            <ErrorBoundary>
              <RestaurantPanel />
            </ErrorBoundary>
            <ErrorBoundary>
              <EventStream />
            </ErrorBoundary>
          </main>
          <footer className="footer">
            <WalletConnect />
            <FeedbackLink />
          </footer>
        </div>
      </WalletProvider>
    </ErrorBoundary>
  );
}
