var FeedParser = require('FeedParser'), parser = new FeedParser();
var async = require('async');
var _ = require('underscore');

module.exports = function(urls, shouldPublish, publish) {
  function readFeed(url, callback) {
    parser.parseUrl(url, function(err, meta, articles) {
      if (err) callback(err);
      else callback(null, _.reject(articles, function(article) {
        return !shouldPublish(article);
      }));
    });
  }

  function publishArticle(article, callback) {
    publish(article.title, callback);
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
