import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function AdminPage() {
    const [mailaddress, setMailaddress] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
      if (!mailaddress || !password) {
        setMessage("メールアドレスとパスワードを入力してください");
        return;
      }

      try {
        await signInWithEmailAndPassword(auth, mailaddress, password);
        navigate("/logs");
      } catch (error) {
        console.error(error);
        setMessage("認証に失敗しました");
      }
    };

    return (
        <>
            <Header title="管理者ログインページ" />
            <div className="container">
                <h2>管理者ログイン</h2>

                <input
                    type="text"
                    placeholder="メールアドレス"
                    value={mailaddress}
                    onChange={(e) => setMailaddress(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={handleLogin}>ログイン</button>

                <p>{message}</p>
                <div>
                    <button onClick={() => navigate("/")}>トップページに戻る</button>
                </div>
            </div>
        </>
    );
}

export default AdminPage;
