import { useAuth } from "./AuthContext";

export default function Tablet() {
  const { authenticate, error } = useAuth();

  return (
    <section>
      <p>
        The sound of your name thuds against the gate as the two badgers furrow
        their brows. The badger on the right beckons you to approach.
      </p>
      <p>&quot;Only those who are pure of heart may pass.&quot;</p>
      <p>
        &quot;Place your hand upon this stone tablet, and thus will your true
        self be revealed.&quot;
      </p>
      <p>
        It holds out a rectangular stone tablet carved with an intricate design.
      </p>

      <form action={authenticate}>
        <button>Place your palm upon the tablet.</button>
      </form>

      {error && <p className="error">{error}</p>}
    </section>
  );
}
