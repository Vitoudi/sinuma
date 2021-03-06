import axios from "axios";
import { GetStaticProps, GetStaticPropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import { sendRequestToGetPosts, GetPostDto } from "../utils/db/posts";
import Post from "../sheredComponents/Post/Post"
import PostsContainer from "../sheredComponents/postsContainer/PostsContainer";
import { GetCommitteeDto, sendRequestToGetCommittees } from "../utils/db/committees";
import CommitteesSmallDisplay from "../sheredComponents/CommitteeSmallDisplay/CommitteesSmallDisplay";
import styles from "../styles/Home.module.css"
import Link from "next/link";


interface props {
  hotPosts: GetPostDto[] | null;
  latestPosts: GetPostDto[] | null;
  committees: GetCommitteeDto[];
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const NUMBER_OF_POSTS_TO_GET_ON_INITIAL_PAGE = 6;
  const hotPosts = await sendRequestToGetPosts({ page: 1, limit: NUMBER_OF_POSTS_TO_GET_ON_INITIAL_PAGE, hot: true });
  const latestPosts = await sendRequestToGetPosts({ page: 1, limit: NUMBER_OF_POSTS_TO_GET_ON_INITIAL_PAGE });
  const committees = await sendRequestToGetCommittees();

  return {
    props: { hotPosts, latestPosts, committees },
    revalidate: 10,
  };
}

export default function Home({ hotPosts, latestPosts, committees }: props) {

  if (!hotPosts || !latestPosts) return null;

  return (
    <div className={styles["home-page"]}>
      <Head>
        <title>Sinuma AC</title>
        <meta name="description" content="O portal de notícias da sinuma" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className={styles["posts-area"]}>
        <PostsContainer postsList={latestPosts} title="Mais recentes:">
          <Link href="/posts" passHref>
            <button className={styles["show-more-btn"]}>Ver mais</button>
          </Link>
        </PostsContainer>
        <div>
          <PostsContainer postsList={hotPosts} title="Mais lidas:">
            <Link href="/posts?hot=true" passHref>
              <button className={styles["show-more-btn"]}>Ver mais</button>
            </Link>
          </PostsContainer>
        </div>
      </section>

      {committees && <aside className={styles["aside"]}>
        {committees.map((committee) => (
          <CommitteesSmallDisplay key={committee.id} committee={committee} />
        ))}
      </aside>}
    </div>
  );
}
