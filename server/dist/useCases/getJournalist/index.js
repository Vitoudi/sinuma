"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJournalistByUserIdController = exports.getJournalistByIdController = exports.getJournalistByUserIdUseCase = exports.getJournalistByIdUseCase = void 0;
var sharedDependencies_1 = require("../sharedDependencies");
var GetJournalist_1 = require("./GetJournalist");
var GetJournalistController_1 = require("./GetJournalistController");
exports.getJournalistByIdUseCase = new GetJournalist_1.GetJournalist(function (id) { return sharedDependencies_1.journalistsRepository.getById(id); });
exports.getJournalistByUserIdUseCase = new GetJournalist_1.GetJournalist(function (id) { return sharedDependencies_1.journalistsRepository.getOneByUserId(id); });
exports.getJournalistByIdController = new GetJournalistController_1.GetJournalistController(exports.getJournalistByIdUseCase);
exports.getJournalistByUserIdController = new GetJournalistController_1.GetJournalistController(exports.getJournalistByUserIdUseCase);
