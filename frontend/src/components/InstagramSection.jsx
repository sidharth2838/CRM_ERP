const InstagramSection = ({ instagram }) => {
  if (!instagram) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-light-bg text-center">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="section-title">Follow Us on Instagram</h2>
          <p className="section-subtitle">
            <strong className="text-accent">@{instagram.instagram_handle}</strong>
          </p>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <a
              key={i}
              href={`https://instagram.com/${instagram.instagram_handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square bg-gradient-to-br from-accent to-accent-dark rounded cursor-pointer flex items-center justify-center text-white text-3xl transition-transform duration-300 hover:scale-105"
            >
              <i className="fab fa-instagram"></i>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
