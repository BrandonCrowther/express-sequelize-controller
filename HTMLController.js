
const Controller = require('./Controller')

class HTMLController extends Controller{
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
     *  app.mountController(new HTMLController(User))
     * 
     * 
     * __
     * @param {Model} objectModel 
     * @param {expressFunction[]} expressFunction
     * @param {string} prefix = ""
     */
    constructor(objectModel, beforeActions = [], prefix = ""){
        super(objectModel, beforeActions, prefix)
        this.index = "index"
        this.view = "view"
        this.form = "form"
        beforeActions.push(this.defaultBeforeAction)
    }


   /**
     * Default middleware called before anything in this controller.
     * Rejects any request that does not accept html.
     */
    defaultBeforeAction = async (req, res, next) => {
        if(req.accepts("html"))
            next()
        else res.status(406).send("Not Acceptable.")
    }


    get = async (req, res, next) => {
        var models = [];
        const params = req.body[this.tableName] ? req.body[this.tableName] : {}
        models = await this.objectModel.findAll({where: params})
        res.render(`${this.tableNameLower}/${this.index}`, {models: models})
    }

    getById = async (req, res, next) => {
        var model = null
        if(req.params.id)
            model = await this.objectModel.findByPk(req.params.id)

        if(!model)
            res.status(404).send(`Can not find model by id ${req.params.id}.`)

        res.render(`${this.tableNameLower}/${this.view}`, {model: model})
    }

    create = async (req, res, next) => {
        if(req.method == "GET")
            res.render(`${this.tableNameLower}/form`, {model: this.objectModel.build(), method: "POST"})
        else if(req.method == "POST"){
            const success = await this.objectModel.create(req.body[this.tableName])
            if(success)
                res.redirect(`/${this.tableNameLower}/${this.index}`)
        }
    }

    update = async (req, res, next) => {
        if(req.method == "GET"){
            const model = await this.objectModel.findByPk(req.params.id)
            res.render(`${this.tableNameLower}/form`, {model: model})
        }
        if(req.method == "UPDATE" || req.method == "POST"){
            const success = await this.objectModel.upsert(req.body[this.tableName])
            const model = await this.objectModel.findByPk(req.body[this.tableName].id)
            if(!model){
                res.status(500)
                    .send(`Can not find ${this.tableNameLower} of id ${req.params.id} to update.`)
            }

            res.render(`${this.tableNameLower}/${this.view}`, {model: model, method: "POST"})
        }
    }

    delete = async (req, res, next) => {
        var model = await this.objectModel.findByPk(req.params.id)

        if(!model){
            res.status(500)
                .send(`Can not find ${this.tableNameLower} of id ${req.params.id} to delete.`)
        }

        await model.destroy()
        var models = models = await this.objectModel.findAll()

        res.render(`${this.tableNameLower}/${this.index}`, {models: models})
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
     * @return {Object} The controller map
     */
    actionMap(){
        var map = super.actionMap()
        map["create"].get = this.create
        map["update/:id(\\d+)"].get = this.update
        return map
    }
}



module.exports = HTMLController