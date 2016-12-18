budgetControllers.controller('UserLoginCtrl', ['$scope', '$http', '$location', 'UserService',
	function UserLoginCtrl($scope, $http, $location, userSrv) {

		$scope.logIn = function(user) {
			$http.post("http://localhost:4000/login", user).success(function(data) {
	    		userSrv.isLogged = true;
				userSrv.user = data;
				
				$location.path("/accounts");
		    });
		};
	}
]);

budgetControllers.controller('UserRegisterCtrl', ['$scope', '$http', '$location', 'UserService',
	function UserRegisterCtrl($scope, $http, $location, userSrv) {
        $scope.category=['food','entertainment','accomodation'];

		$scope.register = function(user) {
            var params={
                userdetails:user,
                category:$scope.category
            };
			if (user.username != undefined && user.password != undefined) {
				$http.post("http://localhost:4000/register", params).success(function(data) {
					$location.path("/login");
			    });
			}
		};
	}
]);

budgetControllers.controller('UserLogoutCtrl', ['$scope', '$http', '$location', 'UserService',
	function UserLogoutCtrl($scope, $http, $location, userSrv) {

		$http.get("http://localhost:4000/logout", {withCredentials: true}).success(function(data) {
			userSrv.isLogged = false;
			userSrv.user = {};
			$location.path("/login");
	    });

	}
]);


