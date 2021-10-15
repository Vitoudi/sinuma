"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfPostBelongsToJournalistByUserIdService = exports.usersRepository = exports.postsRepository = exports.journalistsRepository = exports.committesRepository = exports.emailsInfosRepository = exports.imageStorage = void 0;
var QueryBuilder_1 = require("../data/QueryBuilder");
var MySqlCommitteRepository_1 = require("../repositories/committes/MySqlCommitteRepository");
var MySqlJornalistsRepository_1 = require("../repositories/journalists/MySqlJornalistsRepository");
var MySqlEmailsRepository_1 = require("../repositories/journalistsEmails/MySqlEmailsRepository");
var MySqlPostsRepository_1 = require("../repositories/posts/MySqlPostsRepository");
var MySqlUserRepository_1 = require("../repositories/users/MySqlUserRepository");
var CheckIfPostBelogsToUserService_1 = require("../utils/CheckIfPostBelogsToUserService");
var S3Storage_1 = require("../utils/S3Storage");
var queryBuilder = new QueryBuilder_1.QueryBuilder();
exports.imageStorage = new S3Storage_1.ImageStorage();
exports.emailsInfosRepository = new MySqlEmailsRepository_1.MySqlEmailsRepository(queryBuilder);
exports.committesRepository = new MySqlCommitteRepository_1.MySqlCommittesRepository(queryBuilder);
exports.journalistsRepository = new MySqlJornalistsRepository_1.MySqlJournalistsRepository(queryBuilder);
exports.postsRepository = new MySqlPostsRepository_1.MySqlPostsRepository(queryBuilder);
exports.usersRepository = new MySqlUserRepository_1.MySqlUsersRepository(queryBuilder);
exports.checkIfPostBelongsToJournalistByUserIdService = new CheckIfPostBelogsToUserService_1.CheckIfUserHasAuthorizationToModifyPostService(exports.journalistsRepository, exports.postsRepository, exports.usersRepository);
