import { Layout } from 'antd';
import FloatingTopNav from '../components/navigation/FloatingTopNav';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const S = {
  AppShell: styled(Layout)`
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.background};
  `,
  Content: styled(Content)`
    width: 100%;
    margin: 0 auto;
    padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.lg} ${theme.spacing.lg}`};
    padding-top: ${({ theme }) => `calc(${theme.spacing.lg} + 64px)`};

    @media (max-width: 900px) {
      padding-top: ${({ theme }) => `calc(${theme.spacing.md} + 64px)`};
    }
  `,
};

export default function AppLayout() {
  return (
    <S.AppShell>
      <FloatingTopNav />
      <S.Content>
        <Outlet />
      </S.Content>
    </S.AppShell>
  );
}
