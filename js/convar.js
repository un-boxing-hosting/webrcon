app.controller('ConvarListController', ConvarListController);

function ConvarListController($scope, rconService, $interval) {

	$scope.Output = [];
	//$scope.OrderBy = '-ConnectedSeconds';

	$scope.Refresh = function () {
		$scope.weather = ["rain","clouds","wind","fog","radiation"];
	}

	$scope.On = function (id) {
		if (id == "rain") {
			rconService.Command("weather."+id+" 100");
			}
		if (id == "clouds") {
			rconService.Command("weather.cloud_coverage 100");
		}
		if (id == "wind") {
			rconService.Command("weather.wind 100");
		}
		if (id == "radiation") {
			rconService.Command("server.radiation true");
		}
		if (id == "fog") {
			rconService.Command("weather.fog 1");
		}
	}
	$scope.Off = function (id) {
		if (id == "rain") {
		rconService.Command("weather."+id+" 0");
		}
		if (id == "clouds") {
		rconService.Command("weather.cloud_coverage 0");
		}
		if (id == "wind") {
		rconService.Command("weather.wind 0");
		}
		if (id == "radiation") {
			rconService.Command("server.radiation false");
		}
		if (id == "fog") {
			rconService.Command("weather.fog 0");
		}
	}

	$scope.Order = function (field) {
		if ($scope.OrderBy === field) {
			field = '-' + field;
		}

		$scope.OrderBy = field;
	}

	$scope.SortClass = function (field) {
		if ($scope.OrderBy === field) return "sorting";
		if ($scope.OrderBy === "-" + field) return "sorting descending";

		return null;
	}

	rconService.InstallService($scope, $scope.Refresh)

	// var timer = $interval( function ()
	// {
	// 	//$scope.Refresh();
	// }.bind( this ), 1000 );

	//$scope.$on( '$destroy', function () { $interval.cancel( timer ) } )
}