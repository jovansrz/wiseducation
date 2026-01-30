# Frontend Features Recap

## Overview
The WISEducation frontend is a React application built with authentication, educational modules, market simulation, interactive community features, and AI assistance. Below is a detailed breakdown of the current implemented features.

## 1. Authentication
- **Login Modal**: Simple authentication interface requiring user credentials.
- **State Management**: Tracks `isAuthenticated` state to toggle between Landing page and App interface.

## 2. Dashboard
- **User Greetings**: Personalized welcome message.
- **Portfolio Summary**: 
  - Total balance display.
  - Growth percentage arrow (Green/Red).
  - Visualization chart (SVG) for portfolio history (1D, 1W, 1M, 1Y).
- **Quick Actions**: Shortcuts to significant features (Start Simulation, Learning, AI Mentor, Community).
- **Learning Widget**: Displays current active course, progress percentage, and "Continue Lesson" button.
- **Recent Activities**: Feed of user actions (e.g., "Bought 5 lots", "Completed Quiz", "AI Mentor Analysis").

## 3. Education Module
- **Course Listing**: Grid view of available learning modules.
- **Filtering & Search**:
  - Search bar for specific topics.
  - Category tags: All Levels, Beginner, Intermediate, Advanced.
- **Progress Tracking**: Visual progress bars for started courses.
- **Course Cards**: Display title, description, difficulty level, and progress.

## 4. Community & Social
- **Feed**:
  - Main discussion feed with sorting (Trending, New, Top, Filter).
  - Post types: Text discussions, Chart analysis (with image), Polls.
- **Interactions**: Upvote/Downvote, Comment counts, Share.
- **Sidebar Navigation**: My Feed, Discover, Saved, Communities (StockTalk, CryptoCorner, etc.).
- **Top Contributors**: Leaderboard widget showing top users by reputation points.

## 5. Market Data
- **Stock List**: Visualization of available stocks.
- **Stock Details**: Specifics like Ticker, Price, Change, Volume, Market Cap, PE Ratio, etc.
- **Mock Data**: Currently powered by a static `stocks.ts` file.

## 6. AI Assistant
- **Interface**: Chat-based interface for asking market questions.
- **Integration**: Linked from dashboard for "Instant analysis".

## 7. Navigation & Layout
- **Sidebar**: Main navigation menu.
- **Header**: Global search and user profile actions.
- **Responsive Design**: Adjustments for mobile and desktop views.
