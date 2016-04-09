/**
 * Admin for Boonera
 * 
 * @version: v2.0
 * @date: 2016-02-26
 * @author: Noodlio <noodlio@seipel-ibisevic.com>
 * @website: www.noodl.io
 * 
*/

// !important settings
// Please fill in the following constants to get the project up and running
//
var FBURL                       = 'https://boonera.firebaseio.com';  
var SERVER_SIDE_URL             = 'https://shop-server-boonera.c9users.io';    // https://boonera.herokuapp.com // https://shop-server-boonera.c9users.io

var LIMITVALUE                  = 10000000;
var STRIPE_URL_AUTHORIZE        = SERVER_SIDE_URL + "/authorize";
var STRIPE_FIREBASE_GEN_TOKEN   = SERVER_SIDE_URL + "/firebase/generatetoken";

angular.module('noodlio', [
  'ui.router', 
  'firebase',
  'naif.base64',
  'btford.markdown',
  'noodlio.controllers-account',
  'noodlio.controllers-home',
  'noodlio.controllers-categories',
  'noodlio.controllers-connect',
  'noodlio.controllers-items',
  'noodlio.controllers-sales',
  'noodlio.controllers-settings-fees',
  'noodlio.controllers-navbar',
  'noodlio.controllers-submit',
  'noodlio.services-auth',
  'noodlio.services-categories',    // todo: put categories in settings
  'noodlio.services-settings',
  'noodlio.services-products',
  'noodlio.services-orders',
  'noodlio.services-utils',
  ]
)

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  
    //$locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix('!');
    $urlRouterProvider.otherwise('/admin/home');
    $stateProvider

    // abstract state in the form of a navbar
    .state('admin', {
        url: '/admin',
        templateUrl: '/templates/navbar.html',
        abstract: true,
        controller:'NavBarCtrl as navbar',
    })
    
    // home
    .state('admin.home', {
        url: '/home',
        templateUrl: '/templates/home.html',
        controller:'HomeCtrl as home',

    })
    
    .state('admin.categories', {
        url: '/categories',
        templateUrl: '/templates/categories.html',
        controller:'CategoriesCtrl as categories',
    })
    
    .state('admin.settings-fees', {
        url: '/settings/fees',
        templateUrl: '/templates/settings-fees.html',
        controller:'SettingsFeesCtrl as settings',
    })
    
    .state('admin.login', {
        url: '/login',
        templateUrl: '/templates/login.html',
        controller:'AccountCtrl as account',
    })
    
    .state('admin.items', {
        url: '/items',
        templateUrl: '/templates/items.html',
        controller:'ItemsCtrl as items',
    })
    
    .state('admin.sales', {
        url: '/sales',
        templateUrl: '/templates/sales.html',
        controller:'SalesCtrl as sales',
    })
    .state('admin.sales-detail', {
        url: '/sales/:index/:orderId',
        templateUrl: '/templates/sales-detail.html',
        controller:'SalesDetailCtrl as sdetail',
    })
    
    .state('admin.submit', {
        url: '/submit/:productId',
        templateUrl: '/templates/submit.html',
        controller:'SubmitCtrl as submit',
    })
    
    .state('admin.connect', {
        url: '/connect',
        templateUrl: '/templates/connect.html',
        controller:'ConnectCtrl as connect',
    })

})

/**
 * Directives
 */

.directive('itemCols', function() {
  return {
    templateUrl: 'templates/directives/item-cols.html'
  };
})

.directive('attributeSettings', function() {
  return {
    templateUrl: 'templates/directives/attribute-settings.html'
  };
})

.directive('checkoutCartOverview', function() {
  return {
    templateUrl: 'templates/directives/checkout-cart-overview.html'
  };
})