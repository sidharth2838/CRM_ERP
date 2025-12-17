const WhyUsSection = ({ whyUs }) => {
  if (!whyUs) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title text-center mb-12">{whyUs.heading}</h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h3 className="text-3xl font-bold text-primary-dark mb-8">{whyUs.heading}</h3>
            <ul className="space-y-4">
              {whyUs.items?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 pb-4 border-b border-light-border">
                  <span className="text-accent font-bold text-xl flex-shrink-0">✓</span>
                  <span className="text-gray-700 text-base leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image */}
          <div className="h-96 bg-gradient-to-br from-light-bg to-gray-200 rounded-lg flex items-center justify-center">
            {whyUs.background_image ? (
              <img
                src={whyUs.background_image}
                alt={whyUs.heading}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <i className="fas fa-couch text-6xl text-gray-300 opacity-50"></i>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
