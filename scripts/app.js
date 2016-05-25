var giphy = angular.module('GiphyApp', ['infinite-scroll']);

giphy.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
  var search;
  $scope.searchTerm = '';
  $scope.offset = 0;
  $scope.gifs = [];
  $scope.searchHistory = [];

  if (!$scope.searchHistory.length && localStorage.getItem('searchHistory')) {
    $scope.searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
  }

  $scope.search = function() {
    $scope.gifs = [];
    if (/\s/.test($scope.searchTerm)) {
      search = $scope.searchTerm.split(' ').join('+');
    } else {
      search = $scope.searchTerm;
    }

    var api_url = 'http://api.giphy.com/v1/gifs/search?q=';
    var key = '&api_key=dc6zaTOxFJmzC';
    var req = {
                url:  api_url + search + key,
                method: 'GET'
              };

    if ($scope.searchHistory.indexOf($scope.searchTerm) === -1) {
      $scope.searchHistory.push($scope.searchTerm);
      localStorage.setItem('searchHistory', JSON.stringify($scope.searchHistory));
      $scope.searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    }
    $scope.searchTerm = '';
    $scope.wrapper = 'wrapper';
    $scope.offset = 0;
    $http(req).then(function sucess(res){
      var results = res.data;
      $scope.gifs = results.data;
      console.log($scope.gifs);
      $scope.offset = results.pagination.offset;


    }, function error(res){
      console.log(res);
    })

  };

  $scope.moreGifs = function() {
    if ($scope.gifs[0]) {
      $scope.offset++
      var api_url = 'http://api.giphy.com/v1/gifs/search?q=';
      var key = '&api_key=dc6zaTOxFJmzC';
      var offset = '&offset=' + $scope.offset;
      var req = {
                  url:  api_url + search + offset + key,
                  method: 'GET'
                }
      console.log(req);
      $http(req).then(function sucess(res){
        var results = res.data.data;
        $scope.gifs = $scope.gifs.concat(results)
        // for (var i = 0; i < results.length; i++) {
        //   $scope.gifs.push(results[i]);
        // }
        console.log(res);
        console.log($scope.gifs);
      }, function error(res){
        console.log(res);
      })
    }
  }

  $scope.historySearch = function(idx) {
    $scope.gifs = [];
    if (/\s/.test($scope.searchHistory[idx])) {
      search = $scope.searchHistory[idx].split(' ').join('+');
    } else {
      search = $scope.searchHistory[idx];
    }

    var api_url = 'http://api.giphy.com/v1/gifs/search?q=';
    var key = '&api_key=dc6zaTOxFJmzC';
    var req = {
                url:  api_url + search + key,
                method: 'GET'
              };
    $http(req).then(function sucess(res){
      var results = res.data;
      $scope.gifs = results.data;
      $scope.offset = results.pagination.offset;
    }, function error(res){
      console.log(res);
    })
  }

  $scope.delete = function(idx) {
    $scope.searchHistory.splice(idx, 1);
  }

}]);
