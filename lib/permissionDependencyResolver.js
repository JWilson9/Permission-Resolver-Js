var tsort = require('tsort') // HINT!!! This is a useful package for one of the methods
// DEFINE GLOBAL VARIABLES
var viewDependency;
var editDependency;
var deleteDependency;
var createDependency;
var alterTagDependency;

class PermissionResolver {
  constructor(permissions = NULL) {
        this.permissions = permissions;
        // console.log('tesing');
        // console.log(Object.keys(permissionArray));
    }
    set permissions(value) {
        this._permissions = value;
    }
    get permissions() {
      return this._permissions;
    }
    checkDependency(dependency) {
      console.log(this._permissions);
    }


}

function PermissionDependencyResolver (dependencies) {


    // get dependencies
    let james = new PermissionResolver(dependencies);
    // console.log(james.hello());
    // console.log(james);
    //
    // console.log(dependencies);
    // console.log(Object.keys(dependencies));



    // Object.keys(dependencies).forEach(function (key) {
    //    // console.log(dependencies[key]);
    // });
    // Object.keys(dependencies).map(console.log(a.edit));
    //
    // var result = dependencies.map({ value: edit, text: view });
    // console.log(result);
    // Object.keys(dependencies).forEach(function(key,index) {
    //   switch (key) {
    //       case 'view':
    //           viewDependency = index;
    //           console.log(viewDependency)
    //   }
    viewDependency = Object.entries(dependencies)[0];
    editDependency = Object.entries(dependencies)[1];
    createDependency = Object.entries(dependencies)[3];
    deleteDependency = Object.entries(dependencies)[4];
    // console.log(Object.entries(dependencies)[2]);
    alterTagDependency = Object.entries(dependencies)[2];
    objVal = Object.values(alterTagDependency);



    // editDependency = dependencies.map(a => a.edit);

}



// console.log(james);
PermissionDependencyResolver.prototype.canGrant = function(existing, permToBeGranted) {
    // checkDependency = existing.unshift(permToBeGranted)

    // append string to array
    var currentDependency = [permToBeGranted, existing];

    switch (permToBeGranted) {
        case 'view':
            return viewDependency.toString() == currentDependency.toString();
        case 'edit':
            return editDependency.toString() == currentDependency.toString();
        case 'create':
            return createDependency.toString() == currentDependency.toString();
        case 'delete':
            return deleteDependency.toString() == currentDependency.toString();
        case 'alter_tags':
            // if the alterTagDependency value is edit they can also view
            verifyDependency(alterTagDependency);
            return alterTagDependency.toString() == currentDependency.toString();
    }

}
/**
* Function to check if the dependcy 'edit' is active then the dependcy will always allow for view
* to be dependable
**/
function verifyDependency(dependency) {
  Object.keys(dependency).forEach(function (key) {
       if(alterTagDependency[key] == 'edit') {
         dependency.push(['view']);
       }
   });
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
