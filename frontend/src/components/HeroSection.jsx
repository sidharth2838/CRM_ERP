const HeroSection = ({ hero }) => {
  if (!hero) return null;

  return (
    <section
      className="relative overflow-hidden py-32 px-4 sm:px-6 lg:px-8 text-white"
      style={{
        backgroundColor: hero.background_color || '#1a1a1a',
        backgroundImage: hero.background_image ? `url('${hero.background_image}')` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Decorative circle */}
      <div className="absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full bg-accent/10 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight -tracking-wider">
          {hero.heading}
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-95 leading-relaxed">
          {hero.subheading}
        </p>
        <a href={hero.cta_button_url || '#'} className="btn-primary">
          {hero.cta_button_text || 'Shop Now'}
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
