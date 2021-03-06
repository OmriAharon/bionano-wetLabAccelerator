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

module.exports = {
  "384-flat" : {
    name          : "384-well UV flat-bottom plate",
    well_count    : 384,
    well_type     : null,
    well_depth_mm : null,
    well_volume_ul: 112.0,
    well_coating  : null,
    sterile       : false,
    is_tube       : false,
    capabilities  : ["spin", "incubate", "absorbance", "fluorescence", "luminescence"],
    shortname     : "384-flat",
    col_count     : 24,
    dead_volume   : 12
  },
  "384-pcr"  : {
    name          : "384-well PCR plate",
    well_count    : 384,
    well_type     : null,
    well_depth_mm : null,
    well_volume_ul: 50.0,
    well_coating  : null,
    sterile       : null,
    is_tube       : false,
    capabilities  : ["thermocycle", "spin", "incubate"],
    shortname     : "384-pcr",
    col_count     : 24,
    dead_volume   : 8
  },
  "96-flat"  : {
    name          : "96-well flat-bottom plate",
    well_count    : 96,
    well_type     : null,
    well_depth_mm : null,
    well_volume_ul: 360.0,
    well_coating  : null,
    sterile       : false,
    is_tube       : false,
    capabilities  : ["spin", "incubate", "absorbance", "fluorescence", "luminescence"],
    shortname     : "96-flat",
    col_count     : 12,
    dead_volume   : 20
  },
  "96-pcr"   : {
    name          : "96-well PCR plate",
    well_count    : 96,
    well_type     : null,
    well_depth_mm : null,
    well_volume_ul: 160.0,
    well_coating  : null,
    sterile       : null,
    is_tube       : false,
    capabilities  : ["thermocycle", "spin", "incubate"],
    shortname     : "96-pcr",
    col_count     : 12,
    dead_volume   : 15
  },
  //this is a hack - need to actually reserve this one
  "6-flat"   : {
    name       : "Pre-poured 6-well LB Agar plate",
    shortname  : "6-flat",
    well_count : 6,
    col_count  : 3,
    reservation: "ki17reefwqq3sq"
  },
  //this is a hack - need to actually reserve this one
  "6-flat-amp"   : {
    name       : "Pre-poured 6-well LB Agar plate - Amp 100ugml",
    shortname  : "6-flat-amp",
    well_count : 6,
    col_count  : 3,
    reservation: "ki17sbb845ssx9"
  },
  "96-deep"  : {
    name          : "96-well extended capacity plate",
    well_count    : 96,
    well_type     : null,
    well_depth_mm : null,
    well_volume_ul: 2000.0,
    well_coating  : null,
    sterile       : false,
    capabilities  : ["incubate"],
    shortname     : "96-deep",
    is_tube       : false,
    col_count     : 12,
    dead_volume   : 15
  },
  "micro-2.0": {
    name          : "2mL Microcentrifuge tube",
    well_count    : 1,
    well_type     : null,
    well_depth_mm : null,
    well_volume_ul: 2000.0,
    well_coating  : null,
    sterile       : false,
    capabilities  : ["spin", "incubate"],
    shortname     : "micro-2.0",
    is_tube       : true,
    col_count     : 1,
    dead_volume   : 15
  },
  "micro-1.5": {
    name          : "1.5mL Microcentrifuge tube",
    well_count    : 1,
    well_type     : null,
    well_depth_mm : null,
    well_volume_ul: 1500.0,
    well_coating  : null,
    sterile       : false,
    capabilities  : ["spin", "incubate"],
    shortname     : "micro-1.5",
    is_tube       : true,
    col_count     : 1,
    dead_volume   : 1
  },
  "1-flat"   : {
    name          : "1-well flat-bottom plate",
    well_count    : 1,
    well_depth_mm : null,
    well_volume_ul: 80000.0,
    well_coating  : null,
    sterile       : false,
    capabilities  : [],
    shortname     : "1-flat",
    is_tube       : false,
    col_count     : 1,
    dead_volume_ul: 36000
  }
};
