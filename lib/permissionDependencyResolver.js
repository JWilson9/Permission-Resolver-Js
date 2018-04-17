var tsort = require('tsort') // HINT!!! This is a useful package for one of the methods

function PermissionDependencyResolver (dependencies) {

}

PermissionDependencyResolver.prototype.canGrant = function(existing, permToBeGranted) {

}

PermissionDependencyResolver.prototype.canDeny = function(existing, permToBeDenied) {

}

PermissionDependencyResolver.prototype.sort = function(permissions) {

}

// you'll need to throw this in canGrant and canDeny when the existing permissions are invalid
function InvalidBasePermissionsError() {
  this.name = 'InvalidBasePermissionsError'
  this.message = "Invalid Base Permissions"
  this.stack = Error().stack;
}
InvalidBasePermissionsError.prototype = new Error()

module.exports = PermissionDependencyResolver
