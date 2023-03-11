app.controller('PluginListController', PluginListController);

function PluginListController($scope, rconService, $interval) {

	$scope.Output = [];
	$scope.OrderBy = 'PluginName';

	$scope.Refresh = function () {
		rconService.getPlugins($scope, function (plugins) {
			$scope.plugins = plugins;
		})
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

	$scope.Reload = function (id) {
		rconService.Command('oxide.reload ' + id);
	}

	$scope.Unload = function (id) {
		rconService.Command('oxide.unload ' + id);
		$scope.Refresh();
	}

	$scope.Load = function (id) {
		rconService.Command('oxide.load ' + id);
		$scope.Refresh();
	}


	rconService.InstallService($scope, $scope.Refresh)

	// var timer = $interval( function ()
	// {
	// 	//$scope.Refresh();
	// }.bind( this ), 1000 );

	//$scope.$on( '$destroy', function () { $interval.cancel( timer ) } )
}