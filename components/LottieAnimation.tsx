// LottieWrapper.js
import React from 'react';
import Lottie from 'react-lottie';

const LottieWrapper = ({ animationData, loop = true, autoplay = true, height = 200, width = 200 }: any) => {
  const defaultOptions = {
    loop,
    autoplay,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return <Lottie options={defaultOptions} height={height} width={width} />;
};

export default LottieWrapper;