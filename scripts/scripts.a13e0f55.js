angular.module("wikiApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.bootstrap","svcWiki"]).config(["$routeProvider",function(a){"use strict";a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).otherwise({redirectTo:"/"})}]),angular.module("svcWiki",[]).factory("wikiCache",["$cacheFactory",function(a){"use strict";return a({myData:[]})}]).factory("wikiSvc",["$http","$q","$cacheFactory",function(a,b,c){"use strict";var d=b.defer(),e=c({myData:[]}),f="https://en.wikipedia.org/w/api.php?",g={getMenuItems:function(b){var c={action:"opensearch",format:"json",namespace:0,search:b,callback:"JSON_CALLBACK"};return a.jsonp(f,{params:c}).then(function(a){return a})["catch"](function(a){var b="Error: @wikiSvc.getMenuItems -- "+a.status;return d.reject(b),d.promise})},getWikis:function(b,c){if(void 0!==b&&""!==b){var e=[],g={action:"opensearch",format:"json",namespace:0,search:b,limit:c,callback:"JSON_CALLBACK"};return a.jsonp(f,{params:g}).then(function(a){for(var b=0;b<a.data[1].length;b++)e.push({title:a.data[1][b],snippet:a.data[2][b],link:a.data[3][b]});return e})["catch"](function(a){var b="Error: @wikiSvc.getWikis -- "+a.status;return d.reject(b),d.promise})}},genRandWikiArray:function(){var b={action:"query",format:"json",list:"random",rnlimit:10,rnnamespace:0,callback:"JSON_CALLBACK"};return a.jsonp(f,{params:b}).then(function(a){var b=a.data.query.random;return e.put("myData",b)},function(a){var b="Error: @wikiSvc.genRandWikiArray -- "+a.status;return d.reject(b),d.promise})},getRandArticle:function(b){var c=[],g={action:"opensearch",format:"json",namespace:0,search:b[0].title,limit:1,callback:"JSON_CALLBACK"};return a.jsonp(f,{params:g}).then(function(a){return c.push({title:a.data[1][0],snippet:a.data[2][0],link:a.data[3][0]}),b.shift(),e.put("myData",b),c})["catch"](function(a){var b="Error: @wikiSvc.getRandArticle -- "+a.status;return d.reject(b),d.promise})},getRandom:function(){if(void 0===e.get("myData")||0===e.get("myData").length)return g.genRandWikiArray().then(function(a){return g.getRandArticle(a)});var a=e.get("myData");return g.getRandArticle(a)}};return g}]),angular.module("wikiApp").controller("MainCtrl",["$http","$log","wikiSvc",function(a,b,c){"use strict";var d=this;d.checkbox=!1,d.reqMenuItems=function(a){return d.checkbox?c.getMenuItems(a).then(function(a){return a.data[1].map(function(a){return a})},function(a){d.error=!0,b.error(a)}):void 0},d.reqWikis=function(){c.getWikis(d.asyncSelected,25).then(function(a){a.length?d.noResults=!1:d.noResults=!0,d.results=a},function(a){d.error=!0,b.error(a)})},d.reqRandom=function(){return c.getRandom().then(function(a){d.results=a},function(a){d.error=!0,b.error(a)})}}]),angular.module("wikiApp").run(["$templateCache",function(a){"use strict";a.put("views/main.html",'<div ng-controller="MainCtrl"> <div class="error" ng-if="main.error"> An error has occurred. Check your browser console for details. </div> <section id="query"> <h4 class="sr-only">Search Bar</h4> <div class="checkbox"> <label> <input type="checkbox" ng-model="main.checkbox"> Show close matches </label> </div> <form class="form-inline" id="wiki-form" ng-submit="main.reqWikis()"> <input class="form-control" type="text" autocomplete="off" ng-model="main.asyncSelected" placeholder="Query" uib-typeahead="item for item in main.reqMenuItems($viewValue)" typeahead-loading="loading" typeahead-no-results="noResults"> <button class="btn btn-default" id="submit" type="submit" form="wiki-form"><i class="glyphicon glyphicon-search"></i><span class="sr-only">Submit</span></button> <button class="btn btn-default" id="explore" type="button" ng-click="main.reqRandom()"><i class="glyphicon glyphicon-education"></i><span class="sr-only">Explore</span></button> </form> </section> <section id="results"> <h4 class="sr-only">Search Results</h4> <div class="indicator" ng-if="main.checkbox"> <i ng-show="loading" class="glyphicon glyphicon-refresh"></i> <div ng-show="noResults"> <i class="glyphicon glyphicon-remove"></i> No results found </div> </div> <div class="indicator" ng-if="!main.checkbox" ng-show="main.noResults"><i class="glyphicon glyphicon-remove"></i> No results found</div> <ul ng-repeat="item in main.results"> <dl> <a href="{{ item.link }}"> <dt>{{ item.title }}</dt> <dd>{{ item.snippet }}</dd> </a> <div class="divider"></div> </dl> </ul> </section> </div>')}]);