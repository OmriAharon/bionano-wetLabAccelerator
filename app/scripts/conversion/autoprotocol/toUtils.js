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

var _                     = require('lodash'),
    omniprotocol          = global.omniprotocol,
    toConverters          = require('./toConverters.js'),
    instructionConverters = toConverters.instructions;

var pipetteInstructions = ['transfer', 'mix', 'distribute', 'consolidate'];

/******************
 References
 ******************/

function convertReference (ref, name) {
  return {
    name : name,
    type : 'container',
    value: {
      isNew  : ref.new,
      id     : ref.id,
      type   : ref.new,
      storage: _.isUndefined(ref.store) ? false : ref.store.where
    }
  };
}

function convertReferences (refs) {
  return _.map(refs, convertReference);
}

/******************
 Instructions
 ******************/

//pipette return an array, so flatten later
function convertInstruction (inst) {

  var opName = _.result(inst, 'op');

  if (!opName) {
    throw new Error('instruction missing field op', inst);
  }

  //handle pipette instructions, which are nested as in pipette under field group
  if (opName == 'pipette') {

    //todo - check for sequential of same, fold into one tip if possible

    return _.map(inst.groups, function (group, opName) {
      return convertInstruction(_.assign({op: opName}, group));
    });
  }

  var converter = instructionConverters[opName];

  if (!_.isFunction(converter)) {
    throw new Error('converter invalid for ' + opName, inst)
  }

  return converter(inst);
}

function convertInstructions (instructions) {
  return _.flatten(_.map(instructions, convertInstruction));
}

// given a container ( only possible when new ?? ) reformat numbers to alphanumerics... may have to do this at runtime
// if using a variable?
function convertWellsToAlphanums (omni) {
  return omni;
}

//future - attempt to find loops in the instructions, and fold them up
function foldInstructionLoops (omni) {
  return omni;
}

module.exports = {
  convertReference       : convertReference,
  convertReferences      : convertReferences,
  convertInstruction     : convertInstruction,
  convertInstructions    : convertInstructions,
  convertWellsToAlphanums: convertWellsToAlphanums
};