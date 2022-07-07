import supabase from "../../lib/supabase";
import { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import Head from "next/head";

const WishDetails: NextPage = ({ wish }: { wish: any }) => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <title>Amrit's Wishlist</title>
        <meta name="description" content="Amrit Rathie's wishlist"/>
        {/* TODO: update description */}
        {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>

      <main>
        <h2>{wish.name}</h2>
        <p>{wish.description}</p>
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
};

export async function getStaticProps ({ params }: { params: { id: number } }) {
  const { data } = await supabase.from("wishes")
    .select("id,name,description")
    .eq("id", params.id)
    .limit(1)
    .throwOnError()
    .single();
  return {
    props: {
      wish: data
    }
  };
}

export async function getStaticPaths () {
  const { data } = await supabase.from("wishes")
    .select("id")
    .order("created_at")
    .throwOnError();
  return {
    paths: data?.map(({ id }) => {
        return { params: { id: id.toString() } };
      }
    ) ?? [],
    fallback: false
  }
    ;
}

export default WishDetails;
