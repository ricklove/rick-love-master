import React, { useEffect, useRef } from 'react';
import { VrTestGame } from '@ricklove/vr-games';

const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });

function App() {
  return (
    <div>
      <VrTestGame worker={worker} />
    </div>
  );
}

export default App;
