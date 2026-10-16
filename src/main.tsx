import { createRoot } from 'react-dom/client';
import App from './App';
import { seedIfFirstRun } from './db';
import './styles.css';

seedIfFirstRun().then(() => {
  createRoot(document.getElementById('root')!).render(<App />);
});
