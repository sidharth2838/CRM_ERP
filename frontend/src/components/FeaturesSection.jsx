const FeaturesSection = ({ features = [] }) => {
  if (features.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="p-6 rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-hover border-t-4 border-accent"
              style={{
                backgroundColor: feature.background_color || '#f9f8f6',
                color: feature.text_color || 'inherit',
              }}
            >
              {/* Icon */}
              {feature.icon_image ? (
                <img
                  src={feature.icon_image}
                  alt={feature.title}
                  className="w-20 h-20 mx-auto mb-4"
                />
              ) : (
                <div className="text-5xl text-accent mb-4 text-center">
                  <i className={`fas fa-${feature.icon_type || 'star'}`}></i>
                </div>
              )}

              <h3 className="text-lg font-bold text-primary-dark mb-4 uppercase tracking-wider text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
