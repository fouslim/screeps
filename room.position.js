/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.position');
 * mod.thing == 'a thing'; // true
 */

var roomPosition = {
    adjFree: function(pos) {
        var roomName = pos.roomName;
        var freePos = 0;
        if (new Room.Terrain(roomName).get(pos.x - 1, pos.y - 1) != TERRAIN_MASK_WALL) {
            freePos = freePos + 1;
        }
        if (new Room.Terrain(roomName).get(pos.x - 1, pos.y) != TERRAIN_MASK_WALL) {
            freePos = freePos + 1;
        }
        if (new Room.Terrain(roomName).get(pos.x - 1, pos.y + 1) != TERRAIN_MASK_WALL) {
            freePos = freePos + 1;
        }
        if (new Room.Terrain(roomName).get(pos.x, pos.y - 1) != TERRAIN_MASK_WALL) {
            freePos = freePos + 1;
        }
        if (new Room.Terrain(roomName).get(pos.x, pos.y + 1) != TERRAIN_MASK_WALL) {
            freePos = freePos + 1;
        }
        if (new Room.Terrain(roomName).get(pos.x + 1, pos.y - 1) != TERRAIN_MASK_WALL) {
            freePos = freePos + 1;
        }
        if (new Room.Terrain(roomName).get(pos.x + 1, pos.y) != TERRAIN_MASK_WALL) {
            freePos = freePos + 1;
        }
        if (new Room.Terrain(roomName).get(pos.x + 1, pos.y + 1) != TERRAIN_MASK_WALL) {
            freePos = freePos + 1;
        }
        return freePos;
    }
};

module.exports = roomPosition;