import ChatContainer from '@/components/home/chat-container';
import Sidebar from '@/components/home/sidebar';

const HomePage = () => {
  return (
    <div className="bg-base-200 h-screen px-4 pt-24 pb-4">
      <div className="bg-base-100 m-auto h-full w-full max-w-7xl rounded-lg">
        <div className="flex h-full overflow-hidden rounded-lg">
          <Sidebar />
          <ChatContainer />
        </div>
      </div>
    </div>
  );
};
export default HomePage;
