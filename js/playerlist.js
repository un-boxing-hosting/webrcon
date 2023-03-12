app.controller('PlayerListController', PlayerListController);

function PlayerListController($scope, rconService, $interval) {
	$scope.Output = [];
	$scope.OrderBy = '-ConnectedSeconds';

	$scope.Refresh = function () {
		rconService.getPlayers($scope, function (players) {
			$scope.Players = players;
		});
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

	$scope.KickPlayer = function (id) {
		rconService.Command('kick ' + id);

		$scope.Refresh();
	}
	$scope.BanPlayer = function (id, time, reason) {
		// prompt for time and reason

		
		rconService.Command('ban ' + id + ' ' + time + ' ' + reason);
		console.log( 'ban ' + id + ' ' + time + ' ' + reason );
		$scope.Refresh();
	}

	rconService.InstallService($scope, $scope.Refresh)

	// var timer = $interval( function ()
	// {
	// 	//$scope.Refresh();
	// }.bind( this ), 1000 );

	//$scope.$on( '$destroy', function () { $interval.cancel( timer ) } )
}