import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AppstoreOutlined,
  BorderOutlined,
  DownOutlined,
  HomeOutlined,
  RetweetOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Space, Tooltip, Typography } from 'antd';
import type { MenuProps } from 'antd';
import styled from 'styled-components';

import type { UUID } from '../../types/api';
import { useDirectory } from '../../hooks/useDirectory';
import { basename } from '../../services/pathSvc';


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

const LeftNav: React.FC = () => {
  const { directoryId } = useParams<{ directoryId: UUID }>();
  if (!directoryId) return null;

  const navigate = useNavigate();
  const {
    directory,
    isLoading,
    error
  } = useDirectory(directoryId);

  if (isLoading || error || !directory) return null;

  return (
    <S.LeftNav>
      <Tooltip title="Home">
        <Button
          icon={<HomeOutlined />}
          onClick={() => navigate('/root/')}
        />
      </Tooltip>

      <S.PathText strong ellipsis={{ tooltip: directory.path }}>
        { basename(directory) }/
      </S.PathText>
    </S.LeftNav>
  );
}

const RightNav: React.FC = () => {
  // Hidden until implementation is complete
  const enabled = false;
  if (!enabled) return null;

  return (
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
  );
}

const FloatingTopNav: React.FC = () => {
  return (
    <S.StickyLayer>
      <LeftNav />

      <RightNav />
    </S.StickyLayer>
  );
};

export default FloatingTopNav;
