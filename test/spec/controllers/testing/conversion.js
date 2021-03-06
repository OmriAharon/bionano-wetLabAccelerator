'use strict';

describe('Controller: TestingConversionCtrl', function () {

  // load the controller's module
  beforeEach(module('wetLabAccelerator'));

  var TestingConversionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TestingConversionCtrl = $controller('TestingConversionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
