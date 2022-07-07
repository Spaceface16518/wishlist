import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Wishlist, { fetchWishes } from "../components/Wishlist";
import supabase from "../lib/supabase";
import { useEffect } from "react";
import { RealtimeSubscription } from "@supabase/realtime-js";

const Home: NextPage = ({ wishes }: { wishes: any[] }) => {
  useEffect(() => {
    let wishSubscription: RealtimeSubscription;
    const cleanup = () => {
      supabase.removeSubscription(wishSubscription)
        .then(({ data, error }) => {
          if (error) {
            console.error(error.message);
          } else {
            console.log("Subscription closed");
            console.debug(
              `${data.openSubscriptions} open subscriptions remaining`);
          }
        });
    };
    wishSubscription = supabase.from("wishes")
      .on("*", fetchWishes)
      .subscribe();
    console.log("Subscription created");
    return cleanup;
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Amrit's Wishlist</title>
        <meta name="description" content="Amrit Rathie's wishlist"/>
        {/* TODO: update description */}
        {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>

      <main className={styles.main}>
        <Wishlist wishes={wishes}/>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  );
};

export async function getStaticProps () {
  const { data } = await supabase.from("wishes")
    .select("id, name, description")
    .order("created_at")
    .throwOnError();
  return {
    props: {
      wishes: data ?? []
    }
  };
}

export default Home;
