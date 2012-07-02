var FeedParser = require('FeedParser'), parser = new FeedParser();
var async = require('async');
var _ = require('underscore');
var ipaClient = require('brik.ipa.client');

module.exports = function(ipaServer, urls) {
  var publist = [];
  var ipa = ipaClient(ipaServer);

  function readFeed(url, callback) {
    parser.parseUrl(url, function(err, meta, articles) {
      if (err) {
        callback(err);
      }
      callback(null, _.reject(articles, function(article) {
        var exists = publist.indexOf(article.guid) !== -1;
        if (!exists) publist.push(article.guid);
        return exists;
      }));
    });
  }

  function publishArticle(article, callback) {
    ipa.log(article.title, callback);
  }

  return function(callback) {
    async.map(urls, readFeed, function(err, newArticles) {
      newArticles = _.sortBy(_.flatten(newArticles, true), function(article) {
        return article.date.getTime();
      });
      async.mapSeries(newArticles, publishArticle, callback || function(){});
    });
  }
}
