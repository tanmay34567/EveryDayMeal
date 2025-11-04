import React from 'react';
import Mainbanner from '../components/Mainbanner';

const Home = () => {
  // Home component is now a simple presentational component
  // Authentication and redirection is handled in App.jsx

  // Show Mainbanner only for non-logged-in users
  return (
    <div>
      <Mainbanner />
    </div>
  );
};

export default Home;
