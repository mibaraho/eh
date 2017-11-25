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
  azureCredentials:{
     spellCheck: {
        host: 'api.cognitive.microsoft.com',
        path: '/bing/v7.0/spellcheck',
        key: '43583b23dd4e44429f86adcbc4509ee7'
     },
    translatorText:{
      host: 'api.cognitive.microsoft.com',
      path: '/sts/v1.0',
      key: 'fd9fb49e9a0b483bad062fc74027a3a3'
    },
    textAnalytics :{
      host: 'brazilsouth.api.cognitive.microsoft.com',
      path: '/text/analytics/v2.0',
      key: '38618e5611c548d58f072f2dce37eddc'
    }
  }
}