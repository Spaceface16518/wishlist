import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import { RealtimeSubscription } from "@supabase/realtime-js";

const Wishes = ({ wishes }: { wishes: any[] }) => {

  async function claimWish (id: number) {
    try {
      await supabase.from("claims")
        .insert({ wish: id }, { returning: "minimal" })
        .throwOnError();
    } catch (e) {
      // TODO: handler claim error
      console.log(e);
    }
  }

  return (
    <div>
      <h1>Wish List</h1>
      <div>
        <ul>
          {
            wishes.map(wish => (
              <Wish wish={wish} onClaim={claimWish} key={wish.id}/>
            ))
          }
        </ul>
      </div>
    </div>
  );
};

const Wish = ({ wish, onClaim }: { wish: WishData, onClaim: () => void }) => {
  const [claim, setClaim] = useState("");
  const [user, setUser] = useState(-1);

  return (
    <li>
      <div>
        <h3>{wish.name}</h3>
        <p>{wish.description}</p>
      </div>
    </li>
  );
};

export default Wishes;

export type WishData = { id: number, name: string, description: string };

export async function fetchWishes (): Promise<WishData[] | null> {
  const { data } = await supabase.from("wishes")
    .select("id, name, description")
    .order("created_at", { ascending: false }).throwOnError();
  return data;
}
