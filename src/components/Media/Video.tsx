import React, { FC, useRef, useEffect, CSSProperties } from 'react';
import { StreamManager } from 'openvidu-browser';

type VideoProps = {
    streamManager: StreamManager;
    width?: CSSProperties['width'];
    height?: CSSProperties['height'];
    objectFit?: CSSProperties['objectFit'];
};

export const Video: FC<VideoProps> = ({ streamManager, width, height, objectFit = 'cover' }) => {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        ref.current && streamManager.addVideoElement(ref.current);
    }, [streamManager]);

    return <video style={{ width, height, objectFit }} autoPlay={true} ref={ref} />;
};
