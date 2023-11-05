import React, { useState, useEffect, useCallback } from "react";
import { Table, Button } from "react-bootstrap";
import { useCommonData } from "../data/DataTypeMaps";
import axios from "axios";
import RecordModal from "./RecordModal";
import "../style/RecordPage.css";

interface Record {
  recordId?: number;
  recordType: string;
  recordCategory: string;
  paymentType: string;
  content: string;
  detail: string;
  amount: number;
  date: string;
  cardAlias?: string;
}

function RecordPage() {
  const [records, setRecords] = useState<Record[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("");
  const [originData, setOriginData] = useState<Record | null>(null);
  const { recordTypeMap, recordCategoryMap, paymentTypeMap } = useCommonData();

  const fetchData = useCallback(() => {
    fetch("http://localhost:8080/records")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: Record[]) => {
        setRecords(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRowClick = () => {
    alert("OK!");
  };

  const handleAddRecord = (record: Record) => {
    axios
      .post("http://localhost:8080/records", record)
      .then(() => {
        fetchData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateRecord = (record: Record) => {
    axios
      .post("http://localhost:8080/records/update", record)
      .then(() => {
        fetchData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteRecord = (recordId: number) => {
    axios
      .post(`http://localhost:8080/records/delete/${recordId}`)
      .then(() => {
        fetchData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddButtonClick = () => {
    setShowModal(true);
    setMode("add");
  };

  const handleUpdateButtonClick = (record: Record) => {
    setShowModal(true);
    setMode("update");
    setOriginData(record);
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 +1
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return (
    <div>
      <div className="top-menu">
        <div className="search-area">
          이곳에는 년도 월 선택 박스와 검색 버튼이 들어감
        </div>
        <div className="button-area">
          <Button variant="outline-info" onClick={() => handleAddButtonClick()}>
            추가
          </Button>
        </div>
      </div>
      <div className="content">
        {records ? (
          <Table striped bordered hover>
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>날짜</th>
                <th>구분</th>
                <th>카테고리</th>
                <th>내역</th>
                <th>비고</th>
                <th>결제구분</th>
                <th>금액</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr
                  key={index}
                  onClick={() => handleUpdateButtonClick(record)}
                  style={{ textAlign: "center" }}
                >
                  {/* min 106 */}
                  <td style={{ width: 110 }}>{formatDate(record.date)}</td>
                  {/* min 45 */}
                  <td style={{ width: 60 }}>
                    {recordTypeMap[record.recordType]}
                  </td>
                  {/* min 77 */}
                  <td style={{ width: 110 }}>
                    {recordCategoryMap[record.recordCategory]}
                  </td>
                  <td style={{ textAlign: "left" }}>{record.content}</td>
                  <td style={{ textAlign: "left" }}>{record.detail}</td>
                  <td style={{ width: 160 }}>
                    {record.paymentType === "CARD"
                      ? record.cardAlias
                      : paymentTypeMap[record.paymentType]}
                  </td>
                  <td style={{ width: 110, textAlign: "right" }}>
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

      <RecordModal
        key={originData ? originData.recordId : "add"}
        showModal={showModal}
        setShowModal={setShowModal}
        onAddRecord={handleAddRecord}
        onUpdateRecord={handleUpdateRecord}
        onDeleteRecord={handleDeleteRecord}
        mode={mode === "add" ? "add" : "update"}
        originData={originData}
        setOriginData={setOriginData}
      />
    </div>
  );
}

export default RecordPage;
