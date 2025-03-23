import { LuArrowLeft, LuHouse } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router";

type NavbarProps = {
  backText?: string;
  backRoute?: string;
};

const Navbar = ({ backText = "Go Back", backRoute }: NavbarProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between text-gray-600">
      <button
        onClick={() => (backRoute ? navigate(backRoute) : navigate(-1))}
        className="flex items-center hover:text-gray-900 mb-4"
      >
        <LuArrowLeft className="w-4 h-4 mr-2" />
        {backText}
      </button>
      <NavLink to="/features" className="hover:text-gray-900">
        <LuHouse />
      </NavLink>
    </div>
  );
};

export default Navbar;
