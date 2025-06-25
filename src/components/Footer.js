import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-2 mt-auto">
      &copy; {new Date().getFullYear()} Task Manager App - Akshay Chandarkar
    </footer>
  );
}

export default Footer;
