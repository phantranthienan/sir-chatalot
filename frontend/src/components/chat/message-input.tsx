import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useSocketStore } from '@/stores/socket.store';

interface MessageInputProps {
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {
  const [text, setText] = useState<string>('');
  const { sendMessage } = useSocketStore();

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(conversationId, text.trim());
    setText('');
  };
  return (
    <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-2">
      <input
        type="text"
        className="input input-bordered input-sm sm:input-md w-full rounded-lg"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        className="btn btn-square btn-primary btn-sm sm:btn-md rounded-md"
        disabled={!text.trim()}
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default MessageInput;
