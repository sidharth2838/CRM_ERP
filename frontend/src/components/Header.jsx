import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ navigationItems = [] }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-1000 bg-white border-b border-light-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <a href="/" className="text-2xl font-bold text-primary-dark no-underline">
            CozyCorner
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-12 flex-1 ml-12">
            <a href="/catalog" className="text-primary font-medium text-sm uppercase tracking-wider no-underline relative transition-colors duration-300 hover:text-accent after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-full">
              Shop
            </a>
            {navigationItems
              .filter((item) => !item.parent)
              .map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  className="text-primary font-medium text-sm uppercase tracking-wider no-underline relative transition-colors duration-300 hover:text-accent after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.label}
                </a>
              ))}
          </nav>

          {/* Header Icons */}
          <div className="flex gap-8 items-center">
            <button className="text-primary hover:text-accent transition-colors text-lg" title="Search">
              <i className="fas fa-search"></i>
            </button>
            <button className="text-primary hover:text-accent transition-colors text-lg" title="Wishlist">
              <i className="fas fa-heart"></i>
            </button>
            <button 
              className="text-primary hover:text-accent transition-colors text-lg relative" 
              title="Cart">
              <i className="fas fa-shopping-cart"></i>
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </button>
            <button className="text-primary hover:text-accent transition-colors text-lg" title="Account">
              <i className="fas fa-user"></i>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-primary hover:text-accent transition-colors text-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-4">
            {navigationItems
              .filter((item) => !item.parent)
              .map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  className="text-primary font-medium text-sm uppercase tracking-wider no-underline hover:text-accent"
                >
                  {item.label}
                </a>
              ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
