import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onToggleSidebar }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleBlur = () => {
    setDropdownOpen(false);
  };

  return (
    <header className="admin-navbar" data-navbarbg="skin6">
      <nav className="navbar top-navbar navbar-expand-md navbar-dark">
        <div
          className="flex-grow pe-5"
          id="navbarSupportedContent"
          data-navbarbg="skin5"
        >
          <ul className="flex items-center justify-end space-x-4">
            <li className="relative" onBlur={handleBlur}>
              <a
                className="flex items-center text-black cursor-pointer"
                id="navbarDropdown"
                onClick={toggleDropdown}
              >
                <img
                  src="/assets/client/images/avatar.png"
                  alt="user"
                  className="w-9 h-9 rounded-full mr-2"
                />
                <span>Markarn Doe</span>
              </a>
              {isDropdownOpen && (
                <ul className="absolute bg-white border border-gray-200 rounded mt-2 right-0 shadow-lg min-w-max">
                  <li>
                    <Link
                      className="block px-4 py-2 text-black hover:bg-gray-100 whitespace-nowrap"
                      to="/change-account"
                    >
                      Đổi tài khoản
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-2 text-black hover:bg-gray-100 whitespace-nowrap"
                      to="/logout"
                    >
                      Đăng xuất
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
