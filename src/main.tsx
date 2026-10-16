import { createRoot } from 'react-dom/client';
import App from './App';
import { seedMissingPhrases } from './db';
import './styles.css';

seedMissingPhrases().then(() => {
  createRoot(document.getElementById('root')!).render(<App />);
});
