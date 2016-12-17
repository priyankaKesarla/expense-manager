budgetControllers.controller('AccountListCtrl', ['$scope', '$http',
	function AccountListCtrl($scope, $http) {
		$scope.accounts = [];

	    $http.get('http://localhost:4000/accounts').success(function(data) {
	    	$scope.accounts = data;
	    });


	    $scope.addAccount = function(account) {
	    	if (account === undefined || account.name == null || account.currency == null) {
	    		return ;
	    	}
	    	//Create the new account with form input values
	    	var a 		= new Object();
	    	a.name 		= account.name;
	    	a.currency 	= account.currency;

	    	//Save Account
	    	$http.post('http://localhost:4000/accounts', a, {withCredentials: true}).success(function(data) {
		    	$scope.accounts.push(data);
		    });
	    };

	    $scope.deleteAccount = function(accountId) {
	    	$http.delete('http://localhost:4000/accounts/' + accountId, {withCredentials: true}).success(function(data) {
	    		var accounts = $scope.accounts;
		    	for (var accountKey in accounts) {
		    		if (accounts[accountKey]._id == accountId) {
		    			$scope.accounts.splice(accountKey, 1);
		    			return ;
		    		}
	    		}
		    });
	    };

	}]);
 
budgetControllers.controller('AccountDetailCtrl', ['$scope', '$routeParams', '$http', '$location',
	function AccountDetailCtrl($scope, $routeParams, $http, $location) {
		$scope.categories 	= [];
		$scope.account 		= {};
		var account_id		= $routeParams.accountId;

		$http.get('http://localhost:4000/accounts/' + account_id, {withCredentials: true}).success(function(data) {
			$scope.account = data;
			updateChart();
		}).error(function(data, status) {
			$location.path("/accounts");
		});

		$http.get('http://localhost:4000/categories', {withCredentials: true}).success(function(data) {
	    	$scope.categories = data;
	    })

	    $scope.addRecord = function(record) {
	    	if (record === undefined) {
	    		return ;
	    	}

	    	var amount = Number(record.amount);
	    	if (isNaN(amount) || amount <= 0) {
	    		return ;
	    	}

	    	//Create the new record with form input values
	    	var r 			= new Object();
	    	r.category 		= record.category;
	    	r.description 	= record.description;
	    	r.date 			= new Date().getTime();
	    	r.amount 		= amount;
	    	r.is_expense 	= record.type == 0 ? true : false;
	    	r.account_id	= account_id;


	    	//Save Record
	    	$http.post('http://localhost:4000/accounts/' + account_id + '/records', r, {withCredentials: true}).success(function(data) {
	    		if (data.is_expense) {
	    			$scope.account.balance -= data.amount;
	    		}
	    		else {
	    			$scope.account.balance += data.amount;
	    		}

		    	$scope.account.records.push(data)
		    	updateChart();
		    });
	    };

	    $scope.deleteRecord = function(record) {
	    	$http.delete('http://localhost:4000/accounts/' + account_id + '/records/' + record._id, {withCredentials: true}).success(function(data) {
		    	var records = $scope.account.records;
		    	for (var recordKey in records) {
		    		if (records[recordKey]._id == record._id) {
		    			if (records[recordKey].is_expense) {
			    			$scope.account.balance += records[recordKey].amount;
			    		}
			    		else {
			    			$scope.account.balance -= records[recordKey].amount;
			    		}
			    		
		    			$scope.account.records.splice(recordKey, 1);
		    			updateChart();
		    		}
		    	}
		    });
	    };

	    function updateChart() {
	    	var records = $scope.account.records;
	    	var totalExpense = 0;
	    	var totalIncome = 0;
            var catgExpense=[];
            var pieData=[];
            function rndColor() {
    var hex = ['0', '1', '2', '3', '4', '5', '6', '7',
               '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
        color = '#', i;
    for (i = 0; i < 6 ; i++) {
        color = color + hex[Math.floor(Math.random() * 16)];
    }
    return color;
};
           $scope.categories.forEach(function(val)
                                    {
               catgExpense.push({'category':val.name,'totalAmount':0});
           });
            
               
            catgExpense.forEach(function(val)
                               {
                for(var recordKey in records)
                    {
                       if(records[recordKey].category==val.category)
                           {
                              
                               val.totalAmount+=records[recordKey].amount;
                           }
                    }
                 
            });
            catgExpense.forEach(function(val)
                               {
                pieData.push({'value':val.totalAmount,'color':rndColor()})
                
            });
             
	    	new Chart(document.getElementById("canvas").getContext("2d")).Pie(pieData);
	    };
	}]);
