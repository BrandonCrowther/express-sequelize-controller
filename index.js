const APIController = require('./APIController')
const HTMLController = require('./HTMLController')
const Controller = require('./Controller')

// simple function to mount the controller
const mountController = function(controller){
	this.use(controller.getBase(), controller.getRouter())
}

exports.APIController = APIController;
exports.HTMLController = HTMLController;
exports.Controller = Controller;
exports.mountController = mountController