'use client';

import { useState } from 'react';

export function PoemGenerator() {
  const [topic, setTopic] = useState('');
  const [poem, setPoem] = useState('');

  const generatePoem = async () => {
    const response = await fetch('/api/poem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });
    const data = await response.json();
    setPoem(data.poem);
  };

  return (
    <div>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a topic"
      />
      <button onClick={generatePoem}>Generate Poem</button>
      {poem && <pre>{poem}</pre>}
    </div>
  );
}
