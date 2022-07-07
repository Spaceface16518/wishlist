import supabase from "../lib/supabase";

const Wishes = ({ wishes }: { wishes: any[] }) => {
  return (
    <div>
      <h1>Wish List</h1>
      <div>
        <ul>
          {
            wishes.map(wish => (
              <Wish wish={wish} key={wish.id}/>
            ))
          }
        </ul>
      </div>
    </div>
  );
};

const Wish = ({ wish }: { wish: WishData }) => {
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
