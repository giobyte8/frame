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
    border-radius: ${({ theme }) => theme.radius.md};
    margin: 0 auto;
    position: sticky;
    top: ${({ theme }) => theme.spacing.xs};
    width: ${({ theme }) => `calc(100% - (${theme.spacing.lg} * 2))`};
    max-width: ${({ theme }) => `calc(${theme.layout.maxContentWidth} - (${theme.spacing.lg} * 2))`};
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
  { key: '/root/', label: '/root/' },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = location.pathname.startsWith('/root') ? '/root/' : '';

  return (
    <S.AppShell>
      <S.AppHeader>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={selectedKey ? [selectedKey] : []}
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
