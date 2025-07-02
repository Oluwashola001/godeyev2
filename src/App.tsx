// Main App component with routing and theme provider
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HomePage } from './pages/HomePage';
import { TrendingPage } from './pages/TrendingPage';
import { MoviesPage } from './pages/MoviesPage';
import { TVShowsPage } from './pages/TVShowsPage';
import { WatchPage } from './pages/WatchPage';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tvshows" element={<TVShowsPage />} />
          <Route path="/watch/:movieId" element={<WatchPage />} />
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;