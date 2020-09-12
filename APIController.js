const Controller = require('./Controller')

class APIController extends Controller{
    /**
     * Express callback.
     * @callback expressFunction
     * @param {Request} req
     * @param {Response} res
     * @param {requestCallback} next
     */

    /**
     * Constructs the object to generate the express router from
     * Pass in express callback functions (req, res, next) that
     * you would like to stage before executing anything in this
     * controller.
     * 
     * Afterwards, mount your controller like so:
     * @example
     *  app.use(controller.getBase(), controller.getRouter())
     * 
     * or
     * @example
     *  app.mountController = function(controller){
     *      this.use(controller.getBase(), controller.getRouter())
     *  }
     *  app.mountController(new APIController(User))
     * 
     * 
     * __
     * @param {Model} objectModel 
     * @param {expressFunction[]} expressFunction
     * @param {string} prefix = "/api"
     */
    constructor(objectModel, beforeActions = [], prefix = "/api"){
        super(objectModel, beforeActions, prefix)
        beforeActions.push(this.defaultBeforeAction)
    }


   /**
     * Default middleware called before anything in this controller.
     * Rejects any request that does not accept json.
     */
    defaultBeforeAction = async (req, res, next) => {
        if(req.accepts("json") || req.accepts("application/json"))
            next()
        else res.status(406).send("Not Acceptable")
    }

    get = async (req, res, next) => {
        var models = [];
        const params = req.body[this.tableName] ? req.body[this.tableName] : {}
        models = await this.objectModel.findAll({where: params})
        res.send(models)
    }

    getById = async (req, res, next) => {
        var model = null
        if(req.params.id)
            model = await this.objectModel.findByPk(req.params.id)

        if(model)
            res.send(model)
        else
            res.status(404).send(`Can not find model by id ${req.params.id}.`)
    }

    create = async (req, res, next) => {
        res.send(await this.objectModel.create(req.body[this.tableName]))
    }

    update = async (req, res, next) => {
        if(req.params.id){
            req.body[this.tableName].id = req.params.id
        }
        const success = await this.objectModel.upsert(req.body[this.tableName])
        const model = await this.objectModel.findByPk(req.body[this.tableName].id)
        if(!model){
            res.status(500)
                .send(`Can not find ${this.tableNameLower} of id ${req.params.id} to update.`)
        }

        res.send(model)
    }

    delete = async (req, res, next) => {
        var model = await this.objectModel.findByPk(req.params.id)

        if(!model){
            res.status(500)
                .send(`Can not find ${this.tableNameLower} of id ${req.params.id} to delete.`)
        }

        await model.destroy()
        var models = models = await this.objectModel.findAll()

        res.send(models)
    }

    /**
     * Nested dictionary. Used by getRouter() to 
     * build the paths for the router
     * which is then mounted to the express app.
     *
     * This is the default HTML controller spec:
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
     * @return {Object} The controller map
     */
    actionMap(){
        var map = super.actionMap()
        map["delete"] = { 
            post: this.delete ,
            delete: this.delete 
        },
        map["update"] ={ 
            put: this.update,
            post: this.update 
        }
        return map

    }
}

module.exports = APIController