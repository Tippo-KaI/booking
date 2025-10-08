import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">
            Facebook
          </a>
          <a href="#" className="hover:text-white">
            Instagram
          </a>
          <a href="#" className="hover:text-white">
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
