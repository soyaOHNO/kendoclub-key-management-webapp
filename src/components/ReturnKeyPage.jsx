import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {collection, getDocs, query, where, updateDoc, doc, serverTimestamp, } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function ReturnKeyPage() {
    const [users, setUsers] = useState([]);
    const [keys, setKeys] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedKey, setSelectedKey] = useState("");
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();


    // 利用者・鍵を取得
    const fetchData = async () => {
        const userSnap = await getDocs(collection(db, "users")); // DBの users コレクション
        // 利用者一覧をセット
        setUsers(userSnap.docs.map((doc) =>
            ({id: doc.id, ...doc.data(),})));
        const keySnap = await getDocs(collection(db, "keys")); // DBの keys コレクション
        // filterで貸出中の鍵を抽出
        setKeys(keySnap.docs.map((doc) =>
            ({id: doc.id, ...doc.data(),})).filter((key) => key.status === "borrowed"));
    };

    // 初回レンダリング時にデータ取得
    useEffect(() => {
        fetchData();
    }, []);

    // 返却処理
    const handleReturn = async () => {
        if (!selectedUser || !selectedKey) {
            setMessage("利用者と鍵を選択してください");
            return;
        }
        try {
            // 未返却ログ検索
            const logQuery = query(
                collection(db, "logs"),
                where("student_id", "==", selectedUser),
                where("key_id", "==", selectedKey),
                where("returned_at", "==", null)
            );
            const logSnap = await getDocs(logQuery); // クエリ実行
            if (logSnap.empty) {
                setMessage("該当する貸出履歴が見つかりません");
                return;
            }
            // ログ更新
            const logDocRef = doc(db, "logs", logSnap.docs[0].id);
            await updateDoc(logDocRef, {returned_at: serverTimestamp(),});
            // 鍵状態更新
            const keyDocRef = doc(db, "keys", selectedKey);
            await updateDoc(keyDocRef, {status: "stored",});
            setMessage("返却が完了しました");
            await fetchData(); // データ更新
        } catch (e) {
            console.error(e);
            setMessage("返却処理に失敗しました");
        }
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 3000);
    };

    return (
        <>
            <Header title="鍵の返却ページ" />
            <div className="container">
                <h2>鍵返却画面</h2>
                {/* 利用者選択 */}
                <select onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="">利用者を選択</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.id} {user.name}
                        </option>
                    ))}
                </select>

                {/* 鍵選択 */}
                <select onChange={(e) => setSelectedKey(e.target.value)}>
                    <option value="">鍵を選択</option>
                    {keys.map((key) => (
                        <option key={key.id} value={key.id}>{key.name}</option>
                    ))}
                </select>

                <button onClick={handleReturn}>返却</button>
                {showPopup && (
                    <div className="borrow-popup">
                        {message}
                    </div>
                )}
                <div>
                    <button onClick={() => navigate("/")}>トップページに戻る</button>
                </div>
            </div>
        </>
    );
}

export default ReturnKeyPage;
