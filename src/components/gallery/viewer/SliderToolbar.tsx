import React from 'react';
import styled from 'styled-components';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  LeftOutlined,
  DoubleRightOutlined,

  PlaySquareOutlined,
  SlidersFilled,
  SlidersOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Divider, Space } from 'antd';


const S = {
  Toolbar: styled.div`
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(2px) saturate(180%);
    border-radius: 2rem;
    color: black;

    bottom: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    position: absolute;
    // width: 300px;
  `,

  Button: styled.button`
    background: none;
    border: none;
    color: black;
    font-size: 1.2rem;
    cursor: pointer;
    padding: ${({ theme }) => theme.spacing.xs};
    border-radius: ${({ theme }) => theme.radius.sm};

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  `,
}

const SliderToolbar: React.FC = () => {
  return (
    <S.Toolbar>
      <Space>

        <S.Button>
          <PlaySquareOutlined />
        </S.Button>

        <S.Button>
          <SlidersOutlined />
        </S.Button>

        <Divider orientation="vertical" />

        <S.Button>
          <ArrowLeftOutlined />
        </S.Button>
        <S.Button>
          <ArrowRightOutlined />
        </S.Button>

        <Divider orientation="vertical" />

        <S.Button>
          <DoubleRightOutlined />
        </S.Button>
      </Space>
    </S.Toolbar>
  );
};

export default SliderToolbar;
