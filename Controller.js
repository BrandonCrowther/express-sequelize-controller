const express = require("express")
const { Model } = require('sequelize');

class Controller{
    /**
     * Express callback.
     * @callback requestCallback
     * @param {Request} req
     * @param {Response} res
     * @param {requestCallback} next
     */


    /**
     * @param {Model} objectModel 
     * @param {requestCallback[]} beforeActions
     */
    constructor(objectModel, beforeActions = [], prefix = ""){
        this.objectModel = objectModel
        this.tableNameLower = objectModel.getTableName().toLowerCase()
        this.tableName = objectModel.getTableName()
        this.prefix = prefix

        this.beforeActions = beforeActions
    }

    /**
     * Returns a compiled express router based on the spec 
     * defined in actionMap(). See actionMap for that spec.
     * 
     * Mount this controller back to express like so:
     * @example
     *  app.use(controller.getBase(), controller.getRouter())
     * 
     * @returns express.Router
     */
    getRouter(){
        const router = express.Router()
        this.beforeActions.map(func => router.use(func))

        const endpoints = this.actionMap()
        for(const endpoint in endpoints){
            const methods = endpoints[endpoint]
            for(const method in methods){
                router.route(`/${endpoint}`)[`${method}`](methods[method])
            }
        }
        return router
    }

    getBase(){
        return `${this.prefix}/${this.tableNameLower}`
    }


    get =       async (req, res, next) => { res.status(501).send("Not Implemented.") }
    getById =   async (req, res, next) => { res.status(501).send("Not Implemented.") }
    create =    async (req, res, next) => { res.status(501).send("Not Implemented.") }
    update =    async (req, res, next) => { res.status(501).send("Not Implemented.") }
    delete =    async (req, res, next) => { res.status(501).send("Not Implemented.") }


    /**
     * Nested dictionary. Used by getRouter() to 
     * build the paths for the router
     * which is then mounted to the express app.
     *
     * This is the default controller spec:
     * @example
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
     * @return {Object} The controller map
     */
    actionMap(){
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
    }
}

module.exports = Controller