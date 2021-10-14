import { GetStaticPropsContext } from 'next';
import { useRouter } from 'next/dist/client/router'
import Image from 'next/image';
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../globalContext/auth/AuthContext';
import { PostCreationContext } from '../../globalContext/PostCreationContext';
import { API_URL } from '../../utils/db/apiRef';
import { getJournalistById, getJournalistByUserId, GetJournalistDto, PostJournalistDto } from '../../utils/db/journalists';
import { deletePost, sendRequestToGetPosts, getPost, GetPostDto, increasePostVisitsNumber, updatePost } from '../../utils/db/posts';
import { getPathsFor } from '../../utils/getPathsFor';
import PostContent from './components/PostContent';
import PostHeader from './components/PostHeader';
import PostImage from './components/PostImage';
import styles from "./postPage.module.css";

export async function getStaticPaths() {
  const posts = await sendRequestToGetPosts();
  const paths = getPathsFor(posts);

  return { paths, fallback: "blocking" };
}

export async function getStaticProps(context: GetStaticPropsContext) {
    const id = context.params?.id
    const idNum = Number(id);
    const post = await getPost(idNum);

  return {
    props: { post }, // will be passed to the page component as props
    revalidate: 10, // In seconds
  };
}

interface Props {
  post: GetPostDto | null;
}

export default function PostPage({ post }: Props): ReactElement {
    const auth = useContext(AuthContext);
    const postCreationProps = useContext(PostCreationContext);
    const { id, imgRef, title, subtitle, createdAt, journalistId, htmlContent} = post!; 
    const router = useRouter();
    const imgUrl = API_URL + "/assets/posts/" + imgRef;
    const [ journalist, setJournalist ] = useState<GetJournalistDto | null>(null);
    const currentUserIsThePostOwner = journalist?.id === journalistId;

    useEffect(() => {
        if (!post) router.replace("/");
    }, [post, router])

    useEffect(() => {
      if (!auth.user) return;
      
      getJournalistByUserId(auth.user.id).then(journalist => setJournalist(journalist))
    }, [auth]);

    useEffect(() => {
      if (!post?.id) return;
      
      increasePostVisitsNumber(post?.id);
    }, [post]);

    function handleDelete() {
        deletePost(auth.getUserAuthToken() || "" ,id);
    }

    function handleRedirectToPostUpdate() {
      const { addExistingPostForUpdate } = postCreationProps;
      if (!post) return;
      addExistingPostForUpdate(post);
      router.push("/create");
    }

    return (
      <div className={styles["post-page"]}>
        {currentUserIsThePostOwner && (
          <div>
            <div onClick={handleDelete}>Deletar</div>
            <div onClick={handleRedirectToPostUpdate}>Atualizar</div>
          </div>
        )}
        <PostHeader
          journalistId={journalistId}
          subtitle={subtitle}
          strDate={createdAt}
        >
          {title}
        </PostHeader>
        <PostImage src={imgUrl} />
        <PostContent htmlContent={htmlContent} />
      </div>
    );
}