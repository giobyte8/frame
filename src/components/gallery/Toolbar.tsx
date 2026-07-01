import styled from 'styled-components';
import { Button, Divider, Select, Space } from 'antd';
import { FolderOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

import { useDirWithLineage } from '../../hooks/useDirectory';
import type { Directory, UUID } from '../../types/api';


const S = {
  Toolbar: styled.div`
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(2px) saturate(180%);

    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    width: 100%;
  `,

  Button: styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: ${({ theme }) => theme.spacing.xs};
    border-radius: ${({ theme }) => theme.radius.sm};

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  `,
}

type ToolbarProps = {
  children?: React.ReactNode;
};

const Toolbar = ({ children }: ToolbarProps) => {
  const navigate = useNavigate();

  // Resolve current dir details
  const { directoryId } = useParams<{ directoryId: UUID }>();
  const { dirWithLineage } = useDirWithLineage(directoryId);
  const directory = dirWithLineage?.directory;

  // Prepare lineage select options
  const dirLineageOptions = dirWithLineage
    ? mkLineageOptions(dirWithLineage.lineage)
    : [];
  dirLineageOptions.push({
    value: directoryId ?? '',
    label: directory?.path ?? '',
    disabled: true,
  });

  return <S.Toolbar>
    <Space>
      <Select
        prefix=<> <FolderOutlined />&nbsp; </>
        defaultValue={ directoryId }
        style={{ width: 300 }}
        options={ dirLineageOptions }
        onSelect={ (dirId) => navigate(`/gallery/${dirId}`) }
      />

      <Button
        icon={ <HomeOutlined /> }
        onClick={ () => navigate('/root/') }
        type="text"
      />
    </Space>
    <Divider orientation="vertical" />

    {children}
  </S.Toolbar>;
};

const mkLineageOptions = (lineage: Directory[]): {
  value: UUID | string,
  label: string,
  disabled?: boolean
}[] => {
  return [...lineage]
    .reverse()
    .map(dir => ({
      value: dir.id,
      label: dir.path,
    }));
}

export default Toolbar;
