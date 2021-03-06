/**
 * Copyright 2015 Autodesk Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * @ngdoc directive
 * @name wetLabAccelerator.directive:txCredTranscriptic
 * @description
 * # txCredTranscriptic
 *
 * usage: <tx-cred-transcriptic cred-valid="ctrl.model" ng-form="transcripticCred"></tx-cred-transcriptic>
 * !!! do not use 'form' instead of 'ng-form'
 *
 * and will expose to formController
 */
angular.module('wetLabAccelerator')
  .directive('txCredTranscriptic', function (TranscripticAuth, Communication, $q) {
    return {
      templateUrl     : 'views/tx-cred-transcriptic.html',
      restrict        : 'E',
      require         : 'form',
      scope           : {
        credValid: '=?' //outbinding for whether credentials are valid
      },
      bindToController: true,
      controllerAs    : 'authCtrl',
      controller      : function ($scope, $element, $attrs) {

        var self = this;

        self.credentials = {};

        self.validateAuth = function () {

          TranscripticAuth.batchUpdate(self.credentials);

          if (!self.allowAuthSaved) {
            return $q.reject(false);
          }

          self.validating = true;
          return Communication.validate()
            .then(function validateSuccess () {
              console.debug('credentials valid');
              self.credValid = true;
            }, function validateFailure () {
              console.debug('credentials invalid');
              self.credValid = false;
            }).
            then(function () {
              self.validating = false;
              return self.credValid;
            });
        };

        TranscripticAuth.watch(function (creds) {
          _.assign(self.credentials, {
            organization: _.result(creds, 'organization'),
            email       : _.result(creds, 'email'),
            key         : _.result(creds, 'key')
          });
          //will check automatically via $watch below()
        });

        self.forgetCreds = function () {
          TranscripticAuth.forgetCreds();
        };

      },
      link            : function (scope, element, attrs, formCtrl) {

        scope.$watch('authCtrl.credentials', function (newcreds) {
          if (scope.authCtrl.allowAuthSaved) {
            validateNewCreds()
              .then(function (isValid) {
                if (isValid) {
                  TranscripticAuth.persistCreds();
                }
              });
          }
        }, true);

        function validateNewCreds () {
          return scope.authCtrl.validateAuth()
            .then(function (isValid) {
              //todo - not working - maybe need to add a control to the form?
              formCtrl.$setValidity('transcriptic', isValid);
              return isValid;
            });
        }
      }
    };
  });
