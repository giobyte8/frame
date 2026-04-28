import { FolderOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import type { Directory } from '../../types/api';
import { basename } from '../../services/pathSvc';

interface DirectoriesGridProps {
  directories: Directory[];
}

const S = {
  Grid: styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
  `,
  Card: styled(Card)`
    cursor: pointer;
    border-radius: ${({ theme }) => theme.radius.md};
    border-color: ${({ theme }) => theme.colors.border};
    transition: border-color 0.2s ease;

    .ant-card-body {
      display: grid;
      gap: ${({ theme }) => theme.spacing.sm};
      padding: ${({ theme }) => theme.spacing.md};
    }

    &:hover {
      border-color: ${({ theme }) => theme.colors.textMuted};
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.textMuted};
      outline-offset: 2px;
    }
  `,
  IconWrap: styled.div`
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 22px;
    line-height: 1;
  `,
  Path: styled(Typography.Paragraph)`
    margin: 0 !important;
    color: ${({ theme }) => theme.colors.textPrimary};
  `,
};

function isKeyboardSelect(event: KeyboardEvent<HTMLElement>): boolean {
  return event.key === 'Enter' || event.key === ' ';
}

export function DirectoriesGrid({ directories }: DirectoriesGridProps) {
  const navigate = useNavigate();

  return (
    <S.Grid>
      {directories.map((dir) => (
        <S.Card
          key={dir.id}
          hoverable
          role="button"
          tabIndex={0}
          onClick={() => navigate(`/gallery/${dir.id}`)}
          onKeyDown={(event) => {
            if (isKeyboardSelect(event)) {
              event.preventDefault();
              navigate(`/gallery/${dir.id}`);
            }
          }}
        >
          <S.IconWrap>
            <FolderOutlined />
          </S.IconWrap>
          <S.Path ellipsis={{ rows: 2, tooltip: basename(dir) }}>
            { basename(dir) }
          </S.Path>
        </S.Card>
      ))}
    </S.Grid>
  );
}
