"use strict";angular.module("motortouchApp",["ngSanitize","ngRoute","ngResource","ui.bootstrap","ngAnimate"]).config(["$routeProvider","$httpProvider",function(a){a.when("/",{templateUrl:"views/home.html",controller:"HomeCtrl",reloadOnSearch:!1}).when("/old/company",{templateUrl:"views/company.html",controller:"PostShowCtrl",reloadOnSearch:!1}).when("/company",{templateUrl:"views/company/showsimple.html",controller:"PostShowCtrl",reloadOnSearch:!1}).when("/old/models",{templateUrl:"views/model/all.html",controller:"PostListCtrl",reloadOnSearch:!1}).when("/models",{templateUrl:"views/model/allsimple.html",controller:"PostListCtrl",reloadOnSearch:!1}).when("/old/models/:modelSlug",{templateUrl:"views/model/show.html",controller:"PostShowCtrl",reloadOnSearch:!1}).when("/models/:modelSlug",{templateUrl:"views/model/showsimple.html",controller:"PostShowCtrl",reloadOnSearch:!1}).when("/old/pieces/:pieceSlug",{templateUrl:"views/piece/show.html",controller:"PostShowCtrl",reloadOnSearch:!1}).when("/pieces/:pieceSlug",{templateUrl:"views/piece/showsimple.html",controller:"PostShowCtrl",reloadOnSearch:!1}).otherwise({redirectTo:"/"})}]).run(["$http","$rootScope","initialisation","constants","Post","$location",function(a,b,c,d,e,f){var g=f.$$search.theme;g&&angular.element(document.getElementsByTagName("body")).addClass("theme-"+g),b.constants=d,b.sidepanels={left:!1,right:!1,menu:!1},c.trackHistory()}]),angular.module("motortouchApp").factory("constants",function(){var a={};return a.API_URL="http://public-api.wordpress.com/rest/v1/sites/vzix.wordpress.com",a.API_URL="http://demo.mekaviz.com/wp_api/v1",a}),angular.module("motortouchApp").service("initialisation",["$rootScope","$location","vvvv",function(a,b,c){var d=function(){a.history=[],a.historyIndex=0,a.historyButtonClicked=!1,a.scenecontrolButtonClicked=!1,a.$on("$routeChangeStart",function(){c.emit({url:b.$$path})}),a.$on("$routeChangeSuccess",function(){a.historyButtonClicked||a.scenecontrolButtonClicked||(a.history.splice(a.historyIndex),a.history.push(b.$$path),a.historyIndex=a.history.length),a.historyButtonClicked=!1})};return{trackHistory:d}}]),angular.module("motortouchApp").filter("filterByParamId",function(){return function(a,b,c){for(var d=[],e=0,f=a.length;f>e;e++)a[e][b]._id===c&&d.push(a[e]);return d}}),angular.module("motortouchApp").filter("filterByParamVal",function(){return function(a,b,c){for(var d=[],e=0,f=a.length;f>e;e++)a[e][b]===c&&d.push(a[e]);return d}}),angular.module("motortouchApp").filter("getById",function(){return function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]._id===b)return a[c];return null}}),angular.module("motortouchApp").filter("hasWordpressCategory",function(){return function(a,b){for(var c=[],d=0,e=a.length;e>d;d++)-1!==a[d].categories.indexOf(b)&&c.push(a[d]);return c}}),angular.module("motortouchApp").filter("hasWordpressTag",function(){return function(a,b){for(var c=[],d=0,e=a.length;e>d;d++)-1!==a[d].tags.indexOf(b)&&c.push(a[d]);return c}}),angular.module("motortouchApp").service("vvvv",["$rootScope","$window","$location","$timeout",function(a,b){b.VVVV={evenements:[]}||b.VVVV;var c=document.getElementById("description"),d=function(a){b.VVVV.evenements.push(a),c.setAttribute("content",JSON.stringify(a).replace(/\"/g,"'"))};return{emit:d}}]),angular.module("motortouchApp").factory("Post",["$resource","$rootScope","$filter","$q","constants",function(a,b,c,d,e){var f,g=e.API_URL+"/posts/:postId?callback=JSON_CALLBACK";if(0===e.API_URL.indexOf("http://public-api.wordpress.com"))f="wordpress.com";else{if(-1===e.API_URL.indexOf("/wp_api/v1"))throw"Invalid API URI";f="thermal-api.com",g+="&per_page=100"}var h=a(g,{postId:"@id"},{query:{method:"JSONP",params:{postId:"@id"}}}),i=d.defer();return h.query(function(a){var d=[];"wordpress.com"==f?d=a.posts.map(function(a){var b={content:a.content,date:a.date,featured_image:a.featured_image,slug:a.slug,title:a.title,type:a.type};b.categories=[];for(var c in a.categories)b.categories.push(a.categories[c].slug);b.tags=[];for(var c in a.tags)b.tags.push(a.tags[c].slug);return b}):"thermal-api.com"==f&&(d=a.posts.map(function(a){var b={content:a.content_display,date:a.date,slug:a.name,title:a.title,type:a.type};if(a.meta.featured_image){var c=a.media.filter(function(b){return b.id===a.meta.featured_image});c[0].sizes[0].url&&(b.featured_image=c[0].sizes[0].url)}b.categories=[];for(var d in a.taxonomies.category)b.categories.push(a.taxonomies.category[d].slug);b.tags=[];for(var d in a.taxonomies.post_tag)b.tags.push(a.taxonomies.post_tag[d].slug);return b})),b.company=c("hasWordpressTag")(d,"company")[0],b.models=c("hasWordpressCategory")(d,"model"),b.pieces=c("hasWordpressCategory")(d,"piece"),i.resolve()}),i.promise}]),angular.module("motortouchApp").directive("dynamic",["$compile",function(a){return{restrict:"A",replace:!0,link:function(b,c,d){b.$watch(d.dynamic,function(d){"localhost"===window.location.hostname&&""===window.location.port&&d&&(d=d.replace(/http:\/\/demo.mekaviz.com\/wp-content\/uploads\//g,window.location.origin+"/vk/wp-content/uploads/")),c.html(d),a(c.contents())(b)})}}}]),angular.module("motortouchApp").directive("pre",[function(){return{restrict:"E",link:function(a,b){b.hasClass("transclude")&&b.replaceWith(b[0].innerText)}}}]),angular.module("motortouchApp").directive("scenecontrol",["$rootScope","vvvv",function(a,b){return{restrict:"E",replace:!0,templateUrl:"views/scenecontrol.html",link:function(a){a.compress=function(){b.emit({action:"compress"})},a.expand=function(){b.emit({action:"expand"})}}}}]),angular.module("motortouchApp").directive("sidepanelnavigation",["$rootScope","$window",function(a,b){return{restrict:"E",replace:!0,templateUrl:"views/sidepanelnavigation.html",link:function(c){c.goBack=function(){a.historyIndex=a.historyIndex-1,a.historyButtonClicked=!0,b.history.back()},c.goForward=function(){a.historyIndex=a.historyIndex+1,a.historyButtonClicked=!0,b.history.forward()}}}}]),angular.module("motortouchApp").controller("HomeCtrl",[function(){}]),angular.module("motortouchApp").controller("PostListCtrl",["Post","$scope","vvvv",function(a,b,c){b.Math=window.Math,b.scrolllevel=0,b.modelSelection=function(a){c.updateUrl({action:"modelselection",modelslug:a})}}]),angular.module("motortouchApp").controller("PostShowCtrl",["$rootScope","$scope","$filter","$routeParams","Post",function(a,b,c,d,e){var f=d.modelSlug||"",g=d.pieceSlug||"";e.then(function(){f?(b.model=c("filterByParamVal")(a.models,"slug",f)[0],b.modelpieces=c("hasWordpressTag")(a.pieces,b.model.slug)):g&&(b.piece=c("filterByParamVal")(a.pieces,"slug",g)[0],b.model=c("filterByParamVal")(a.models,"slug",b.piece.tags[0])[0],b.modelpieces=c("hasWordpressTag")(a.pieces,b.model.slug))})}]),angular.module("motortouchApp").run(["$templateCache",function(a){a.put("views/company/show.html",'<div ng-class="{sidepanel:true, sidepanelright:true, active:$root.sidepanels.right}">\n	<div class="menubutton" ng-click="$root.sidepanels.right = !$root.sidepanels.right;">\n		<span>Infos</span>\n	</div>\n	<div class="logocontainer">\n		<img ng-src="{{company.featured_image}}">\n	</div>\n	<div class="sidepanelcontent">\n		<sidepanelnavigation></sidepanelnavigation>\n		<div dynamic="company.content"></div>\n		<div ng-class="{\'list-group\':true, sidepanelmenu:true, active:$root.sidepanels.menu}">\n			<a href="#/company" class="list-group-item current">About us</a>\n		</div>\n	</div>\n</div>\n'),a.put("views/company/showsimple.html",'<div class="simple">\n	<div dynamic="company.content"></div>\n</div>\n'),a.put("views/home.html",'<div class="browsable">\n	<img ng-src="{{company.featured_image}}">\n	<hr />\n<!--\n	<h2>Left</h2>\n	<div class="list-group">\n		<a href="#/models" class="list-group-item">All models</a>\n	</div>\n	<h2>Right</h2>\n-->\n	<div class="list-group">\n		<a href="#/company" class="list-group-item">Company</a>\n	</div>\n  <accordion close-others="true">\n		<accordion-group heading="{{model.title}}" ng-repeat="model in models | orderBy:\'date\':false">\n			<div class="list-group">\n				<a ng-href="#/models/{{model.slug}}" class="list-group-item">- Description -</a>\n				<a ng-repeat="piece in pieces  | hasWordpressTag:model.slug" ng-href="#/pieces/{{piece.slug}}" class="list-group-item">\n					{{piece.title}}\n				</a>\n			</div>\n		</accordion-group>\n	</accordion>\n</div>\n'),a.put("views/model/all.html",'<div ng-class="{sidepanel:true, sidepanelleft:true, active:$root.sidepanels.left}">\n	<div class="menubutton" ng-click="$root.sidepanels.left = !$root.sidepanels.left;">\n		<span>Modèles</span>\n	</div>\n	<div class="logocontainer">\n		<img ng-src="{{company.featured_image}}">\n	</div>\n	<div class="sidepanelcontent">\n		<div ng-class="{sidepanelcontrol:true, sidepanelcontroltop:true, clickable:(scrolllevel > 0)}" ng-click="scrolllevel = (scrolllevel > 0) ? Math.max(scrolllevel - 3, 0) : scrolllevel;">\n			<i class="fa fa-caret-up"></i>\n		</div>\n		<div ng-class="{sidepanelcontrol:true, sidepanelcontrolbottom:true, clickable:(scrolllevel < models.length - 6)}" ng-click="scrolllevel = (scrolllevel < models.length - 6) ?  Math.min(scrolllevel + 3,models.length - 6) : scrolllevel;">\n			<i class="fa fa-caret-down"></i>\n		</div>\n		<ul ng-style="{\'-webkit-transform\':\'translate3d(0,-\' + scrolllevel * 155 + \'px,0)\'}">\n			<li ng-repeat="model in models" class="clearfix" ng-click="modelSelection(model.slug)">\n				<img ng-src="{{model.featured_image}}">\n				<span ng-bind="model.title"></span>\n			</li>\n		</ul>\n	</div>\n</div>\n'),a.put("views/model/allsimple.html",'<ul class="simpleall">\n	<li ng-repeat="model in models" class="clearfix">\n		<img ng-src="{{model.featured_image}}">\n	</li>\n</ul>\n'),a.put("views/model/show.html",'<div ng-class="{sidepanel:true, sidepanelright:true, active:$root.sidepanels.right}">\n	<div class="menubutton" ng-click="$root.sidepanels.right = !$root.sidepanels.right;">\n		<span>Infos</span>\n	</div>\n	<scenecontrol></scenecontrol>\n	<div class="sidepanelcontent">\n		<h3 ng-bind-html="model.title"></h3>\n		<sidepanelnavigation></sidepanelnavigation>\n		<div dynamic="model.content"></div>\n		<div ng-class="{\'list-group\':true, sidepanelmenu:true, active:$root.sidepanels.menu}">\n			<a ng-href="#/models/{{model.slug}}" class="list-group-item current">{{model.title}}</a>\n			<a ng-repeat="modelpiece in modelpieces" ng-href="#/pieces/{{modelpiece.slug}}" class="list-group-item">\n				{{model.title}} / {{modelpiece.title}}\n			</a>\n			<a href="#/company" class="list-group-item">About us</a>\n		</div>\n	</div>\n</div>\n'),a.put("views/model/showsimple.html",'<div class="simple">\n	<h3 ng-bind-html="model.title"></h3>\n	<div dynamic="model.content"></div>\n</div>\n'),a.put("views/piece/show.html",'<div ng-class="{sidepanel:true, sidepanelright:true, active:$root.sidepanels.right}">\n	<div class="menubutton" ng-click="$root.sidepanels.right = !$root.sidepanels.right;">\n		<span>Infos</span>\n	</div>\n	<scenecontrol></scenecontrol>\n	<div class="sidepanelcontent">\n		<h3>{{model.title}} / {{piece.title}}</h3>\n		<sidepanelnavigation></sidepanelnavigation>\n		<div dynamic="piece.content"></div>\n		<div ng-class="{\'list-group\':true, sidepanelmenu:true, active:$root.sidepanels.menu}">\n			<a ng-href="#/models/{{model.slug}}" class="list-group-item">{{model.title}}</a>\n			<a ng-repeat="modelpiece in modelpieces" ng-href="#/pieces/{{modelpiece.slug}}" ng-class="{\'list-group-item\':true, current:modelpiece == piece}">\n				{{model.title}} / {{modelpiece.title}}\n			</a>\n			<a href="#/company" class="list-group-item">About us</a>\n		</div>\n	</div>\n</div>\n'),a.put("views/piece/showsimple.html",'<div class="simple">\n	<h3>{{model.title}} / {{piece.title}}</h3>\n	<div dynamic="piece.content"></div>\n</div>\n'),a.put("views/scenecontrol.html",'<div class="scenecontrol">\n	<ul>\n		<li ng-click="compress()">\n			<svg height="40" version="1.1" width="40" xmlns="http://www.w3.org/2000/svg">\n				<path class="hoverpath" fill="none" stroke="#ffffff" d="M25.083,18.895L16.654999999999998,16.636L18.912999999999997,25.064L20.750999999999998,23.227L27.804,30.28L30.279999999999998,27.804000000000002L23.226999999999997,20.751L25.083,18.895ZM5.542,11.731L13.97,13.989L11.712,5.561L9.874,7.398L3.196,0.72L0.72,3.196L7.398,9.874L5.542,11.731ZM7.589,20.935L0.7190000000000003,27.804L3.1950000000000003,30.279999999999998L10.064,23.410999999999998L11.922,25.267999999999997L14.18,16.839999999999996L5.751999999999999,19.097999999999995L7.589,20.935ZM23.412,10.064L30.279,3.194L27.803,0.718L20.935000000000002,7.587L19.079,5.731L16.821,14.159L25.249000000000002,11.9L23.412,10.064Z" stroke-width="3" stroke-linejoin="round" opacity="1" transform="matrix(1,0,0,1,4,4)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); stroke-linejoin: round;"></path>\n				<path fill="#333333" stroke="none" d="M25.083,18.895L16.654999999999998,16.636L18.912999999999997,25.064L20.750999999999998,23.227L27.804,30.28L30.279999999999998,27.804000000000002L23.226999999999997,20.751L25.083,18.895ZM5.542,11.731L13.97,13.989L11.712,5.561L9.874,7.398L3.196,0.72L0.72,3.196L7.398,9.874L5.542,11.731ZM7.589,20.935L0.7190000000000003,27.804L3.1950000000000003,30.279999999999998L10.064,23.410999999999998L11.922,25.267999999999997L14.18,16.839999999999996L5.751999999999999,19.097999999999995L7.589,20.935ZM23.412,10.064L30.279,3.194L27.803,0.718L20.935000000000002,7.587L19.079,5.731L16.821,14.159L25.249000000000002,11.9L23.412,10.064Z" transform="matrix(1,0,0,1,4,4)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path>\n			</svg>\n		<li ng-click="expand()">\n			<svg height="40" version="1.1" width="40" xmlns="http://www.w3.org/2000/svg">\n				<path  class="hoverpath" fill="none" stroke="#ffffff" d="M25.545,23.328L17.918,15.623L25.534,8.007L27.391,9.864L29.649,1.436L21.222,3.694L23.058,5.53L15.455,13.134L7.942,5.543L9.809,3.696L1.393,1.394L3.608,9.833L5.456,8.005L12.98,15.608L5.465,23.123L3.609,21.268L1.351,29.695L9.779,27.438L7.941,25.6L15.443,18.098L23.057,25.791L21.19,27.638L29.606,29.939L27.393,21.5Z" stroke-width="3" stroke-linejoin="round" transform="matrix(1,0,0,1,4,4)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); stroke-linejoin: round;"></path>\n				<path fill="#333333" stroke="none" d="M25.545,23.328L17.918,15.623L25.534,8.007L27.391,9.864L29.649,1.436L21.222,3.694L23.058,5.53L15.455,13.134L7.942,5.543L9.809,3.696L1.393,1.394L3.608,9.833L5.456,8.005L12.98,15.608L5.465,23.123L3.609,21.268L1.351,29.695L9.779,27.438L7.941,25.6L15.443,18.098L23.057,25.791L21.19,27.638L29.606,29.939L27.393,21.5Z" transform="matrix(1,0,0,1,4,4)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path>\n			</svg>\n		<li class="iconcontainer" style="float:right"><i class="fa fa-cog"></i>\n	</ul>\n</div>\n'),a.put("views/sidepanelnavigation.html",'<div class="sidepanelcontrol sidepanelcontrolbottom  clickable">\n	<div class="navBack" ng-click="goBack()" ng-show="$root.historyIndex > 1">\n		<i class="fa fa-caret-left"></i>\n	</div>\n	<div class="navForward" ng-click="goForward()" ng-show="$root.history.length !== $root.historyIndex">\n		<i class="fa fa-caret-right"></i>\n	</div>\n	<div class="menuToggle" ng-click="$root.sidepanels.menu = !$root.sidepanels.menu">\n		<i class="fa fa-caret-up" ng-show="!$root.sidepanels.menu"></i>\n		<i class="fa fa-caret-down" ng-show="$root.sidepanels.menu"></i>\n	</div>\n</div>\n')}]);