import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Redirect
  useEffect(() => {
    navigate('/');
  }, []);

  return (
    <div>
      Home page
    </div>
  );
};

export default Home;
