import AppWithRoutes from './routes/app-with-routes';
import { BrowserRouter } from 'react-router-dom';
import ReactQueryProvider from './providers/react-query.provider';

import { useThemeStore } from './stores/theme.store';
import Navbar from './components/navbar';
import Notification from './components/ui/notification';

const App = () => {
  const { theme } = useThemeStore();
  return (
    <BrowserRouter>
      <ReactQueryProvider>
        <div data-theme={theme}>
          <Navbar />
          <Notification />
          <AppWithRoutes />
        </div>
      </ReactQueryProvider>
    </BrowserRouter>
  );
};

export default App;
