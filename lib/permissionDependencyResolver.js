var tsort = require('tsort') // HINT!!! This is a useful package for one of the methods
var serialize = require('node-serialize');
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
    var james = serialize.serialize(dependencies);


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
function sortOrdering(permission, permissionOrder) {
  // console.log(permissions);
  // console.log(permissionsLength);
  // check permission with no dependency

  // console.log(createDependencyVal);

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
      if (createDependency) {
        graph.add('create');
      }

  } else if(editDependencyValidate && createDependency && createDependencyVal == 'view' && editDependencyValidate == 'view' && !permissionOrder) {
      graph.add('create');
      graph.add('edit');
  }

  // dependencies that belong to edit
  if(permission == 'delete' && deleteDependencyVal == 'edit' && deleteDependencyVal) {
        graph.add('delete');
  } else if(permission == 'alter_tags' &&  alterTagDependencyVal == 'edit' && alterTagDependency) {
        graph.add('alter_tags');
  }

  // if(permission == 'delete') {
  //   if (deleteDependencyVal == 'edit') {
  //       graph.add('delete');
  //   }
  // }
  //
  // if(permission == 'create') {
  //   if (createDependencyVal == 'view') {
  //       graph.add('create');
  //   }
  // }
  // if(permission == 'alter_tags') {
  //     graph.add('alter_tags');
  // }



  // if(belongsToView && permission != permissions[permissions.length-1]) {
  //       graph.add(permission);
  // } else {
  //   console.log('nnnnn');
  // }
  // if(belongsToView &&  permissions) {
  //     graph.add(belongsToView);
  // }

}

// function sortOrderingRelation(permission, belongsToView) {
//
//   if (viewDependencyVal) {
//       parentDependcy = viewDependencyVal;
//       graph.add('view');
//   }
//
//
//
// }

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
      }
}

// function testing(currentPermision, belongsToView) {
//   if(belongsToView) {
//
//   }
//   console.log(currentPermision + ' ' + belongsToView);
// }
PermissionDependencyResolver.prototype.sort = function(permissions) {
    // check if it is a view dependency or an edit editDependency
    var belongsToView = 0;
    var permissionOrder = false;
    function CallbackFunctionToFindTaskById(task) {
        return task;
    }
    // console.log(permissions);

    for (let permission of permissions) {
      checkObject = sortValueCheck(permission);
      var task = checkObject.find(CallbackFunctionToFindTaskById);
      if(task == 'view') {
          belongsToView = 1;
      }

      sortOrdering(permission, permissionOrder);


    }

    // can return this ['view', 'edit', 'create', 'alter_tags']
    console.log(graph.sort());
    // graph.add(['view', 'create', 'edit', 'alter_tags']);
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
