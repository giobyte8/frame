import { Layout, Menu } from 'antd';
import styled from 'styled-components';
import Gallery from './gallery/masonry/Gallery';

const { Header, Content } = Layout;

const AppShell = styled(Layout)`
  min-height: 100vh;
`;

const GalleryContent = styled(Content)`
  padding: 24px;
`;

function App() {
  return (
    <AppShell>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          items={[
            { key: 'home', label: 'Home' },
            { key: 'galleries', label: 'My Galleries' },
            { key: 'favorites', label: 'Favorites' },
          ]}
        />
      </Header>
      <GalleryContent>
        <Gallery />
      </GalleryContent>
    </AppShell>
  );
}

export default App;
