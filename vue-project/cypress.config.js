const { defindeConfig } = require('cypress');

module.exports = defindeConfig({
    e2e: {
        baseUrl: 'http://localhost:5003',
    },
    projectId: "fz2o1x"
});