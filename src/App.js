// // local build: > npm start
import React from "react";

// import ReturnKeyPage from "./components/ReturnKeyPage";

// function App() {
//   return (
//     <div style={{ padding: "20px" }}>
//       <ReturnKeyPage />
//     </div>
//   );
// }

// export default App;

// import BorrowKeyPage from "./components/BorrowKeyPage";

// function App() {
//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>鍵管理システム（テスト）</h1>

//       {/* S-02 鍵貸出画面のテスト */}
//       <BorrowKeyPage />
//     </div>
//   );
// }

// export default App;

import HistoryPage from "./components/HistoryPage";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>鍵管理システム（テスト）</h1>

      {/* S-02 鍵貸出画面のテスト */}
      <HistoryPage />
    </div>
  );
}

export default App;
