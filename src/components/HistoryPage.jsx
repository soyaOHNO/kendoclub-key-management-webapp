import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import * as XLSX from "xlsx";
import {collection, getDocs, deleteDoc, doc, setDoc} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function HistoryPage() {
    const [logs, setLogs] = useState([]);
    const navigate = useNavigate();
    const [excelFile, setExcelFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("");


    const createCSV = () => {
        const header = ["利用者", "鍵", "貸出日時", "返却日時"];

        const rows = logs.map(log => [
            log.studentName,
            log.keyName,
            log.borrowed_at ? log.borrowed_at.toDate().toLocaleString() : "",
            log.returned_at ? log.returned_at.toDate().toLocaleString() : "貸出中",
        ]);
        const csvContent = [header.join(","), ...rows.map(row => row.join(",")), ].join("\n");
        return csvContent;
    };

    const handleDownloadCSV = () => {
        const csv = createCSV();
        const bom = "\uFEFF";
        const blob = new Blob([bom + csv], {type: "text/csv;charset=utf-8;",});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // ファイル名（日時付き）
        link.download = `岡山大学剣道部_鍵利用_${new Date().toISOString()}.csv`;

        link.click();
        URL.revokeObjectURL(url);
    };

    const handleDownloadExcel = () => {
        // シートにするデータ作成
        const sheetData = logs.map(log => ({
            利用者: log.studentName,
            鍵: log.keyName,
            貸出日時: log.borrowed_at ? log.borrowed_at.toDate().toLocaleString() : "",
            返却日時: log.returned_at ? log.returned_at.toDate().toLocaleString() : "貸出中",
        }));
        // ワークシート作成
        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        // ワークブック作成
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "貸出履歴");
        // ファイル出力
        XLSX.writeFile(workbook, `岡山大学剣道部_鍵利用_${new Date().toISOString()}.xlsx`);
    };

    const deleteAllUsers = async () => {
        const snap = await getDocs(collection(db, "users"));
        for (const d of snap.docs) {
            await deleteDoc(doc(db, "users", d.id));
        }
    };


    const handleUploadUsers = async () => {
        if (!excelFile) {
            setUploadMessage("Excelファイルを選択してください");
            return;
        }

        try {
            setUploadMessage("既存ユーザーを削除中...");
            // ① users全削除
            await deleteAllUsers();
            setUploadMessage("既存ユーザーを削除しました。Excelを処理中...");
            const data = await excelFile.arrayBuffer();
            const workbook = XLSX.read(data);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            const rows = XLSX.utils.sheet_to_json(sheet);

            let count = 0;

            for (const row of rows) {
            // 削除フラグが1の行は無視
            if (row["削除(誤って登録した場合に1を記入)"] === 1 || row["削除(誤って登録した場合に1を記入)"] === "1") continue;

            const studentId = String(row["学生番号"]);
            const name = row["氏名"];

            if (!studentId || !name) continue;

            await setDoc(
                doc(db, "users", studentId),
                { name },
                { merge: true }
            );

            count++;
            }

            setUploadMessage(`${count} 件の利用者を登録・更新しました`);
        } catch (e) {
            console.error(e);
            setUploadMessage("Excelの処理に失敗しました");
        }
    };



    useEffect(() => {
        // 利用者・鍵・ログを取得
        const fetchData = async () => {
            const userSnap = await getDocs(collection(db, "users")); // DBの users コレクション
            // 利用者一覧をセット
            const keySnap = await getDocs(collection(db, "keys")); // DBの keys コレクション
            // 鍵一覧をセット
            // 利用者・鍵の名前を紐付けるためにマップを作成
            const userMap = {};
            const keyMap = {};
            userSnap.docs.forEach(doc => {userMap[doc.id] = doc.data().name;});
            keySnap.docs.forEach(doc => {keyMap[doc.id] = doc.data().name;});
            // ログ一覧をセット
            const logsSnap = await getDocs(collection(db, "logs"));
            const logs = logsSnap.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    studentName: userMap[data.student_id] ?? "不明",
                    keyName: keyMap[data.key_id] ?? "不明",
                    borrowed_at: data.borrowed_at,
                    returned_at: data.returned_at,
                };
            });
            // 返却日時で降順ソート（未返却は先頭）
            logs.sort((a, b) => {
                if (!a.returned_at) return -1;
                if (!b.returned_at) return 1;
                return b.returned_at.toMillis() - a.returned_at.toMillis();
            });
            setLogs(logs);
        };
        fetchData();
    }, []);


    return (
        <div className="container">
        <h2>履歴一覧</h2>
        <button onClick={handleDownloadCSV}>CSV出力</button>
        <button onClick={handleDownloadExcel}>Excel出力</button>
        <div>
            <button onClick={() => navigate("/")}>トップページに戻る</button>
        </div>

        <h3>利用者一括登録（Excel）</h3>

        <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setExcelFile(e.target.files[0])}
        />
        <button onClick={handleUploadUsers}>Firestoreに反映</button>
        <p>{uploadMessage}</p>
        <hr />

        <table border="1">
            <thead>
            <tr>
                <th>利用者</th>
                <th>鍵</th>
                <th>貸出日時</th>
                <th>返却日時</th>
            </tr>
            </thead>
            <tbody>
                {logs.map(log => (
                    <tr key={log.id}>
                        <td>{log.studentName}</td>
                        <td>{log.keyName}</td>
                        <td>{log.borrowed_at?.toDate().toLocaleString()}</td>
                        <td>{log.returned_at ? log.returned_at.toDate().toLocaleString() : "未返却"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
}

export default HistoryPage;
