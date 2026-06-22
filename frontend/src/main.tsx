import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { polyfill } from "mobile-drag-drop";
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";
import "mobile-drag-drop/default.css";
import './index.css'
import App from './App.tsx'

// Enable drag and drop polyfill for mobile devices
polyfill({
    dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
    dragImageCenterOnTouch: true
});

window.addEventListener('touchmove', function() {}, {passive: false});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
