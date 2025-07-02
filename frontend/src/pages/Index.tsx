// Update this page (the content is just a fallback if you fail to update the page)

import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    // Simple fade-in animation for hero and features
    const fadeEls = document.querySelectorAll('.fade-in');
    fadeEls.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('opacity-100', 'translate-y-0');
      }, 200 + i * 200);
    });
    // Animate on scroll
    const onScroll = () => {
      document.querySelectorAll('.scroll-animate').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add('opacity-100', 'translate-y-0');
        }
      });
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-900 flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center px-4 py-16 fade-in opacity-0 translate-y-8 transition-all duration-1000">
        <div className="bg-white/80 rounded-2xl shadow-2xl p-10 max-w-2xl w-full text-center">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 shadow-lg">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 2c-2.21 0-4 1.79-4 4v1a1 1 0 001 1h6a1 1 0 001-1v-1c0-2.21-1.79-4-4-4z"/></svg>
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-900 transition-all">Secure, Effortless Sign-In</h1>
          <p className="text-lg md:text-xl text-blue-700 mb-8 transition-all">A modern authentication app for users and admins. Fast, secure, and beautifully simple.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/login" className="rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-8 shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400">Sign In</a>
            <a href="/register" className="rounded-full border-2 border-blue-500 text-blue-700 font-bold py-3 px-8 bg-white/80 shadow-lg hover:bg-blue-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400">Register</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-4xl mx-auto grid md:grid-cols-3 gap-8 scroll-animate opacity-0 translate-y-8 transition-all duration-1000">
        <div className="bg-white/80 rounded-2xl shadow-xl p-6 text-center">
          <h2 className="text-xl font-bold text-blue-900 mb-2">Role-Based Access</h2>
          <p className="text-blue-700">Admins and users get tailored dashboards and features for their needs.</p>
        </div>
        <div className="bg-white/80 rounded-2xl shadow-xl p-6 text-center">
          <h2 className="text-xl font-bold text-blue-900 mb-2">Edit Profile</h2>
          <p className="text-blue-700">Easily update your profile details with a beautiful, responsive UI.</p>
        </div>
        <div className="bg-white/80 rounded-2xl shadow-xl p-6 text-center">
          <h2 className="text-xl font-bold text-blue-900 mb-2">Persistent & Secure</h2>
          <p className="text-blue-700">Stay logged in securely. JWT-based authentication keeps your data safe.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-blue-200 text-sm fade-in opacity-0 translate-y-8 transition-all duration-1000">
        &copy; {new Date().getFullYear()} Authentication App. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
