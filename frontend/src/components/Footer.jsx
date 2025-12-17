const Footer = ({ footerSections = [], socialLinks = [] }) => {
  return (
    <footer className="bg-primary-dark text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {footerSections.map((section) => (
            <div key={section.id}>
              <h4 className="text-base font-bold mb-6 uppercase tracking-wider">
                {section.column_title}
              </h4>

              {section.column_type === 'about' ? (
                <>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    {section.content}
                  </p>

                  {/* Social Links */}
                  <div className="flex gap-3 mt-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white no-underline transition-all duration-300 hover:bg-accent hover:text-white"
                        title={social.get_platform_display}
                      >
                        <i className={social.icon_class}></i>
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                <ul className="space-y-3">
                  {section.links?.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.link_url}
                        className="text-gray-300 text-sm no-underline transition-colors duration-300 hover:text-accent"
                      >
                        {link.link_text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 CozyCorner. All Rights Reserved. | Premium Furniture & Home Decor</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
