import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GalleryProvider } from './context/gallery/GalleryContext';
import { router } from './routes/router';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GalleryProvider>
        <RouterProvider router={router} />
      </GalleryProvider>
    </ThemeProvider>
  );
}

export default App;
