const DetailsSection = ({ details }) => {
  if (!details || !details.cards) return null;

  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: details.background_color || '#f9f8f6' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title">{details.heading}</h2>
          <p className="section-subtitle">{details.description}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {details.cards.map((card) => (
            <div key={card.id} className="bg-white p-8 rounded-lg text-center shadow-soft hover:shadow-card transition-shadow duration-300">
              {/* Icon */}
              {card.icon_image ? (
                <img
                  src={card.icon_image}
                  alt={card.title}
                  className="w-16 h-16 mx-auto mb-4"
                />
              ) : (
                <div className="text-4xl text-accent mb-4">
                  <i className={`fas fa-${card.icon_type || 'check'}`}></i>
                </div>
              )}

              <h4 className="text-xl font-bold text-primary-dark mb-3">{card.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailsSection;
