budgetControllers.controller('AccountDetailCtrl', ['$scope', '$routeParams', '$http', '$location',
	function AccountDetailCtrl($scope, $routeParams, $http, $location) {
		$scope.categories 	= [];
        $scope.records 	= [];

		$http.get('http://localhost:4000/records', {withCredentials: true}).success(function(data) {
			$scope.records = data;
             updateChart();
           
		}).error(function(data, status) {
			$location.path("/records");
		})
        
		$http.get('http://localhost:4000/categories', {withCredentials: true}).success(function(data) {
	    	$scope.categories = data;
              updateChart();
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


	    	//Save Record
	    	$http.post('http://localhost:4000/records', r, {withCredentials: true}).success(function(data) {
		    	$scope.records.push(data)
		    	updateChart();
		    });
	    };

	    $scope.deleteRecord = function(record) {
	    	$http.delete('http://localhost:4000/records/' + record._id, {withCredentials: true}).success(function(data) {
		    	var records = $scope.records;
		    	for (var recordKey in records) {
		    		if (records[recordKey]._id == record._id) {
		    			$scope.records.splice(recordKey, 1);
		    			updateChart();
		    		}
		    	}
		    });
	    };

	    function updateChart() {
	    	var records = $scope.records;
            var catgExpense=[];
            var pieData=[];
             $scope.colors=[];
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
               for(var recordKey in records)
                    {
                       if(records[recordKey].category==val.name)
                           {
               catgExpense.push({'category':val.name,'totalAmount':0});
                           } }});
            
               
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
                var cl=rndColor();
                $scope.colors.push({'color':cl,'category':val.category});
                pieData.push({'label':val.category, 'value':val.totalAmount,'color':cl})
                
            });
             
	    	new Chart(document.getElementById("canvas").getContext("2d")).Pie(pieData);
	    };
	}]);
