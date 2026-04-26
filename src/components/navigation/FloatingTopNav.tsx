import React from 'react';
import {
  ArrowLeftOutlined,
  AppstoreOutlined,
  BorderOutlined,
  DownOutlined,
  RetweetOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Space, Tooltip, Typography } from 'antd';
import type { MenuProps } from 'antd';
import styled from 'styled-components';

interface FloatingTopNavProps {
  currentPath: string;
}

const S = {
  StickyLayer: styled.div`
    position: sticky;
    top: ${({ theme }) => theme.spacing.sm};
    z-index: 20;
    height: 0;
    pointer-events: none;
  `,
  LeftNav: styled.div`
    position: absolute;
    top: 0;
    left: ${({ theme }) => theme.spacing.lg};
    pointer-events: auto;
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.surface};
    box-shadow: 0 10px 24px rgba(17, 24, 39, 0.12);
    max-width: min(620px, calc(100vw - 220px));

    @media (max-width: 900px) {
      left: ${({ theme }) => theme.spacing.md};
      max-width: calc(100vw - 180px);
    }

    @media (max-width: 640px) {
      max-width: calc(100vw - 140px);
    }
  `,
  RightNav: styled.div`
    position: absolute;
    top: 0;
    right: ${({ theme }) => theme.spacing.lg};
    pointer-events: auto;
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.surface};
    box-shadow: 0 10px 24px rgba(17, 24, 39, 0.12);

    @media (max-width: 900px) {
      right: ${({ theme }) => theme.spacing.md};
    }
  `,
  PathText: styled(Typography.Text)`
    min-width: 140px;
    max-width: 440px;

    @media (max-width: 900px) {
      max-width: 260px;
    }

    @media (max-width: 640px) {
      max-width: 160px;
    }
  `,
};

const toParentPathItems = (path: string): MenuProps['items'] => {
  const cleanPath = path.trim() || '/root/';
  const normalized = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  const parts = normalized.split('/').filter(Boolean);

  const parentPaths = parts
    .map((_, index) => `/${parts.slice(0, index + 1).join('/')}/`)
    .slice(0, -1)
    .reverse();

  if (parentPaths.length === 0) {
    return [
      {
        key: 'no-parent',
        label: 'No parent directories',
        disabled: true,
      },
    ];
  }

  return parentPaths.map((parentPath) => ({
    key: parentPath,
    label: parentPath,
    disabled: true,
  }));
};

const FloatingTopNav: React.FC<FloatingTopNavProps> = ({ currentPath }) => {
  const safePath = currentPath || '/root/';
  const parentPathItems = toParentPathItems(safePath);

  return (
    <S.StickyLayer>
      <S.LeftNav>
        <Tooltip title="Back">
          <Button shape="circle" icon={<ArrowLeftOutlined />} disabled />
        </Tooltip>

        <Dropdown menu={{ items: parentPathItems }} trigger={['click']}>
          <Button>
            Parent <DownOutlined />
          </Button>
        </Dropdown>

        <S.PathText strong ellipsis={{ tooltip: safePath }}>
          {safePath}
        </S.PathText>
      </S.LeftNav>

      <S.RightNav>
        <Space.Compact>
          <Tooltip title="Large grid">
            <Button icon={<BorderOutlined />} />
          </Tooltip>
          <Tooltip title="Medium grid">
            <Button type="primary" icon={<AppstoreOutlined />} />
          </Tooltip>
          <Tooltip title="Small grid">
            <Button icon={<UnorderedListOutlined />} />
          </Tooltip>
        </Space.Compact>

        <Tooltip title="Toggle recursive view">
          <Button icon={<RetweetOutlined />}>Recursive</Button>
        </Tooltip>
      </S.RightNav>
    </S.StickyLayer>
  );
};

export default FloatingTopNav;
