budgetControllers.controller('CategoryCtrl', ['$scope', '$http',
	function CategoryCtrl($scope, $http) {

		$http.get('http://localhost:4000/categories', {withCredentials: true}).success(function(data) {
	    	$scope.categories = data;
	    });

	    $scope.addCategory = function(category) {
	    	if (category === undefined || category.name == null) {
	    		return ;
	    	}

	    	//Create the new category with form input values
	    	var c = new Object();
	    	c.name = category.name;

	    	//Save Category
	    	$http.post('http://localhost:4000/categories', c, {withCredentials: true}).success(function(data) {
		    	$scope.categories.push(data);
		    });
	    };

	    $scope.deleteCategory = function(categoryId) {
	    	$http.delete('http://localhost:4000/categories/' + categoryId, {withCredentials: true}).success(function(data) {
	    		var categories = $scope.categories;
		    	for (var categoryKey in categories) {
		    		if (categories[categoryKey]._id == categoryId) {
		    			$scope.categories.splice(categoryKey, 1);
		    			return ;
		    		}
	    		}
		    });
	    };
	}
]);