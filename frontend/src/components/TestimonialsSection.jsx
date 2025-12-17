const TestimonialsSection = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) return null;

  const renderStars = (rating) => {
    return '★'.repeat(rating || 5);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Real reviews from real customers</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-light-bg p-8 rounded-lg border-l-4 border-accent"
            >
              {/* Stars */}
              <div className="text-accent mb-4 text-lg tracking-wider">
                {renderStars(testimonial.rating)}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.testimonial_text}"
              </p>

              {/* Author */}
              <div>
                <p className="font-bold text-primary-dark text-sm">
                  {testimonial.author_name}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {testimonial.author_title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
