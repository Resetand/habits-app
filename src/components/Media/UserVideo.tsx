import * as icons from '@ant-design/icons';
import * as antd from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { Video } from 'components/Media/Video';
import { StreamManager } from 'openvidu-browser';
import React, { FC, useState } from 'react';
import { getUserByStream } from 'services/lobby';
import styled from 'styled-components';

type UserVideoProps = {
    onMuteChange?: (muted: boolean) => void;
    streamManager: StreamManager;
    size?: SizeType;
};

export const UserVideo: FC<UserVideoProps> = ({ streamManager, onMuteChange, size }) => {
    const [fullScreen, setFullScreen] = useState(false);
    const [muted, setMuted] = useState(false);

    const fullScreenIcon = fullScreen ? (
        <icons.FullscreenExitOutlined />
    ) : (
        <icons.FullscreenOutlined />
    );

    const audioIcon = muted ? <icons.AudioOutlined /> : <icons.AudioMutedOutlined />;

    const CurrentWrapper = fullScreen ? FullScreenWrapper : Wrapper;

    return (
        <CurrentWrapper>
            <Video
                width={'100%'}
                height={fullScreen ? undefined : '100%'}
                streamManager={streamManager}
                objectFit={fullScreen ? 'contain' : 'cover'}
            />
            <UserPreviewContainer>{getUserByStream(streamManager).username}</UserPreviewContainer>
            <ToolbarContainer>
                <antd.Button.Group size={size}>
                    <antd.Button
                        shape="circle"
                        icon={fullScreenIcon}
                        onClick={() => setFullScreen((x) => !x)}
                        type="primary"
                    />
                    <antd.Button
                        disabled={!Boolean(onMuteChange)}
                        shape="circle"
                        icon={audioIcon}
                        onClick={() => setMuted((x) => !x)}
                        type="primary"
                    />
                </antd.Button.Group>
            </ToolbarContainer>
        </CurrentWrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const FullScreenWrapper = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ToolbarContainer = styled.div`
    position: absolute;
    bottom: 20px;
    right: 20px;
`;

const UserPreviewContainer = styled.div`
    padding-right: 20px;
    padding-left: 20px;
    padding-top: 2px;
    padding-bottom: 2px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.2);
    color: #fff;
`;
