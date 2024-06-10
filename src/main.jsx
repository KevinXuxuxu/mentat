import React from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import Mentat from './mentat.jsx'

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(
<React.StrictMode>
  <Mentat />
</React.StrictMode>);
