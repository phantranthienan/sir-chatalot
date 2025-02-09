import { THEMES } from '@/constants/themes';
import { useThemeStore } from '@/stores/theme.store';
import { Send } from 'lucide-react';

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true,
  },
];

const SettingPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <main className="container mx-auto min-h-screen max-w-5xl px-4 pt-24">
      <div className="space-y-6">
        <header className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-base-content/70 text-sm">
            Choose a theme for your chat interface
          </p>
        </header>

        <section className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`group flex cursor-pointer flex-col items-center gap-1.5 rounded-lg p-2 transition-colors ${theme === t ? 'bg-base-300' : ''} `}
              onClick={() => setTheme(t)}
            >
              <div
                className="relative h-8 w-full overflow-hidden rounded-md"
                data-theme={t}
              >
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="bg-primary rounded"></div>
                  <div className="bg-secondary rounded"></div>
                  <div className="bg-accent rounded"></div>
                  <div className="bg-neutral rounded"></div>
                </div>
              </div>
              <span className="w-full text-center text-xs font-medium">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </section>

        {/* Preview Section */}
        <h2 className="mb-3 text-lg font-semibold">Preview</h2>
        <section className="border-base-300 bg-base-100 overflow-hidden rounded-xl border shadow-lg">
          <div className="bg-base-200 p-4">
            <div className="mx-auto max-w-lg">
              {/* Mock Chat UI */}
              <div className="bg-base-100 overflow-hidden rounded-xl shadow-sm">
                {/* Chat Header */}
                <div className="border-base-300 bg-base-100 border-b px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary text-primary-content flex h-8 w-8 items-center justify-center rounded-full font-medium">
                      J
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">John Doe</h3>
                      <p className="text-base-content/70 text-xs">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="bg-base-100 max-h-[200px] min-h-[200px] space-y-4 overflow-y-auto p-4">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl p-3 shadow-sm ${message.isSent ? 'bg-primary text-primary-content' : 'bg-base-200'} `}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`mt-1.5 text-[10px] ${message.isSent ? 'text-primary-content/70' : 'text-base-content/70'} `}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="border-base-300 bg-base-100 border-t p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered h-10 flex-1 text-sm"
                      placeholder="Type a message..."
                      value="This is a preview"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
export default SettingPage;
