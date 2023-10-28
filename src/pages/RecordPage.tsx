import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";

interface Record {
  recordId: number;
  recordType: string;
  expenseType: string;
  incomeType: string;
  paymentType: string;
  cardId: number;
  content: string;
  detail: string;
  amount: number;
  date: string;
}

interface RecordTypeMap {
  [key: string]: string;
}

interface ExpenseTypeMap {
  [key: string]: string;
}

interface IncomeTypeMap {
  [key: string]: string;
}

interface paymentTypeMap {
  [key: string]: string;
}

function RecordPage() {
  const [records, setRecords] = useState<Record[] | null>(null);

  const recordTypeMap: RecordTypeMap = {
    EXPENSE: "지출",
    INCOME: "수입",
  };

  const expenseTypeMap: ExpenseTypeMap = {
    MEAL: "식비",
    DAILY_NECESSARIES: "일상 용품",
    SHOPPING: "쇼핑",
    CULTURE: "문화 생활",
    HEALTH: "건강",
    EDUCATION: "교육",
    TRAFFIC: "교통/차량",
    MOBILE: "통신",
    SAVING: "예적금",
    EVENT: "경조사",
    ETC: "기타",
  };

  const incomeTypeMap: IncomeTypeMap = {
    SALARY: "급여",
    BONUS: "상여",
    ADDITIONAL_INCOME: "부수입",
    ALLOWANCE: "용돈",
    ETC: "기타",
  };

  const paymentTypeMap: paymentTypeMap = {
    CARD: "카드",
    TRANSFER: "계좌 이체",
    CASH: "현금",
    ETC: "기타",
  };

  useEffect(() => {
    // 데이터를 받아오는 부분
    fetch("http://localhost:8080/records")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // JSON 데이터로 파싱
      })
      .then((data: Record[]) => {
        // 받아온 데이터를 Record 인터페이스로 저장
        setRecords(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  const handleRowClick = () => {
    alert("OK!");
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 +1
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return (
    <div style={{ padding: "20px" }}>
      {records ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              {/* {Object.keys(records[0])
                .filter((key) => key !== excludedField) // 필드 제외
                .map((key) => (
                  <th key={key}>{key}</th>
                ))} */}
              <th>날짜</th>
              <th>지출/입금 구분</th>
              <th>소비/수입 타입</th>
              <th>결제구분</th>
              <th>내역</th>
              <th>비고</th>
              <th>금액</th>
            </tr>
          </thead>
          <tbody>
            {/* {records.map((record, rowIndex) => (
              <tr key={rowIndex} onClick={() => handleRowClick()}>
                {Object.entries(record)
                  .filter(([key]) => key !== excludedField) // 필드 제외
                  .map(([key, value], cellIndex) => (
                    <td key={cellIndex} style={{ textAlign: "left" }}>
                      {value}
                    </td>
                  ))}
              </tr>
            ))} */}
            {records.map((record, index) => (
              <tr key={index} onClick={() => handleRowClick()}>
                <td>{formatDate(record.date)}</td>
                <td>{recordTypeMap[record.recordType]}</td>
                <td>
                  {record.recordType === "EXPENSE"
                    ? expenseTypeMap[record.expenseType] || "?"
                    : incomeTypeMap[record.incomeType] || "?"}
                </td>
                <td>{paymentTypeMap[record.paymentType]}</td>
                <td style={{ textAlign: "left" }}>{record.content}</td>
                <td style={{ textAlign: "left" }}>{record.detail}</td>
                <td style={{ textAlign: "right" }}>
                  {record.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default RecordPage;
