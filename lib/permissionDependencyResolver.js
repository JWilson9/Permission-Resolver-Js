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

  Object.keys(dependencies).map(function(key, index) {
      // console.log(dependencies[key]);
  });

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
    alterTagDependency = Object.entries(dependencies)[2];

    createDependencyVal = mapDependency(createDependency);
    editDependencyValidate = mapDependency(editDependency);
    console.log(createDependencyVal);
    console.log(createDependencyVal);
    objVal = Object.values(alterTagDependency);
    // editDependency = dependencies.map(a => a.edit);
  }

  function mapDependency(dependencyToMap) {
      Object.keys(dependencyToMap).map(function(key, index) {
          dependencyMapped = dependencyToMap[key];
      });

      return dependencyMapped;
  }
/**
* Function returns boolean
**/
function dependencyChecker(existing, dependency) {
  switch (dependency) {
      case 'edit':
      return Object.values(editDependencyValidate).indexOf('view') > -1;
      case 'create':
      console.log(createDependencyVal);
          return Object.values(createDependencyVal).indexOf('view') > -1;
      case 'delete':
          return Object.values(deleteDependency).indexOf('edit') > -1;
      case 'alter_tags':
          // no need to test for edit too as edit replies on view
          return Object.values(existing).indexOf('edit') > -1 || Object.values(existing).indexOf('view') > -1;
  }
}

PermissionDependencyResolver.prototype.canGrant = function(existing, permToBeGranted) {
    return dependencyChecker(existing, permToBeGranted);
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

    editDependencyValidate.toString();

        // if (existing.indexOf("alter_tags") > -1 == false && existing.indexOf("view") > -1) {
        //     //In the array!
        //     return true;
        // } else {
        //     //Not in the array
        //     console.log('Not in the array');
        //   }
    switch (permToBeDenied) {
        case 'view':
            // if existing array contains edit and permToBeDenied is view
            if (Object.values(existing).indexOf('edit') > -1 && permToBeDenied == editDependencyValidate) {
                // this can never be true as edit depends on view
                return false;
            } else {
                return true;
            }
            case 'edit':
            return existing.indexOf('alter_tags') > -1 == false && existing.indexOf('delete') > -1 == false && existing.indexOf('view') > -1;

    }



    // if (Object.values(editDependency).indexOf(permToBeDenied) > -1) {
    //     return true;
    // }

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
