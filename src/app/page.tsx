
import styles from "./page.module.css";
import Scene from "./Component/scene";


export default function Home() {
  return (
    <div className={styles.page}>
      <h1>Mantra</h1>
      <Scene />
    </div>
  );
}
