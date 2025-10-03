'use client';

import { useState } from 'react';

export function AnswerGenerator() {
  const [url, setTopic] = useState('');
  const [poem, setPoem] = useState('');

  const generatePoem = async () => {
    const response = await fetch('/api/finnExtract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    setPoem(data);
  };

  return (
    <div>
      <input
        type="text"
        value={url}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a topic"
      />
      <button onClick={generatePoem}>Generate Poem</button>
      {poem && <pre>{JSON.stringify(poem)}</pre>}
    </div>
  );
}
