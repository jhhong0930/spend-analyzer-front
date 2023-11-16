import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { useCommonData } from "../data/DataTypeMaps";
import RecordModal from "./RecordModal";
import "../style/RecordPage.css";
import api from "../api";

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

interface SearchRecordRequest {
  recordType?: string;
  recordCategory?: string;
  paymentType?: string;
  cardId?: number;
  start?: string;
  end?: string;
}

interface RecordPageProps {}

const RecordPage: React.FC<RecordPageProps> = () => {
  const defaultStartDate = formatSearchStartDate();
  const defaultEndDate = formatSearchEndDate();

  function formatSearchStartDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const firstDay = new Date(year, date.getMonth(), 1);
    const firstDayFormatted = firstDay.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${firstDayFormatted}T00:00`;
  }

  function formatSearchEndDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const lastDay = new Date(year, date.getMonth() + 1, 0);
    const lastDayFormatted = lastDay.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${lastDayFormatted}T23:59`;
  }

  const [records, setRecords] = useState<Record[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("");
  const [originData, setOriginData] = useState<Record | null>(null);
  const { recordTypeMap, recordCategoryMap, paymentTypeMap } = useCommonData();

  const [tempSearchStartDate, setTempSearchStartDate] =
    useState<string>(defaultStartDate);
  const [tempSearchEndDate, setTempSearchEndDate] =
    useState<string>(defaultEndDate);
  const [searchStartDate, setSearchStartDate] =
    useState<string>(tempSearchStartDate);
  const [searchEndDate, setSearchEndDate] = useState<string>(tempSearchEndDate);

  const fetchData = useCallback(
    ({
      searchStartDate,
      searchEndDate,
    }: {
      searchStartDate: string;
      searchEndDate: string;
    }) => {
      const searchRecordRequest: SearchRecordRequest = {};

      if (searchStartDate) {
        searchRecordRequest.start = searchStartDate;
      }

      if (searchEndDate) {
        searchRecordRequest.end = searchEndDate;
      }

      api
        .post("/records/list", searchRecordRequest)
        .then((response) => {
          setRecords(response.data);
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    []
  );

  useEffect(() => {
    fetchData({
      searchStartDate,
      searchEndDate,
    });
  }, [fetchData, searchEndDate, searchStartDate]);

  const handleAddRecord = (record: Record) => {
    api
      .post("/records", record)
      .then(() => {
        fetchData({
          searchStartDate,
          searchEndDate,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateRecord = (record: Record) => {
    api
      .post("/records/update", record)
      .then(() => {
        fetchData({
          searchStartDate,
          searchEndDate,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteRecord = (recordId: number) => {
    api
      .post(`/records/delete/${recordId}`)
      .then(() => {
        fetchData({
          searchStartDate,
          searchEndDate,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearchButtonClick = () => {
    setSearchStartDate(tempSearchStartDate);
    setSearchEndDate(tempSearchEndDate);
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
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");

    return `${year}.${month}.${day} ${hour}:${minute}`;
  }

  return (
    <div>
      <div className="top-menu">
        <div className="search-area">
          <Form.Control
            type="datetime-local"
            value={tempSearchStartDate}
            onChange={(e) => setTempSearchStartDate(e.target.value)}
            className="search-form"
          />
          <Form.Control
            type="datetime-local"
            value={tempSearchEndDate}
            onChange={(e) => setTempSearchEndDate(e.target.value)}
            className="search-form"
          />
          <Button
            variant="outline-secondary"
            onClick={() => handleSearchButtonClick()}
          >
            검색
          </Button>
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
                  <td style={{ width: 145, minWidth: 145 }}>
                    {formatDate(record.date)}
                  </td>
                  {/* min 45 */}
                  <td style={{ width: 60, minWidth: 60 }}>
                    {recordTypeMap[record.recordType]}
                  </td>
                  {/* min 77 */}
                  <td style={{ width: 110, minWidth: 110 }}>
                    {recordCategoryMap[record.recordCategory]}
                  </td>
                  <td style={{ textAlign: "left" }}>{record.content}</td>
                  <td style={{ textAlign: "left" }}>{record.detail}</td>
                  <td style={{ width: 160, minWidth: 160 }}>
                    {record.paymentType === "CARD"
                      ? record.cardAlias
                      : paymentTypeMap[record.paymentType]}
                  </td>
                  <td
                    className={
                      record.recordType === "EXPENSE"
                        ? "record-type-expense"
                        : "record-type-income"
                    }
                  >
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
};

export default RecordPage;
