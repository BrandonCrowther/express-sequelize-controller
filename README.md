# express-sequelize-controller
Two helper classes that generate a basic controller spec for your express-sequelize application.



## How To Use:
```javascript
const controller = new APIController(User)
app.use(controller.getBase(), controller.getRouter())
```
or:

```javascript
app.mountController = function(controller){
    this.use(controller.getBase(), controller.getRouter())
}
app.mountController(new APIController(User))
```

Note: HTMLController expects the following view files for each model you pass it: 
- `/${tableNameLowercase}/view` - the controller will attempt to pass it a variable `model` that holds the Sequelize model
- `/${tableNameLowercase}/index` - the controller will attempt to pass it a variable `models` that holds an array of Sequelize models.
- `/${tableNameLowercase}/form` - the controller will attempt to pass it a variable `model` that holds the Sequelize model. Used for create and edit.



 ## Default controller specs:

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


## TODO:
Obviously a lot of things can be cleaned up here. As of right now I have the following in mind:
- Make better guesses at things like the folder where views are stored.
- Get rid of the Sequelize dependency. Probably have to pass the router in as a parameter, unfortunately.
- Improve jsdoc
- Improve readme :)
- Typescriptify
- Support generating relational queries