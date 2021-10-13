import { Post } from "../../entities/Post";
import { IRequest } from "../../Request&Response/IRequest";
import { IResponse } from "../../Request&Response/IResponse";
import { badRequest, customHttpResponse, ok } from "../../utils/HttpResponses";
import { CreatePostDto } from "../createPost/CreatePostDto";
import { UpdatePost } from "./updatePost";

export class UpdatePostController {
    constructor(private updatePostUseCase: UpdatePost) {}

    public async handle(req: IRequest, res: IResponse) {
        console.log("body: ", req.getBody());
        const postId = req.getBodyPropAsNumber("id");
        const decodedAuthToken = req.getDecodedAuthToken()!;
        const userId = decodedAuthToken.id;
        const { title, subtitle, htmlContent } = req.getBody();
        const imgFile = req.getFile();

        if (isNaN(postId))
            return badRequest(res, "Valid post id must be provided");

        const objectForUpdate: Partial<CreatePostDto> = {
            title,
            subtitle,
            htmlContent,
            imgRef: imgFile && Post.getImgRefForFileName(imgFile.filename)
        }

        const responseForPostUpdate = await this.updatePostUseCase.execute(postId, userId, objectForUpdate);

        return customHttpResponse(res, { statusCode: responseForPostUpdate.statusCode, msg: responseForPostUpdate.msg });
    }
}