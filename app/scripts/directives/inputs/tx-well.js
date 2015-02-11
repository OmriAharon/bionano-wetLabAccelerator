'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txWell
 * @description
 * Directive for specifying a well, and potentially a container
 *
 * - 4 scenarios supported -
 * no container, one well
 * no container, multiple wells
 * specify container, one well
 * specify container, multiple wells -- get array in form [ {well : "<container>/<well>" }]
 *
 * In the final scenario, can also pass multipleZip attr wtih values to include in the object
 *
 * if need to specify container, must pass specifyContainer and refs
 *
 */
//fixme-  for the love of god refactor this
//todo - validation (and therefore passage of container)
//todo - alphanumeric <--> numeric conversion - handle alpha insensitive
//todo - refactor to better accomodate specification of columns rather than rows
angular.module('transcripticApp')
  .directive('txWell', function (ContainerOptions, Container) {

    //todo - DRY OUT using WellConv service

    var containerWellJoiner = '/';

    function joinContainerWell(container, well) {
      return container + containerWellJoiner + well;
    }

    function splitContainerWell(str) {
      return str.split(containerWellJoiner);
    }

    function colRowToAlphanumeric (row, col) {
      var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      return letters[row] + '' + col;
    }

    function numericToAlphanumeric (number, container) {

    }

    //returns promise
    //todo - should ideally get from list()
    function getContainerFromID (id) {
      return Container.view({id: id});
    }

    //todo - convert numeric to alphanumeric on initial parse
    function parseContainerWell (str) {
      //i.e. scope.multiple
      if (angular.isArray(str)) {
        return {
          wells: str
        }
      }
      //i.e. !scope.multiple
      else if (angular.isString(str)) {
        var split = splitContainerWell(str);

        if (split.length == 2) {
          return {
            container : split[0],
            wells : [split[1]]
          }
        } else {
          return {
            wells : [split[0]]
          }
        }
      }
      //undefined, or something weird
      else {
        return {}
      }
    }

    function parseContainerWellObjects (input, otherFields, forceKey, includeContainer) {

      if (_.isEmpty(input)) { return {}; }

      var wells = [],
          container,
          otherKeys = Object.keys(otherFields),
          otherValues = {};

      //todo - better error handling - checks to make sure all same container + otherFields
      angular.forEach(input, function (wellObj, index) {
        var wellval = wellObj[forceKey],
            wellnum;

        if (includeContainer) {
          var split = splitContainerWell(wellval);
          wellnum = split[1];

          if (index == 0) {
            // only set container once
            // (assuming same throughout - may want to check)
            container = split[0];
          }
        } else {
          wellnum = wellval;
        }

        // fold in values for first index
        // (assumes same throughout, may want to check for them)
        if (index == 0) {
          otherKeys.forEach(function (key) {
            if (wellObj[key]) {
              otherValues[key] = wellObj[key]
            }
          });
        }

        wells.push(wellnum);
      });

      return {
        internal : {
          wells: wells,
          container: container
        },
        meta: otherValues
      }
    }

    function multipleWellsToObjects (container, wells, alsoZip, forceKey, includeContainer) {
      return _.map(wells, function (well) {
        var obj = _.extend({}, alsoZip);
        obj[forceKey] = includeContainer ? joinContainerWell(container, well) : well;
        return obj;
      });
    }

    return {
      templateUrl: 'views/tx-well.html',
      restrict: 'E',
      require: 'ngModel',
      scope: {
        //todo-hndle columns not converting to alphanums
        externalModel: '=ngModel',
        refs: '=', //protocol references
        label: '@', //text label override
        multiple: '@', //allow multiple well selection
        specifyContainer: '@', // UI for specify container, include in model (e.g. container/well)
        container: '=', //if not specifying, pass in ref
        multipleZip: '=' //if multiple and specifyContainer, other fields to include in array. MUST BE ASSIGNABLE (i.e. single object),
        //multipleParseKey - is defined, but not as scope
      },
      link: function postLink(scope, element, attrs, ngModel) {

        //set up inheritance
        scope.internal = {wells: [], container: ''};

        var forceKey = angular.isDefined(attrs.multipleParseKey) ? attrs.multipleParseKey : 'well';

        scope.$watch(function () {
          return scope.specifyContainer ? scope.internal.container : scope.container;
        }, function (newval) {
          if (!newval || !angular.isString(newval)) return;

          var ref;
          if (!_.isEmpty(scope.refs) && scope.refs[newval]) {
            ref = scope.refs[newval];
            if (ref.new) {
              scope.containerReference = ContainerOptions[ref.new];
            } else {
              scope.containerReference = getContainerFromID(ref.id);
            }
          }
        });

        //deep watch, propagate up changes
        scope.$watch('internal', function (newval) {
          if (_.isEmpty(newval) || angular.isUndefined(newval.wells) || newval.wells.length == 0) return;

          //set as an array
          if (scope.multiple) {
            if (scope.specifyContainer || scope.multipleZip) {
              if (scope.specifyContainer && angular.isUndefined(newval.container)) return;
              ngModel.$setViewValue(multipleWellsToObjects(newval.container, newval.wells, scope.multipleZip, forceKey, scope.specifyContainer));
            } else {
              ngModel.$setViewValue(newval.wells);
            }
          }
          //set as a string, with container if appropriate
          else {
            var singleWell = newval.wells[0];
            if (scope.specifyContainer) {
              if (angular.isUndefined(newval.container)) return;
              ngModel.$setViewValue(joinContainerWell(newval.container, singleWell));
            } else {
              ngModel.$setViewValue(singleWell);
            }
          }
        }, true);

        scope.$watch('externalModel', function (newval) {
          if (_.isEmpty(newval)) return;

          if (!!scope.multipleZip) {
            var parsed = parseContainerWellObjects(newval, scope.multipleZip, forceKey, scope.specifyContainer);

            console.log(scope.specifyContainer, parsed.internal, parsed.meta);

            scope.internal = parsed.internal;
            angular.extend(scope.multipleZip, parsed.meta);
          } else {
            scope.internal = parseContainerWell(newval);
          }
        });

        scope.$watch('multipleZip', function (newval) {
          if (!newval) return;
          if (_.isEmpty(scope.internal) || !scope.internal.wells) return;

          ngModel.$setViewValue(multipleWellsToObjects(scope.internal.container, scope.internal.wells, newval, forceKey, scope.specifyContainer));
        }, true);

        scope.$on('protocol:refKeyChange', function (event, oldkey, newkey) {
          if (scope.specifyContainer && scope.internal.container == oldkey) {
            scope.internal.container = newkey;
          }
        });
      }
    }
  });
