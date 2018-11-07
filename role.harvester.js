/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.working == false && creep.carry.energy == 0) {
            creep.memory.working = true;
        }
        if (creep.memory.working == true && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = false;
        }
        
        if (creep.memory.working == true) {
            var source = Game.getObjectById(creep.memory.source);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else if (creep.memory.working == false) {
            var depot = Game.getObjectById(creep.memory.depot);
            var search = (depot == undefined);
            if (search == false) {
                search = (depot.energy == depot.energyCapacity);
                if (search == undefined) {
                    search = (_.sum(depot.store) == depot.storeCapacity);
                }
            }
            // console.log(creep.name + " " + search);
            if (search == true) {
                var depots = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity));
                }});
                if (depots.length == 0) {
                    console.log(creep.name);
                    depots = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_CONTAINER || 
                            structure.structureType == STRUCTURE_STORAGE) && 
                            _.sum(structure.store) < structure.storeCapacity)}});
                }
                depot = depots[0];
            }
            if (creep.transfer(depot, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(depot, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.memory.depot = depot.id;
            }
        }
        /*
        // if on the verge of dying
        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER)}});
        var path = creep.pos.findPathTo(container);
        if ((creep.ticksToLive/2) < path.length) {
            console.log(creep.name + " " + creep.ticksToLive + " " + path.length);
            creep.moveTo(container.pos);
            creep.memory.harvesting = "dying";
            creep.say("dying");
        }
        */
    }
    
};

module.exports = roleHarvester;