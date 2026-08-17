// ─────────────────────────────────────────────────────────────────────────────
// src/index.js
//
// WHY THIS FILE?
//   This is the ENTRY POINT of the entire React app.
//   When the browser loads the page, it runs public/index.html which has:
//     <div id="root"></div>
//   index.js finds that <div id="root"> and "mounts" (attaches) the React app
//   inside it. Everything you see in the browser comes from here.
//
// WHAT IS ReactDOM.createRoot()?
//   React 18 introduced createRoot() as the new way to render apps.
//   It gives React control over the <div id="root"> DOM element.
//   .render() then tells React what JSX to put inside that div.
//
// WHAT IS <React.StrictMode>?
//   StrictMode is a development helper. It:
//   - Runs your components TWICE to detect side effects
//   - Shows extra warnings in the browser console
//   - Does NOT affect the production build (users never see it)
//   Think of it as a "stricter coding mode" that helps you write better React.
//
// WHAT IS <BrowserRouter>?
//   BrowserRouter gives your app the ability to READ the URL.
//   Without it, React Router's <Routes> and <Route> won't work because they
//   need to know what URL the user is on.
//
//   BrowserRouter uses the browser's History API to:
//   - Read the current URL
//   - Change the URL without reloading the page
//   - Let the back/forward buttons work correctly
//
//   WHY DOES IT WRAP <App>?
//   BrowserRouter needs to WRAP everything that uses routing.
//   Since App.js uses <Routes>, and Home.jsx's Navbar uses <Link>,
//   they all need to be INSIDE BrowserRouter.
//   Wrapping App means EVERYTHING in our app has access to routing.
//
// WHY IS BOOTSTRAP IMPORTED HERE?
//   "bootstrap/dist/css/bootstrap.min.css" is the full Bootstrap CSS file.
//   Importing it once here makes Bootstrap classes available globally —
//   in every component without importing it again.
//   If you imported it only in one component, other components wouldn't get it.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import ReactDOM from "react-dom/client";

// Bootstrap CSS — imported ONCE here so it's available to all components
import "bootstrap/dist/css/bootstrap.min.css";

// Our global CSS (fonts, CSS variables, resets)
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// This measures page performance (optional, comes with Create React App)
reportWebVitals();
