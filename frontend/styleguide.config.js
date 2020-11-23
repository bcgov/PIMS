const path = require('path');

module.exports = {
  components: 'src/components/**/*.{jsx,tsx}',
  propsParser: (filePath, source, resolver, handlers) => {
    const { ext } = path.parse(filePath);
    return ext === '.tsx'
      ? require('react-docgen-typescript').parse(filePath, source, resolver, handlers)
      : require('react-docgen').parse(source, resolver, handlers);
  },
  template: {
    head: {
      links: [
        {
          rel: 'stylesheet',
          href: '//cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css',
        },
      ],
    },
  },
};
