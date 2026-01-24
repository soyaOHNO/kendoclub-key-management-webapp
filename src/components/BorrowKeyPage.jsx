import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {collection, getDocs, addDoc, updateDoc, doc, serverTimestamp, } from "firebase/firestore";

function BorrowKeyPage() {
    const [users, setUsers] = useState([]);
    const [keys, setKeys] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedKey, setSelectedKey] = useState("");
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    // 利用者・鍵を取得
    const fetchData = async () => {
        const userSnap = await getDocs(collection(db, "users")); // DBの users コレクション
        // 利用者一覧をセット
        setUsers(userSnap.docs.map((doc) =>
                ({id: doc.id, ...doc.data(),})));
        const keySnap = await getDocs(collection(db, "keys")); // DBの keys コレクション
        // filterで保管中の鍵を抽出
        setKeys(keySnap.docs.map((doc) =>
                ({id: doc.id, ...doc.data(),})).filter((key) => key.status === "保管中"));
    };

    // 初回レンダリング時にデータ取得
    useEffect(() => {
        fetchData(); // 呼び出し(無名関数だから自分で呼び出す(可読性のため))
    }, []);

    const handleBorrow = async () => { // 鍵貸出処理
        if (!selectedUser || !selectedKey) {
            setMessage("利用者と鍵を選択してください");
            return;
        }
        try {
            await addDoc(collection(db, "logs"), {
                student_id: selectedUser,
                key_id: selectedKey,
                borrowed_at: serverTimestamp(),
                returned_at: null,
            });
            const keyRef = doc(db, "keys", selectedKey);
            await updateDoc(keyRef, {status: "貸出中",});
            setMessage("貸出完了");
            await fetchData(); // データ更新
        } catch (e) {
            console.error(e);
            setMessage("貸出処理に失敗しました");
        }
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 3000);
    };
    
    return (
        <div>
            <h2>鍵貸出</h2>
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

            <button onClick={handleBorrow}>貸出</button>
            {showPopup && (
                <div style={{
                    position: "fixed",
                    top: "20px",
                    right: "20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "12px 20px",
                    borderRadius: "6px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                }}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default BorrowKeyPage;
