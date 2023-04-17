(function(){
'use strict'

    angular.module('lunchCheckApp', [])

    .controller( 'lunchCheckController', function($scope){
        $scope.message = "";
        $scope.dishes = "";
        $scope.checkToomuch = function() {
            if ($scope.dishes == "")
            {
                $scope.message = "Please enter the data";
            }
            else
            {
                var items = itemsInText($scope.dishes);

                if(items == 0 || $scope.dishes == "")
                {
                    $scope.message = "Empty";
                }
                else if ( items <= 3)
                {
                    $scope.message = "Enjoy";
                }
                else
                {
                    $scope.message = "Too much";
                }
            }
        };

        function itemsInText(string){
            var arrayofstring = string.split(",");
            console.log(arrayofstring);
            return arrayofstring.length;
        }


    } );

})();