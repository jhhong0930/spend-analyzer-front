import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { useCommonData } from "../data/DataTypeMaps";

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

function RecordPage() {
  const [records, setRecords] = useState<Record[] | null>(null);
  const { recordTypeMap, expenseTypeMap, incomeTypeMap, paymentTypeMap } =
    useCommonData();

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
