"use strict";angular.module("motortouchApp",["ngSanitize","ngRoute","ngResource","ui.bootstrap","ngAnimate"]).config(["$routeProvider","$httpProvider",function(a){a.when("/",{templateUrl:"views/home.html",controller:"HomeCtrl",reloadOnSearch:!1}).when("/company",{templateUrl:"views/company.html",controller:"PostShowCtrl",reloadOnSearch:!1}).when("/models",{templateUrl:"views/model/all.html",controller:"PostListCtrl",reloadOnSearch:!1}).when("/models/:modelSlug",{templateUrl:"views/model/show.html",controller:"PostShowCtrl",reloadOnSearch:!1}).when("/pieces/:pieceSlug",{templateUrl:"views/piece/show.html",controller:"PostShowCtrl",reloadOnSearch:!1}).otherwise({redirectTo:"/"})}]).run(["$rootScope","initialisation","constants","Post","$location",function(a,b,c,d,e){var f=e.$$search.theme;f&&angular.element(document.getElementsByTagName("body")).addClass("theme-"+f),a.constants=c,a.sidepanels={left:!1,right:!1,menu:!1},b.trackHistory()}]),angular.module("motortouchApp").factory("constants",function(){var a={};return a.API_URL="http://public-api.wordpress.com/rest/v1/sites/vzix.wordpress.com",a}),angular.module("motortouchApp").service("initialisation",["$rootScope","$location",function(a,b){var c=function(){a.history=[],a.historyIndex=0,a.historyButtonClicked=!1,a.scenecontrolButtonClicked=!1,a.$on("$routeChangeSuccess",function(){a.currentUrl=b.$$path,a.historyButtonClicked||a.scenecontrolButtonClicked||(a.history.splice(a.historyIndex),a.history.push(b.$$path),a.historyIndex=a.history.length),a.historyButtonClicked=!1})};return{trackHistory:c}}]),angular.module("motortouchApp").filter("filterByParamId",function(){return function(a,b,c){for(var d=[],e=0,f=a.length;f>e;e++)a[e][b]._id===c&&d.push(a[e]);return d}}),angular.module("motortouchApp").filter("filterByParamVal",function(){return function(a,b,c){for(var d=[],e=0,f=a.length;f>e;e++)a[e][b]===c&&d.push(a[e]);return d}}),angular.module("motortouchApp").filter("getById",function(){return function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]._id===b)return a[c];return null}}),angular.module("motortouchApp").filter("hasWordpressCategory",function(){return function(a,b){for(var c=[],d=0,e=a.length;e>d;d++)-1!==a[d].categories.indexOf(b)&&c.push(a[d]);return c}}),angular.module("motortouchApp").filter("hasWordpressTag",function(){return function(a,b){for(var c=[],d=0,e=a.length;e>d;d++)-1!==a[d].tags.indexOf(b)&&c.push(a[d]);return c}}),angular.module("motortouchApp").service("vvvv",["$rootScope","$location","$timeout",function(a,b,c){var d=function(d){for(var e in d){{b.$$path}a.scenecontrolButtonClicked=!0,b.search(e,d[e]),b.replace(),c(function(){b.search(""),b.replace(),a.scenecontrolButtonClicked=!1},300)}};return{updateUrl:d}}]),angular.module("motortouchApp").factory("Post",["$resource","$rootScope","$filter","$q","constants",function(a,b,c,d,e){var f,g=e.API_URL+"/posts/:postId?callback=JSON_CALLBACK";if(0===e.API_URL.indexOf("http://public-api.wordpress.com"))f="wordpress.com";else{if(-1===e.API_URL.indexOf("/wp_api/v1"))throw"Invalid API URI";f="thermal-api.com",g+="&per_page=100"}var h=a(g,{postId:"@id"},{query:{method:"JSONP",params:{postId:"@id"}}}),i=d.defer();return h.query(function(a){var d=[];"wordpress.com"==f?d=a.posts.map(function(a){var b={content:a.content,date:a.date,featured_image:a.featured_image,slug:a.slug,title:a.title,type:a.type};b.categories=[];for(var c in a.categories)b.categories.push(a.categories[c].slug);b.tags=[];for(var c in a.tags)b.tags.push(a.tags[c].slug);return b}):"thermal-api.com"==f&&(d=a.posts.map(function(a){var b={content:a.content_display,date:a.date,slug:a.name,title:a.title,type:a.type};a.meta.featured_image&&(b.featured_image=a.media.filter(function(b){return b.id===a.meta.featured_image})[0].sizes[0].url),b.categories=[];for(var c in a.taxonomies.category)b.categories.push(a.taxonomies.category[c].slug);b.tags=[];for(var c in a.taxonomies.post_tag)b.tags.push(a.taxonomies.post_tag[c].slug);return b})),b.company=c("hasWordpressTag")(d,"company")[0],b.models=c("hasWordpressCategory")(d,"model"),b.pieces=c("hasWordpressCategory")(d,"piece"),i.resolve()}),i.promise}]),angular.module("motortouchApp").directive("dynamic",["$compile",function(a){return{restrict:"A",replace:!0,link:function(b,c,d){b.$watch(d.dynamic,function(d){c.html(d),a(c.contents())(b)})}}}]),angular.module("motortouchApp").directive("pre",[function(){return{restrict:"E",link:function(a,b){b.hasClass("transclude")&&b.replaceWith(b[0].innerText)}}}]),angular.module("motortouchApp").directive("scenecontrol",["$rootScope","vvvv",function(a,b){return{restrict:"E",replace:!0,templateUrl:"views/scenecontrol.html",link:function(a){a.compress=function(){b.updateUrl({action:"compress"})},a.expand=function(){b.updateUrl({action:"expand"})}}}}]),angular.module("motortouchApp").directive("sidepanelnavigation",["$rootScope","$window",function(a,b){return{restrict:"E",replace:!0,templateUrl:"views/sidepanelnavigation.html",link:function(c){c.goBack=function(){a.historyIndex=a.historyIndex-1,a.historyButtonClicked=!0,b.history.back()},c.goForward=function(){a.historyIndex=a.historyIndex+1,a.historyButtonClicked=!0,b.history.forward()}}}}]),angular.module("motortouchApp").controller("HomeCtrl",[function(){}]),angular.module("motortouchApp").controller("PostListCtrl",["Post","$scope","vvvv",function(a,b,c){b.Math=window.Math,b.scrolllevel=0,b.modelSelection=function(a){c.updateUrl({action:"modelselection",modelslug:a})}}]),angular.module("motortouchApp").controller("PostShowCtrl",["$rootScope","$scope","$filter","$routeParams","Post",function(a,b,c,d,e){var f=d.modelSlug||"",g=d.pieceSlug||"";e.then(function(){f?(b.model=c("filterByParamVal")(a.models,"slug",f)[0],b.modelpieces=c("hasWordpressTag")(a.pieces,b.model.slug)):g&&(b.piece=c("filterByParamVal")(a.pieces,"slug",g)[0],b.model=c("filterByParamVal")(a.models,"slug",b.piece.tags[0])[0],b.modelpieces=c("hasWordpressTag")(a.pieces,b.model.slug))})}]),angular.module("motortouchApp").run(["$templateCache",function(a){a.put("views/company.html",'<div ng-class="{sidepanel:true, sidepanelright:true, active:$root.sidepanels.right}">\n	<div class="menubutton" ng-click="$root.sidepanels.right = !$root.sidepanels.right;">\n		<span>Infos</span>\n	</div>\n	<div class="logocontainer">\n		<img ng-src="{{company.featured_image}}">\n	</div>\n	<div class="sidepanelcontent">\n		<sidepanelnavigation></sidepanelnavigation>\n		<div dynamic="company.content"></div>\n		<div ng-class="{\'list-group\':true, sidepanelmenu:true, active:$root.sidepanels.menu}">\n			<a href="#/company" class="list-group-item current">About us</a>\n		</div>\n	</div>\n</div>\n'),a.put("views/home.html",'<div class="browsable">\n	<img ng-src="{{company.featured_image}}">\n	<hr />\n	<h2>Left</h2>\n	<div class="list-group">\n		<a href="#/models" class="list-group-item">All models</a>\n	</div>\n	<h2>Right</h2>\n	<div class="list-group">\n		<a href="#/company" class="list-group-item">Company</a>\n	</div>\n  <accordion close-others="true">\n		<accordion-group heading="{{model.title}}" ng-repeat="model in models | orderBy:\'date\':false">\n			<div class="list-group">\n				<a ng-href="#/models/{{model.slug}}" class="list-group-item">- Description -</a>\n				<a ng-repeat="piece in pieces  | hasWordpressTag:model.slug" ng-href="#/pieces/{{piece.slug}}" class="list-group-item">\n					{{piece.title}}\n				</a>\n			</div>\n		</accordion-group>\n	</accordion>\n</div>\n'),a.put("views/model/all.html",'<div ng-class="{sidepanel:true, sidepanelleft:true, active:$root.sidepanels.left}">\n	<div class="menubutton" ng-click="$root.sidepanels.left = !$root.sidepanels.left;">\n		<span>Modèles</span>\n	</div>\n	<div class="logocontainer">\n		<img ng-src="{{company.featured_image}}">\n	</div>\n	<div class="sidepanelcontent">\n		<div ng-class="{sidepanelcontrol:true, sidepanelcontroltop:true, clickable:(scrolllevel > 0)}" ng-click="scrolllevel = (scrolllevel > 0) ? Math.max(scrolllevel - 3, 0) : scrolllevel;">\n			<i class="fa fa-caret-up"></i>\n		</div>\n		<div ng-class="{sidepanelcontrol:true, sidepanelcontrolbottom:true, clickable:(scrolllevel < models.length - 6)}" ng-click="scrolllevel = (scrolllevel < models.length - 6) ?  Math.min(scrolllevel + 3,models.length - 6) : scrolllevel;">\n			<i class="fa fa-caret-down"></i>\n		</div>\n		<ul ng-style="{\'-webkit-transform\':\'translate3d(0,-\' + scrolllevel * 155 + \'px,0)\'}">\n			<li ng-repeat="model in models" class="clearfix" ng-click="modelSelection(model.slug)">\n				<img ng-src="{{model.featured_image}}">\n				<span ng-bind="model.title"></span>\n			</li>\n		</ul>\n	</div>\n</div>\n'),a.put("views/model/show.html",'<div ng-class="{sidepanel:true, sidepanelright:true, active:$root.sidepanels.right}">\n	<div class="menubutton" ng-click="$root.sidepanels.right = !$root.sidepanels.right;">\n		<span>Infos</span>\n	</div>\n	<scenecontrol></scenecontrol>\n	<div class="sidepanelcontent">\n		<h3 ng-bind-html="model.title"></h3>\n		<sidepanelnavigation></sidepanelnavigation>\n		<div dynamic="model.content"></div>\n		<div ng-class="{\'list-group\':true, sidepanelmenu:true, active:$root.sidepanels.menu}">\n			<a ng-href="#/models/{{model.slug}}" class="list-group-item current">{{model.title}}</a>\n			<a ng-repeat="modelpiece in modelpieces" ng-href="#/pieces/{{modelpiece.slug}}" class="list-group-item">\n				{{model.title}} / {{modelpiece.title}}\n			</a>\n			<a href="#/company" class="list-group-item">About us</a>\n		</div>\n	</div>\n</div>\n'),a.put("views/piece/show.html",'<div ng-class="{sidepanel:true, sidepanelright:true, active:$root.sidepanels.right}">\n	<div class="menubutton" ng-click="$root.sidepanels.right = !$root.sidepanels.right;">\n		<span>Infos</span>\n	</div>\n	<scenecontrol></scenecontrol>\n	<div class="sidepanelcontent">\n		<h3>{{model.title}} / {{piece.title}}</h3>\n		<sidepanelnavigation></sidepanelnavigation>\n		<div dynamic="piece.content"></div>\n		<div ng-class="{\'list-group\':true, sidepanelmenu:true, active:$root.sidepanels.menu}">\n			<a ng-href="#/models/{{model.slug}}" class="list-group-item">{{model.title}}</a>\n			<a ng-repeat="modelpiece in modelpieces" ng-href="#/pieces/{{modelpiece.slug}}" ng-class="{\'list-group-item\':true, current:modelpiece == piece}">\n				{{model.title}} / {{modelpiece.title}}\n			</a>\n			<a href="#/company" class="list-group-item">About us</a>\n		</div>\n	</div>\n</div>\n'),a.put("views/scenecontrol.html",'<div class="scenecontrol">\n	<ul>\n		<li ng-click="compress()"><i class="fa fa-compress"></i>\n		<li ng-click="expand()"><i class="fa fa-expand"></i>\n		<li style="float:right"><i class="fa fa-cog"></i>\n	</ul>\n</div>\n'),a.put("views/sidepanelnavigation.html",'<div class="sidepanelcontrol sidepanelcontrolbottom  clickable">\n	<div class="navBack" ng-click="goBack()" ng-show="$root.historyIndex > 1">\n		<i class="fa fa-caret-left"></i>\n	</div>\n	<div class="navForward" ng-click="goForward()" ng-show="$root.history.length !== $root.historyIndex">\n		<i class="fa fa-caret-right"></i>\n	</div>\n	<div class="menuToggle" ng-click="$root.sidepanels.menu = !$root.sidepanels.menu">\n		<i class="fa fa-caret-up" ng-show="!$root.sidepanels.menu"></i>\n		<i class="fa fa-caret-down" ng-show="$root.sidepanels.menu"></i>\n	</div>\n</div>\n')}]);