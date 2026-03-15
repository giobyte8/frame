import { Layout, Menu } from 'antd';
import styled from 'styled-components';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;

const S = {
  AppShell: styled(Layout)`
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.background};
  `,
  AppHeader: styled(Header)`
    position: sticky;
    top: 0;
    z-index: 1;
  `,
  Content: styled(Content)`
    width: 100%;
    max-width: ${({ theme }) => theme.layout.maxContentWidth};
    margin: 0 auto;
    padding: ${({ theme }) => theme.spacing.lg};
  `,
};

const menuItems = [
  { key: '/', label: 'Grid' },
  { key: '/masonry', label: 'Masonry' },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = location.pathname === '/masonry' ? '/masonry' : '/';

  return (
    <S.AppShell>
      <S.AppHeader>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => {
            navigate(key);
          }}
        />
      </S.AppHeader>
      <S.Content>
        <Outlet />
      </S.Content>
    </S.AppShell>
  );
}
