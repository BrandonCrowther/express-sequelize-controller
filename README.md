# express-sequelize-controller
Three helper classes that generate a basic crud controller for your express+sequelize application. An example application is available here <a href="https://github.com/BrandonCrowther/express-sequelize-controller-example">express-sequelize-controller-example</a>.

<br>
<br>

## Installation:
`npm install express-sequelize-controller`
<br>

Then, in your project:
```javascript
const {APIController, HTMLController, Controller, mountController} = require('express-sequelize-controller')

app.mountController = mountController
```

<br>

## How To Use:
```javascript
app.mountController(new APIController(User))
```
<br>

The above code will generate a CRUD controller for your `User` model. Refer to the routes below for the spec of the generated routes.

<br>

<strong>Note:</strong> `HTMLController` expects the following view files for each model you pass it: 
- `/${tableNameLowercase}/view` - the controller will attempt to pass it a variable `model` that holds the Sequelize model
- `/${tableNameLowercase}/index` - the controller will attempt to pass it a variable `models` that holds an array of Sequelize models.
- `/${tableNameLowercase}/form` - the controller will attempt to pass it a variable `model` that holds the Sequelize model. Used for create and edit. Pass it a new, unpopulated model for create.


<br>
<br>

## Routes:
The Route spec is defined as a dictionary of dictionaries. The outer dictionary has the path as a key - defined according to the express routing spec, and the inner dictionary contains the method type as a key and function for that method type as a value.
<br>

For example: In the `APIController` example below, calling `GET user/1` would match to the path `:id(\\d+)` and map to the function `getById`. Similarly `DELETE user/3` would match to path `delete/:id(\\d+)` and map to the function `this.delete` (from the key `delete`)

<br>

### APIController:
 ```javascript
    return {
        "": {
            get: this.get,
            post: this.create,
        },
        "index": {
            get: this.get
        },
        "create": {
            post: this.create
        },
        "delete": { 
            post: this.delete ,
            delete: this.delete 
        },
        "update": { 
            put: this.update,
            post: this.update 
        },
        "delete/:id(\\d+)": { 
            post: this.delete ,
            delete: this.delete 
        },
        "update/:id(\\d+)": { 
            put: this.update,
            post: this.update 
        },
        ":id(\\d+)": {
            get: this.getById,
            put: this.update,
            delete: this.delete
        }
    }
```



<br>



### HTMLController:
 ```javascript
    return {
        "": {
            get: this.get,
            post: this.create,
        },
        "index": {
            get: this.get
        },
        "create": {
            get: this.create,
            post: this.create
        },
        "delete/:id(\\d+)": { 
            post: this.delete ,
            delete: this.delete 
        },
        "update/:id(\\d+)": { 
            put: this.update,
            post: this.update 
        },
        ":id(\\d+)": {
            get: this.getById,
            put: this.update,
            delete: this.delete
        }
    }
```
<br>

## Adding Your Own Routes
Adding your own routes is fairly easy. Simply extend the class and modify the `actionMap` function to accommodate your needs. See the way `APIController` or `HTMLController` extend `Controller` in the source code for an example.

<br>
<br>


## TODO:
Obviously a lot of things can be cleaned up here. As of right now I have the following in mind:
- Make better guesses at things like the folder where views are stored.
- Get rid of the Express dependency. Probably have to pass the router in as a parameter, unfortunately.
- Typescriptify
- Automatic support for relational queries (ie: `user/1/posts`)
- Generalize database interface to allow other database libraries to be used
- Make it easier to add to actionMap
- Make a minimal demo app