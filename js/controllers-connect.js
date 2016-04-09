angular.module('noodlio.controllers-connect', [])


.controller('ConnectCtrl', function($rootScope, $state, $anchorScroll, $location, Auth, StripeCharge) {
    
    var connect        = this;
    connect.AuthData   = Auth.AuthData;
    
    connect.initView = function() {
        $location.hash('page-top');
        $anchorScroll();
        
        checkAuth();
    };
    
    function checkAuth() { // can be put in a resolve in app.js
        connect.AuthData   = Auth.AuthData;
        Auth.checkAuthState().then(
            function(loggedIn){
                // @dependencies
                connect.AuthData = Auth.AuthData;
                getStripeConnectAuth();
                generateFBAuthToken();
            },
            function(notLoggedIn) {
                $state.go('admin.login')
            }
        );
    };
    
    connect.goTo = function(nextState) {
        $state.go(nextState)
    };
    
    
    // communicates with the DOM
    connect.status = {
        loading: true,
        setupStripeConnect: true,
        setupStripeConnectMode: false,
        loadingStripeConnect: true,
        generateNewToken: false,
        loadingAuthToken: true,
    };

    
    function getStripeConnectAuth() {
        StripeCharge.getStripeConnectAuth_value(connect.AuthData.uid)
          .then(function(SCData) {

            // bind to DOM
            connect.SCData = SCData;
            connect.status['loadingStripeConnect']    = false;
            
            // process the result
            if(SCData == null) {
              // stripe not setup, generate a new token
              connect.status['setupStripeConnect']  = false; 
              connect.status['generateNewToken']    = true;
            } else {
              // stripe connect has been setup, resolve
              connect.status['setupStripeConnect']  = true;
              connect.status['generateNewToken']    = false;
            };
          })
          .catch(function(error) {
            console.log(error)
            connect.status['setupStripeConnect']     = false;
            connect.status['loadingStripeConnect']    = false;
            connect.status['generateNewToken']        = true;
          }
        );
    };
    
    // generate the link to setup stripe connect
    function generateFBAuthToken() {
        StripeCharge.generateFBAuthToken(connect.AuthData.uid).then(
          function(fbAuthToken){
            // update the dynamic url for stripe connect
            connect.status['authorize_url'] = STRIPE_URL_AUTHORIZE + "?userId=" + connect.AuthData.uid + "&token=" + fbAuthToken;
            connect.status['loadingAuthToken']    = false;
          },
          function(error){
            connect.status['loadingAuthToken']    = false;
          }
        );
    };
    
    connect.connectWithStripe = function() {
        connect.setupSubNavCSS = "back-lightblue"
        connect.status['setupStripeConnectMode'] = true;
    };
    
    connect.refreshStripeConnectAuth = function() {
        getStripeConnectAuth();
        connect.status['setupStripeConnectMode'] = false;
    };


})

.factory('StripeCharge', function($q, $http) {
  var self = this;

  
  
  /**
   * =========================================================================
   * 
   * Stripe Connect
   * 
   * =========================================================================
   */
    
  self.getStripeConnectAuth_value = function(userId) {
      var qConnect = $q.defer();
      var ref = new Firebase(FBURL);
      ref.child("stripe_connect_auth").child(userId).on("value", function(snapshot) {
          qConnect.resolve(snapshot.val());
      }, function (errorObject) {
          qConnect.reject(errorObject);
      });
      return qConnect.promise;
  };
    
    
  /**
   * Used in Authentication on the Server-Side
   */
  self.generateFBAuthToken = function(userId) {
    var qGen = $q.defer();
    $http.post(STRIPE_FIREBASE_GEN_TOKEN, {userId: userId})
    .success(
        function(fbAuthToken){
            if(fbAuthToken != null) {
                qGen.resolve(fbAuthToken);
            } else {
                qGen.reject("ERROR_NULL");
            }
        }
    )
    .error(
        function(error){
            qGen.reject(error);
        }
    );
    return qGen.promise;
  };
  
  

  return self;
})
