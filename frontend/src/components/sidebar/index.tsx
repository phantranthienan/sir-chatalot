import React, { useRef } from 'react';
import { useInitiateConversationMutation } from '@/hooks/react-query/conversations';

import { Users, Plus } from 'lucide-react';
import ConversationList from './conversation-list';

const Sidebar: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: initiateConversation } = useInitiateConversationMutation();

  const handleInitiateConversation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = inputRef.current!.value.trim();
    if (!username) return;
    initiateConversation({ username });
    (document.getElementById('modal') as HTMLDialogElement).close();
  };
  return (
    <aside className="border-base-200 flex h-full w-20 flex-col border-r-4 transition-all duration-200 lg:w-72">
      <div className="border-base-200 flex w-full flex-col items-center gap-5 border-b-4 py-4 lg:flex-row lg:justify-between lg:px-6">
        <div className="flex items-center justify-center gap-2">
          <Users size={24} />
          <span className="hidden font-medium lg:block">Contacts</span>
        </div>
        <button
          onClick={() =>
            (document.getElementById('modal') as HTMLDialogElement)!.showModal()
          }
          className="btn btn-square"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Modal for inititating conversation */}

      <dialog id="modal" className="modal">
        <form
          onSubmit={handleInitiateConversation}
          className="modal-box flex items-center justify-center gap-2"
        >
          <input
            ref={inputRef}
            name="username"
            type="text"
            className="input w-full"
            placeholder="username"
          />
          <button type="submit" className="btn btn-primary btn-square">
            <Plus size={24} />
          </button>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <ConversationList />
    </aside>
  );
};

export default Sidebar;
