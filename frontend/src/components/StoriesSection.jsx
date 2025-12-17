const StoriesSection = ({ stories }) => {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title">Our Stories</h2>
          <p className="section-subtitle">Latest updates and inspiration from CozyCorner</p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div key={story.id} className="card">
              {/* Story Image */}
              <div className="relative w-full h-56 bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center overflow-hidden">
                {story.featured_image ? (
                  <img
                    src={story.featured_image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="fas fa-newspaper text-4xl text-white opacity-60"></i>
                )}
              </div>

              {/* Story Content */}
              <div className="p-6">
                <div className="text-accent text-xs font-bold uppercase tracking-wider mb-3">
                  {new Date(story.story_date).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <h3 className="text-xl font-bold text-primary-dark mb-3 leading-snug">
                  {story.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {story.excerpt}
                </p>
                <a href={story.read_more_url} className="text-accent font-bold no-underline hover:underline transition-all">
                  READ MORE →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoriesSection;
