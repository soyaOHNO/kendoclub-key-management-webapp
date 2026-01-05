import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase/firebase";

function App() {
  useEffect(() => {
    const testFirestore = async () => {
      const querySnapshot = await getDocs(collection(db, "keys"));
      querySnapshot.forEach((doc) => {
        console.log(doc.id, doc.data());
      });
    };

    testFirestore();
  }, []);

  return (
    <div>
      <h1>剣道部 鍵管理システム</h1>
      <p>Firestore 接続テスト中（Console確認）</p>
    </div>
  );
}

export default App;
