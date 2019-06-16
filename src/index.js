<script> 
    var x = 5; 
    var y = 6; 
    var z = x + y; 
    document.getElementById("sampel").innerHTML = z; 
</script>

(function(){
    'use strict';

        angular.module('app', ["ngMaterial", "ngAnimate", "ngAria", "ngMessages", require('./resources/js/angular-chart')])
            .config(['$mdThemingProvider', '$locationProvider', function($mdThemingProvider, $locationProvider){
                /* SETTING TEMA */
                /* $mdThemingProvider.theme('default')
                    .primaryPalette('blue')
                    .accentPalette('pink');

                $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
                $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
                $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
                $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark(); */

                $mdThemingProvider.theme('altTheme')
                    .primaryPalette('grey',{'default': '900'})
                    .accentPalette('pink',{'default': '700'})
                    // .backgroundPalette('grey',{'default': '900'})
                    .dark();
                $mdThemingProvider.theme('default')
                    .primaryPalette('blue')
                    .accentPalette('pink');
                    
                $mdThemingProvider.setDefaultTheme('default');
                $mdThemingProvider.alwaysWatchTheme(true);

                /* SETTING URL YANG INGIN DI PAKE */
                $locationProvider.html5Mode(
                    { 
                        enabled: true, 
                        requireBase: false, 
                        rewriteLinks: false 
                    }
                );
            }])
            .config(['ChartJsProvider', function (ChartJsProvider) {
                // Configure all charts
                ChartJsProvider.setOptions({
                    chartColors: ['#2196F3', '#0D47A1'],
                    responsive: true,
                    maintainAspectRatio: false
                });
            }])
            .controller('app_control', ['$scope', '$location', '$timeout', '$mdToast', '$mdSidenav', '$rootScope', '$http', '$interval', '$mdDialog', '$window', function ($scope, $location, $timeout, $mdToast, $mdSidenav, $rootScope, $http, $interval, $mdDialog, $window) {
                const base_url = "https://arduino-arproject.herokuapp.com/public/";

                /* KONDISI TANGERANG */
                $scope.curentDataA = {
                    icon: 1,
                    temperature: 0,
                    humadity: 0,
                    lastUpdate: '-'
                };

                /* KONDISI RUMAH */
                $scope.curentDataB = {
                    icon: 1,
                    temperature: 0,
                    humadity: 0,
                    lastUpdate: '-'
                };

                /* STATISTIK CONFIG */
                $scope.statistik = {
                    config: {
                        tooltips: {
                            mode: 'point'
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        legend: {
                            labels: {
                                fontColor: 'red',
                            }
                        },
                        pointLabels: {
                            fontColor: 'white'
                        },
                        barValueSpacing: 1,
                        animation: false,
                        scales: {
                            yAxes: [{
                                gridLines: {
                                    // color: 'rgba(255, 255, 255, 0.9)'
                                }
                            }],
                            xAxes: [{
                                gridLines: {
                                    // color: 'rgba(255, 255, 255, 0.9)'
                                }
                            }]
                        }
                    },
                    series: [
                        
                    ],
                    labels: [

                    ],
                    data: [
                        
                    ]
                };

                $scope.init = function() {
                    getKondisi();
                    getStatistik();
                    $scope.dynamicTheme = "default";
                };

                $scope.isDark = false;
                $scope.themeChanger = function() {
                    if($scope.dynamicTheme=="default"){
                        $scope.dynamicTheme = "altTheme";
                        $scope.isDark = true;
                    }else{
                        $scope.dynamicTheme = "default";
                        $scope.isDark = false;
                    }
                };

                var temp_data = [];
                for (let index = 0; index <= 30; index++) {
                    let LABEL = "-";
                    $scope.statistik.labels.push(LABEL);
                    temp_data.push(0);
                };
                $scope.statistik.data.push(temp_data);

                function updateStatistikData(tanggal, nilai) {
                    $scope.statistik.data[0].shift();
                    $scope.statistik.labels.shift();
                    $scope.statistik.data[0].push(nilai);
                    $scope.statistik.labels.push(tanggal);
                    // chart.update();
                }

                // dataUpdate 
                $interval(function () {
                    getKondisi();
                }, 15000);
                $interval(function () {
                    getStatistik();
                }, 60000);

                function getKondisi() {
                    $http({method: 'GET', url: base_url + 'api/ambil/1'})
						.then(function(res){
                            console.log(res);
                            const T_TANGERANG = res.data.data.tangerang;
                            const T_RUMAH = res.data.data.rumah;
                            /* KONDISI TANGERANG */
                            $scope.curentDataA.icon = T_TANGERANG.icon;
                            $scope.curentDataA.temperature = T_TANGERANG.suhu_c;
                            $scope.curentDataA.humadity = T_TANGERANG.kelembaban;
                            $scope.curentDataA.lastUpdate = T_TANGERANG.last;

                            $scope.curentDataB.icon = T_RUMAH.icon;
                            $scope.curentDataB.temperature = T_RUMAH.suhu_c;
                            $scope.curentDataB.humadity = T_RUMAH.kelembaban;
                            $scope.curentDataB.lastUpdate = T_RUMAH.last;
                            
						})
						.catch(function(err){
							// console.log(err);
						});
                }

                function getStatistik() {
                    $http({method: 'GET', url: base_url + 'api/ambil/2'})
                        .then(function(res){
                            console.log(res);
                            const T_LABEL = res.data.data.label;
                            const T_DATASETS = res.data.data.datasets;
                            $scope.statistik.labels = T_LABEL;
                            $scope.statistik.data[0] = T_DATASETS;
                        })
                        .catch(function(err){
                            // console.log(err);
                        });
                }

                function getRandomInt(min, max) {
                    min = Math.ceil(min);
                    max = Math.floor(max);
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
            }]);


        angular.element(function() {
            angular.bootstrap(document, ['app']);
        });

        angular.element(document).ready(function () {
            //Angular breaks if this is done earlier than document ready.
            // setupSliderPlugin();
        });

})();