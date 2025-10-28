import React from 'react'
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import './App.css'
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  

  return (
    <>
      <AppRoutes/>
      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default App
