import { useEffect, useState } from 'react';
import tw from 'twin.macro'

const AlertPopup = ({ type, isVisible, setIsVisible }: { type: string, isVisible: boolean, setIsVisible: any }) => {

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div tw="border pointer-events-none transform left-1/2 w-[20rem] -translate-x-1/2 fixed flex justify-center z-[1000] bottom-0">
      <div tw="mb-4 mr-4 p-4 w-fit bg-[#000000aa] text-center text-white rounded min-w-[10rem] shadow-lg transition-opacity pointer-events-none">
        {`${type} Coming soon`}
      </div>
    </div>
  );
};

export default AlertPopup;