import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {
    const navigate = useNavigate();

    return (
        <header className="app-header">
        <button onClick={() => navigate("/admin")}>管理者ページ</button>

        <h1 className="header-title">{title}</h1>

        {/* 右側ダミー（中央寄せ用） */}
        <div className="header-right" />
        </header>
    );
};

export default Header;
