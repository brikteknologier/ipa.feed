__ipa.feed__ is a feed module for [IPA](http://www.github.com/brikteknologier/ipa).
It takes an array of feeds and returns a function that will read them and send
any new articles to IPA.

## Example

```javascript
var ipaServerUrl = 'http://localhost:4567';
var feeds = [
  'https://github.com/brikteknologier.atom',
  'https://github.com/jonpacker.atom',
  'https://github.com/deestan.atom'
];
var updateFeeds = require('ipa.feed')(ipaServerUrl, feeds);

updateFeeds(function(err) {
  if (!err) console.log('Feeds have been updated!');

  // Send any new articles to the ipa server after 60 seconds (60000ms)
  setTimeout(function() { updateFeeds() }, 60000);
});
```
