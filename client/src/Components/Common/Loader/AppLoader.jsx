const AppLoader = () => {
  return (
    <div className="h-screen p-6 space-y-6 animate-pulse">
      <div className="h-10 w-40 bg-gray-200 rounded"></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};

export default AppLoader;
