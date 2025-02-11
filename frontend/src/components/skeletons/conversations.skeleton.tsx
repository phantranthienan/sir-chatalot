const ConversationsSkeleton = () => {
  // Create 8 skeleton items
  const skeletonConversations = Array(8).fill(null);

  return (
    <div className="w-full overflow-y-auto py-3">
      {skeletonConversations.map((_, idx) => (
        <div key={idx} className="flex w-full items-center gap-3 p-3">
          {/* Avatar skeleton */}
          <div className="relative mx-auto lg:mx-0">
            <div className="skeleton size-12 rounded-full" />
          </div>

          {/* User info skeleton - only visible on larger screens */}
          <div className="hidden min-w-0 flex-1 text-left lg:block">
            <div className="skeleton mb-2 h-4 w-32" />
            <div className="skeleton h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationsSkeleton;
