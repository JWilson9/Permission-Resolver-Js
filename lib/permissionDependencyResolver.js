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
    alterTagDependencyVal = mapDependency(deleteDependency);

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
* Function to check for the dependencies also calls function base dependencies
* @return boolean
**/
function dependencyChecker(existing, dependency) {

    // check to see if base dependcies are correct
    baseDependencyChecker(existing);

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
/**
* Function to check for the base dependencies
* throws error if the dependencies is incorrect
**/
function baseDependencyChecker(existing) {
    /**
    * Simple function that checks if a variable exists in the reformattedArray
    * Takes in an array and a string
    * @return a boolean
    **/
    function checkAvailability(arr, val) {
      return arr.some(function(arrVal) {
        return val === arrVal;
      });
    }

    deleteExists = checkAvailability(existing, 'delete');
    createExists = checkAvailability(existing, 'create');
    viewExists = checkAvailability(existing, 'view');
    editExists = checkAvailability(existing, 'edit');
    if(createExists && !viewExists) {
        throw new Error('Invalid Base Permissions');
    }
    if(deleteExists && !editExists) {
        throw new Error('Invalid Base Permissions');
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
    baseDependencyChecker(existing);
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

/**
* Function for the sort ordering of permissions
* @return graph sort
**/
function sortOrdering(permission, permissionOrder) {
    console.log(permission);
    // getting the parent dependency
    if (viewDependencyVal) {
        parentDependcy = viewDependencyVal;
        graph.add('view');
    }
    else if (editDependencyValidate) {
        parentDependcy = editDependencyValidate;
        graph.add(editDependencyValidate);
    } else if(deleteDependencyVal) {
        parentDependcy = deleteDependencyVal;
        graph.add(editDependencyValidate);
    }

    if(editDependencyValidate == 'view' && permissionOrder) {
        if(editDependencyValidate) {
          graph.add('edit');
        }
        if (createDependency && permission == 'create') {
          graph.add('create');
        }

    }
    if(editDependencyValidate && createDependency && createDependencyVal == 'view' && editDependencyValidate == 'view' && !permissionOrder) {
        graph.add('create');
        graph.add('edit');
    }

    // dependencies that belong to edit
    if(permission == 'delete' && deleteDependencyVal == 'edit' && deleteDependencyVal) {
          graph.add('delete');
    } else if(permission == 'alter_tags' &&  alterTagDependencyVal == 'edit' && alterTagDependency) {
          graph.add('alter_tags');
    }

}
/**
* Simple switch case function
* @return the dependency of the object;
**/
function sortValueCheck(permission) {

    switch (permission) {
        case 'create' :
            return createDependency;
        case 'alter_tags':
            return alterTagDependency;
        case 'view':
            return viewDependency;
        case 'edit':
            return editDependency;
        case 'delete':
            return deleteDependency;

    }
}

PermissionDependencyResolver.prototype.sort = function(permissions) {
    // check if it is a view dependency or an edit editDependency
    var belongsToView = 0;
    var permissionOrder = true;
    function getPermissionValue(task) {
      // console.log(task);
        return task;
    }

    for (let permission of permissions) {
      checkObject = sortValueCheck(permission);

      var task = checkObject.find(getPermissionValue);

      sortOrdering(permission, permissionOrder);

    }
    console.log(graph.sort());
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
