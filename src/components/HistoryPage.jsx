import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import * as XLSX from "xlsx";
import {collection, getDocs,} from "firebase/firestore";

function HistoryPage() {
    const [logs, setLogs] = useState([]);

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
        <div>
        <h2>履歴一覧</h2>
        <button onClick={handleDownloadCSV}>CSV出力</button>
        <button onClick={handleDownloadExcel}>Excel出力</button>

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
