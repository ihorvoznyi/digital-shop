import { generalStore } from "../../../../store";
import { useNavigate } from "react-router-dom";

const NavLinks = () => {
  const navigate = useNavigate();
  const navLinks = generalStore.types;

  return (
    <div className='navbar__links'>
      {navLinks && navLinks.map((link) => (
        <div
          key={link.id}
          className='navbar__link'
          onClick={() => navigate(`/${link.tag}`)}
        >
          <span>{link.name}</span>
        </div>
      ))}
    </div>
  );
};

export default NavLinks;
