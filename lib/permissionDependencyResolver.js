var tsort = require('tsort') // HINT!!! This is a useful package for one of the methods
// DEFINE GLOBAL VARIABLES
var viewDependency;
var editDependency;
var deleteDependency;
var createDependency;
var alterTagDependency;
var graph = tsort();

function PermissionDependencyResolver (dependencies) {

    // pass a function to map
    // var reformattedArray = dependencies.map(obj => value)
    // TODO: use array map


    viewDependency = Object.entries(dependencies)[0];
    viewDependencyVal = mapDependency(viewDependency);
    editDependency = Object.entries(dependencies)[1];
    createDependency = Object.entries(dependencies)[3];
    deleteDependency = Object.entries(dependencies)[4];
    alterTagDependency = Object.entries(dependencies)[2];
    deleteDependencyVal = mapDependency(deleteDependency);
    createDependencyVal = mapDependency(createDependency);
    editDependencyValidate = mapDependency(editDependency);

}
/**
* Function to return mapped dependency
**/
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
          return Object.values(createDependencyVal).indexOf('view') > -1;
      case 'delete':
          return Object.values(deleteDependency).indexOf('edit') > -1;
      case 'alter_tags':
          return Object.values(existing).indexOf('edit') > -1 || Object.values(existing).indexOf('view') > -1;
      case 'batch_update':
          return Object.values(existing).indexOf('view') > -1 && Object.values(existing).indexOf('create') > -1;
      case 'audit':
          // must view and create
          return Object.values(existing).indexOf('view') > -1 && Object.values(existing).indexOf('create') > -1;
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

}
function sortOrdering(permission) {

  // check permission with no dependency
  if (viewDependencyVal) {
      parentDependcy = viewDependencyVal;
      graph.add('view');
  } else if (editDependencyValidate) {
      parentDependcy = editDependencyValidate;
      graph.add(editDependencyValidate);
  } else if(deleteDependencyVal) {
      parentDependcy = deleteDependencyVal;
      graph.add(editDependencyValidate);
  }

  if(editDependencyValidate == 'view') {
      graph.add('edit');
  }
  if (deleteDependencyVal == 'edit') {
      graph.add('delete');
  }

}

PermissionDependencyResolver.prototype.sort = function(permissions) {

    for (let permission of permissions) {
        sortOrdering(permission);
    }

    return graph.sort();
}

// you'll need to throw this in canGrant and canDeny when the existing permissions are invalid
function InvalidBasePermissionsError() {
  this.name = 'InvalidBasePermissionsError'
  this.message = "Invalid Base Permissions"
  this.stack = Error().stack;
}
InvalidBasePermissionsError.prototype = new Error()

module.exports = PermissionDependencyResolver
