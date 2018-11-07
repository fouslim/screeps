// to do: create builder as function of construction sites
// to do: upgrade parts of harvesters as function of energy available
// to do: long-range defence

var roleHarvester = require('role.harvest');
var roleTransit = require('role.transit');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roomPosition = require('room.position');

module.exports.loop = function () {
    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }
     
    // have n harvesters for every source, where n is the number of tile free adjacent to the source
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var roomName = Object.keys(Game.rooms)[0];
    var sources = Game.rooms[roomName].find(FIND_SOURCES_ACTIVE);
    var pos;
    for (var sourceIndex in sources) {
        // console.log("source id:" + sources[sourceIndex].id);
        pos = sources[sourceIndex].pos;
        var nbHarvesters = roomPosition.adjFree(pos);
        // console.log("number of harvesters:" + nbHarvesters);
        // identify harvester targetting source
        for (var creepIndex in harvesters) {
            if (sources[sourceIndex].id == harvesters[creepIndex].memory.source) {
                nbHarvesters = nbHarvesters - 1;
             }
        }
        // console.log("number of harvesters to create:" + nbHarvesters);
        if (nbHarvesters > 0) {
            var newName = 'Harvester' + Game.time;
            var flag = Game.spawns['Spawn1'].spawnCreep([WORK,WORK,MOVE], newName,
                {memory: {role: 'harvester',
                    source: sources[sourceIndex].id,
                    working: true
                }});
            if (!(flag < 0)) {
                console.log('Spawning new harvester: ' + newName);
            }
        }
    }
    
    // have n transit creep for every container, where n is the number of container
    var transits = _.filter(Game.creeps, (creep) => creep.memory.role == 'transit');
    var containers = Game.rooms[roomName].find(FIND_STRUCTURES,
        {filter: (structure) => structure.structureType == STRUCTURE_CONTAINER});
    for (var containerIndex in containers) {
        var buildTransit = true;
        for (var creepIndex in transits) {
            if ((containers[containerIndex].id == transits[creepIndex].memory.container) &&
                buildTransit == true) {
                 buildTransit = false;
             }
        }
        if (buildTransit == true) {
            var newName = 'Transit' + Game.time;
            var flag = Game.spawns['Spawn1'].spawnCreep([MOVE,CARRY,CARRY], newName,
                {memory: {role: 'transit',
                    container: containers[containerIndex].id
                }});
            if (!(flag < 0)) {
                console.log('Spawning new transit: ' + newName);
            }
        }
    }

   for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'transit') {
            roleTransit.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
    
    var constructionSites = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES);
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
 
      if(upgraders.length < constructionSites.length) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'upgrader'}});
    }

    if(builders.length < 2) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'builder'}});
    }
    
    if(repairers.length < 2) {
        var newName = 'Repairer' + Game.time;
        console.log('Spawning new repairer: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'repairer'}});
    }
    
    var towers = _.filter(Game.rooms[roomName].find(FIND_STRUCTURES), (structure) => structure.structureType == STRUCTURE_TOWER);
    // console.log(towers.length);
    for (var towerIndex in towers) {
        var tower = towers[towerIndex];
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
        
        if (tower.energy == tower.energyCapacity) {
           //console.log(tower.energy);
            var targets = tower.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL
            });
            targets.sort((a,b) => a.hits - b.hits);
            if(targets.length > 0) {
               tower.repair(targets[0]);
            }
        }
    }
 }