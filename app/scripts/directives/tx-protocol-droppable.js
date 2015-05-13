'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolDroppable
 * @description
 * # txProtocolDroppable
 */
angular.module('transcripticApp')
  .directive('txProtocolDroppable', function ($parse, DragDropManager) {
    return {
      restrict: 'A',
      link    : function postLink (scope, element, attrs) {

        //note that many places in editor expect these defaults
        var dropDefaults = {
              greedy    : true,
              tolerance : 'pointer',
              hoverClass: 'drop-hover'
            },
            parsedRaw    = $parse(attrs['txProtocolDroppable'])(scope),
            parsed       = _.isObject(parsedRaw) ? parsedRaw : {},
            merged       = _.assign(dropDefaults, parsed);

        element.droppable(merged);
      }
    };
  });
