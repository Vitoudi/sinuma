"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePost = void 0;
var HttpResponses_1 = require("../../utils/HttpResponses");
var UpdatePost = /** @class */ (function () {
    function UpdatePost(postsRepository, checkIfUserHasAuthorizationToModifyPostService) {
        this.postsRepository = postsRepository;
        this.checkIfUserHasAuthorizationToModifyPostService = checkIfUserHasAuthorizationToModifyPostService;
    }
    UpdatePost.prototype.execute = function (postId, userId, createPostDto) {
        return __awaiter(this, void 0, void 0, function () {
            var userHasAuthorizationToModifyPost, post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkIfUserHasAuthorizationToModifyPostService.execute(postId, userId)];
                    case 1:
                        userHasAuthorizationToModifyPost = _a.sent();
                        if (!userHasAuthorizationToModifyPost)
                            return [2 /*return*/, {
                                    success: false,
                                    statusCode: HttpResponses_1.HTTP_STATUS_CODES.UNAUTHORIZED,
                                    msg: "Sua conta não possui autorização para modificar esse post",
                                }];
                        return [4 /*yield*/, this.postsRepository.getPostById(postId)];
                    case 2:
                        post = _a.sent();
                        if (!post)
                            return [2 /*return*/, { success: false, statusCode: HttpResponses_1.HTTP_STATUS_CODES.NOT_FOUND, msg: "Post não encontrado" }];
                        return [4 /*yield*/, this.postsRepository.updatePost(postId, createPostDto)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { success: true, statusCode: HttpResponses_1.HTTP_STATUS_CODES.OK, msg: "Post atualizado com sucesso" }];
                }
            });
        });
    };
    return UpdatePost;
}());
exports.UpdatePost = UpdatePost;
