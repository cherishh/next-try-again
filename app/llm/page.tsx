'use client';

import { useChat } from '@ai-sdk/react';

export default function RouteComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  return (
    <div className='m-4'>
      <h2>LLM</h2>
      {/* {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input name='prompt' value={input} onChange={handleInputChange} />
        <button type='submit'>Submit</button>
      </form> */}
    </div>
  );
}
