import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, onSnapshot, } from "firebase/firestore";
import Header from "./Header";

function Dashboard() {
  const navigate = useNavigate();

  const [borrowedCount, setBorrowedCount] = useState(0);
  const [storedCount, setStoredCount] = useState(0);


  useEffect(() => {
    console.log("Firestore 監視開始");
    const q = collection(db, "keys");

    const unsub = onSnapshot(q, (snap) => {
      // snap.empty のチェックを入れる
      if (snap.empty) {
        setBorrowedCount(0);
        setStoredCount(0);
        return;
      }
      const statuses = snap.docs.map(doc => doc.data().status?.trim().toLowerCase());
      const bCount = statuses.filter(s => s === "borrowed").length;
      const sCount = statuses.filter(s => s === "stored").length;
      setBorrowedCount(bCount);
      setStoredCount(sCount);
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    return () => {
      unsub();
    };
  }, []); // 空の配列でマウント時のみ実行

  return (
    <>
      <Header title="岡山大学剣道部 鍵管理システム" />

      <div className="page-content dashboard-container">
        <div className="status-cards" key={`${borrowedCount}-${storedCount}`}>
          <div className={`status-card ${borrowedCount > 0 ? "borrowed" : ""}`}>
              <p className="status-label">貸出中</p>
              <p className="status-number">{borrowedCount} 本</p>
          </div>
          <div className={`status-card ${storedCount > 0 ? "stored" : ""}`}>
              <p className="status-label">保管中</p>
              <p className="status-number">{storedCount} 本</p>
          </div>
        </div>

        <div className="dashboard-buttons">
          <button
            className="primary-button"
            onClick={() => navigate("/lend")}
          >
            鍵を借りる
          </button>

          <button
            className="primary-button"
            onClick={() => navigate("/return")}
          >
            鍵を返す
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
