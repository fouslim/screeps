/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.transit');
 * mod.thing == 'a thing'; // true
 */
 
var roleTransit = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var container = Game.getObjectById(creep.memory.container);
        
        if (_.sum(creep.carry) == 0) {
            if (creep.withdraw(container, RESOURCE_ENERGY)  == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
        } else {
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
                var depots = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) && (structure.energy < structure.energyCapacity));
                }});
                if (depots == undefined) {
                    console.log(creep.name);
                    depots = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_STORAGE) && 
                            _.sum(structure.store) < structure.storeCapacity)}});
                }
                depot = depots;
            }
            if (creep.transfer(depot, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(depot, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.memory.depot = depot.id;
            }
        }
    }
}
module.exports = roleTransit;