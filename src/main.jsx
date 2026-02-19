import ReactDOM from 'react-dom/client';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import App from './App.jsx';
import './i18next';
import './polyfills';

dayjs.extend(localizedFormat);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
