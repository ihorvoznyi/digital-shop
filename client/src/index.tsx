import ReactDOM from 'react-dom/client';
import { App } from './App';
import Layout from './layouts/Layout';
import './assets/general.scss';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <Layout>
      <App />
    </Layout>
  </BrowserRouter>,
);
