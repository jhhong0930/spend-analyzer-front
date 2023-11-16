import React from "react";
import { Link } from "react-router-dom";

function SideMenu() {
  // TODO 스타일 개선 필요
  return (
    <div>
      <li>
        <Link to="/">메인</Link>
      </li>
      <li>
        <Link to="/card">내 카드 관리</Link>
      </li>
      <li>
        <Link to="/record">내역 보기</Link>
      </li>
      <li>메뉴4</li>
    </div>
  );
}

export default SideMenu;
