app.controller('PluginListController', PluginListController);

function PluginListController($scope, rconService, $interval) {

	$scope.Output = [];
	//$scope.OrderBy = '-ConnectedSeconds';

	$scope.Refresh = function () {
		$scope.weather = ["rain","clouds","fog","wind"];
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