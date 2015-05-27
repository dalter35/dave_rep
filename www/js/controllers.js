angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('UserCtrl', function($scope, Users) {

	$scope.Math = window.Math;

})

.controller('UserDetailCtrl', function($scope, $stateParams, Users) {
	$scope.user = Users.get({userId : $stateParams.userId});
})



.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('CardsCtrl', function($scope, TDCardDelegate, Users) {

	Users.query({}, function(results) {
		$scope.cards = results;
	});

	$scope.cardDestroyed = function(index) {
		$scope.cards.splice(index, 1);
	};

	$scope.upvote = function(user) {
		Users.save({userId: user._id}, {vote: 'up'});
	};

	$scope.downvote = function(user) {
		Users.save({userId: user._id}, {vote:'down'});
	};
})

.controller("LoginController", function($scope, $cordovaOauth, $localStorage, $location) {
 
    $scope.login = function() {
        $cordovaOauth.facebook("399897616865099", ["email", "user_location", "user_friends"]).then(function(result) {
            $localStorage.accessToken = result.access_token;
            $location.path("/profile");
        }, function(error) {
            alert(error);
            console.log(error);
        });
    };
 
})

.controller("ProfileController", function($scope, $http, $localStorage, $location, Users) {
 
    $scope.init = function() {
        if($localStorage.hasOwnProperty("accessToken") === true) {
            $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: $localStorage.accessToken, fields: "id,name,gender,location,website,picture,relationship_status,email", format: "json" }}).then(function(result) {
                $scope.profileData = result.data;
                var newUser = {
                	name: result.data.name,
                	email: result.data.email,
                	photo: result.data.picture.data.url
                }
                Users.save(newUser);
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
        } else {
            alert("Not signed in");
            $location.path("/login");
        }
    };
 
})

.controller("FeedController", function($scope, $http, $localStorage, $location) {
 
    $scope.init = function() {
        if($localStorage.hasOwnProperty("accessToken") === true) {
            $http.get("https://graph.facebook.com/v2.2/me/feed", { params: { access_token: $localStorage.accessToken, format: "json" }}).then(function(result) {
                $scope.feedData = result.data.data;
                $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: $localStorage.accessToken, fields: "picture", format: "json" }}).then(function(result) {
                    $scope.feedData.myPicture = result.data.picture.data.url;
                });
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
        } else {
            alert("Not signed in");
            $location.path("/login");
        }
    };
 
});
