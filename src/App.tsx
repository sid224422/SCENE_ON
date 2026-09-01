import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ToastProvider } from './components/Toast'
import { CursorGlow } from './components/motion/CursorGlow'
import { SmoothScroll } from './components/motion/SmoothScroll'
import { LandingPage } from './pages/LandingPage'
import { SignupPage } from './pages/SignupPage'
import { SuccessPage } from './pages/SuccessPage'
import { TermsPage } from './pages/TermsPage'
import { SignupProvider } from './state/SignupContext'

export default function App() {
  return (
    <SignupProvider>
      <ToastProvider>
        <BrowserRouter>
          <SmoothScroll>
            <a className="skip-link" href="#main">
              Skip to content
            </a>
            <div className="atmosphere">
              <div className="grain" aria-hidden="true" />
              <CursorGlow />
              <div className="shell" id="main">
                <AnimatedRoutes />
              </div>
            </div>
          </SmoothScroll>
        </BrowserRouter>
      </ToastProvider>
    </SignupProvider>
  )
}

function routeGroup(pathname: string) {
  if (pathname.startsWith('/signup')) return 'signup'
  return pathname
}

function AnimatedRoutes() {
  const location = useLocation()
  const reduce = useReducedMotion()
  const group = routeGroup(location.pathname)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={group}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0.12 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/verify" element={<SignupPage />} />
          <Route path="/signup/about" element={<SignupPage />} />
          <Route path="/signup/city" element={<SignupPage />} />
          <Route path="/welcome" element={<SuccessPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}
