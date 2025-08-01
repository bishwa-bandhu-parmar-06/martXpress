import React, { useState } from 'react';

const CursorFollow = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="h-screen w-screen relative overflow-hidden"
    >
      <div
        className="bg-red-500 h-10 w-10 rounded-full absolute pointer-events-none"
        style={{
          top: position.y,
          left: position.x,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
};

export default CursorFollow;
