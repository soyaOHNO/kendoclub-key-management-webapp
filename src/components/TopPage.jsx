import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function Dashboard() {
  const navigate = useNavigate();

  const [borrowedCount, setBorrowedCount] = useState(0);
  const [storedCount, setStoredCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // 貸出中の鍵
      const borrowedSnap = await getDocs(
        query(collection(db, "keys"), where("status", "==", "貸出中"))
      );
      setBorrowedCount(borrowedSnap.size);

      // 保管中の鍵
      const storedSnap = await getDocs(
        query(collection(db, "keys"), where("status", "==", "保管中"))
      );
      setStoredCount(storedSnap.size);
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>岡山大学剣道部</h1>

      <ul>
        <li>貸出中の鍵：{borrowedCount} 本</li>
        <li>保管中の鍵：{storedCount} 本</li>
      </ul>

      <hr />

      <button onClick={() => navigate("/lend")}>鍵を借りる</button>
      <button onClick={() => navigate("/return")}>鍵を返す</button>
      <button onClick={() => navigate("/admin")}>管理者ページ</button>
    </div>
  );
}

export default Dashboard;
