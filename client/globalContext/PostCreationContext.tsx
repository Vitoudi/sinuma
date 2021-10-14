import React, {
  PropsWithChildren,
  ReactElement,
  useContext,
  useState,
} from "react";
import {
  convertToRaw,
  ContentState,
  EditorState as NativeEditorState,
} from "draft-js";
import dynamic from "next/dynamic";
import draftToHtml from "draftjs-to-html";
const EditorState = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.EditorState),
  { ssr: false }
);
import { AuthContext } from "./auth/AuthContext";
import { getJournalistByUserId } from "../utils/db/journalists";
import { createPost as sendRequestToCreatePost, CreatePostDto, GetPostDto, updatePost as sendRequestToUpdatePost, UpdatePostDto } from "../utils/db/posts";
// import htmlToDraft from "html-to-draftjs";

export type PostCreationMode = "update" | "create";

interface PostCreationInputs {
  title: string;
  subtitle: string;
  file: File | null;
}

export interface PostCreationProps {
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  postCreationInputs: PostCreationInputs;
  setInputValueByName: (inputValueName: string, value: any) => void;
  submitPost: () => void;
  addExistingPostForUpdate: (post: GetPostDto) => void;
  editorState: EditorState;
  mode: PostCreationMode;
  setMode: React.Dispatch<React.SetStateAction<PostCreationMode>>;
}

export const PostCreationContext = React.createContext({} as PostCreationProps);

export default function PostCreationContextProvider({
  children,
}: PropsWithChildren<{}>): ReactElement {
  const auth = useContext(AuthContext);
  const [mode, setMode] = useState<PostCreationMode>("create");
  const [post, setPost] = useState<GetPostDto | null>(null);
  const [postCreationInputs, setPostCreationInputs] =
    useState<PostCreationInputs>({
      title: "",
      subtitle: "",
      file: null,
    });

  const [editorState, setEditorState] = useState<EditorState>(
    () => EditorState.defaultProps
  );

  // PUBLIC:
  function setInputValueByName(name: string, value: any) {
    setPostCreationInputs((values) => {
      return { ...values, [name]: value };
    });
  }

  async function submitPost() {
    if (mode === "create") await createPost();
    else await updatePost()
  }

  function addExistingPostForUpdate(post: GetPostDto) {
    const { htmlContent, id, imgRef, title, subtitle } = post;
    setInputValueByName("title", title);
    setInputValueByName("subtitle", subtitle);
    addHtmlContentToEditor(htmlContent);
    setPost(post);
    setMode("update");
  }


  // PRIVATE:
  function getPostHtmlContent() {
    const rawContentState = convertToRaw(editorState.getCurrentContent());

    const markup = draftToHtml(rawContentState);

    return markup;
  }

  async function addHtmlContentToEditor(htmlContent: string) {
    if (!window) return;

    const htmlToDraft = await import("html-to-draftjs").then(
      (mod) => mod.default
    );

    const { contentBlocks } = htmlToDraft(htmlContent);
    if (!contentBlocks) return;

    const contentState = ContentState.createFromBlockArray(contentBlocks);
    const editorState = NativeEditorState.createWithContent(contentState);

    setEditorState(editorState);
  }

  async function createPost() {
      const token = auth.getUserAuthToken();
      const user = auth.user;

      if (!token || !user) return;

      const journalist = await getJournalistByUserId(user.id);

      if (!journalist) return;

      const { title, subtitle, file } = postCreationInputs;
      const htmlContent = getPostHtmlContent();

      const postInfo = {
        title,
        journalistId: journalist.id,
        committeId: journalist.committeId,
        htmlContent,
        imgFile: file,
        subtitle,
      };

      await sendRequestToCreatePost(token, postInfo);
  }

  async function updatePost() {
      if (!post) return;

      const token = auth.getUserAuthToken();
      if (!token) return;

      const { id } = post;
      const { title, subtitle, file } = postCreationInputs;
    const htmlContent = getPostHtmlContent();

      const objToUpdatePost: UpdatePostDto = {
          title,
          subtitle,
          id,
          htmlContent,
          imgFile: file
      }

      await sendRequestToUpdatePost(token, objToUpdatePost);
  }

  

  return (
    <PostCreationContext.Provider
      value={{
        editorState,
        setEditorState,
        postCreationInputs,
        setInputValueByName,
        submitPost,
        addExistingPostForUpdate,
        mode,
        setMode
      }}
    >
      {children}
    </PostCreationContext.Provider>
  );
}