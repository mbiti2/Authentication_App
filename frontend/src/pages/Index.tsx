// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-900 px-4">
      <div className="text-center bg-white/80 rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-extrabold mb-4 text-blue-900">Welcome to Your Blank App</h1>
        <p className="text-xl text-blue-700 mb-6">Start building your amazing project here!</p>
        <a href="/login" className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-6 shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200">
          Go to Login
        </a>
      </div>
    </div>
  );
};

export default Index;
