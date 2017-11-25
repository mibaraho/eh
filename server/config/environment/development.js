'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connecton opions
  sequelize: {
    uri: 'mysql://root:@127.0.0.1:3306/eh',
    options: {
      logging: false
    }
  },

  // Seed database on startup
  seedDB: false,
  azureCredentias:{
  	 host: 'https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck',
     path: '/bing/v7.0/spellcheck'
  }
};
