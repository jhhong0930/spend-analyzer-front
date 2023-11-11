import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useCommonData } from "../data/DataTypeMaps";

interface Record {
  recordId?: number;
  recordType: string;
  recordCategory: string;
  paymentType: string;
  cardId?: number | null;
  content: string;
  detail: string;
  amount: number;
  date: string;
}

interface RecordModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onAddRecord: (record: Record) => void;
  onUpdateRecord: (record: Record) => void;
  onDeleteRecord: (recordId: number) => void;
  mode: "add" | "update";
  originData?: Record | null;
  setOriginData: React.Dispatch<React.SetStateAction<Record | null>>;
}

interface Card {
  cardId: number;
  cardAlias: string;
}

const RecordModal: React.FC<RecordModalProps> = ({
  showModal,
  setShowModal,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
  mode,
  originData,
  setOriginData,
}) => {
  const { recordTypeMap, recordCategoryMap, paymentTypeMap } = useCommonData();
  const [recordId, setRecordId] = useState<number | null>(null);
  const [recordType, setRecordType] = useState<string>("");
  const [recordCategory, setRecordCategory] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("");
  const [cardId, setCardId] = useState<number | null>(null);
  const [content, setContent] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const today = formatDate(undefined);
  const [date, setDate] = useState(today);
  const [cardList, setCardList] = useState<Card[]>([]);

  useEffect(() => {
    if (paymentType === "CARD") {
      fetch("http://localhost:8080/cards")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const cardList = data.map((card: Card) => ({
            cardId: card.cardId,
            cardAlias: card.cardAlias,
          }));
          setCardList(cardList);
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  }, [paymentType]);

  useEffect(() => {
    if (mode === "update" && originData) {
      setRecordId(originData.recordId || null);
      setRecordType(originData.recordType);
      setRecordCategory(originData.recordCategory);
      setPaymentType(originData.paymentType);
      setCardId(originData.cardId || null);
      setContent(originData.content);
      setDetail(originData.detail);
      setAmount(originData.amount);
      setDate(originData.date.split("T")[0]);
    }
  }, [mode, originData]);

  const handleCloseModal = () => {
    setRecordId(null);
    setRecordType("");
    setRecordCategory("");
    setPaymentType("");
    setCardId(null);
    setContent("");
    setDetail("");
    setAmount(0);
    setDate(today);
    setOriginData(null);

    setShowModal(false);
  };

  const handleConfirmRecord = () => {
    const localDateTime = formatDate(date);

    if (mode === "add") {
      const record: Record = {
        recordType,
        recordCategory,
        paymentType,
        cardId,
        content,
        detail,
        amount: amount || 0,
        date: localDateTime,
      };
      onAddRecord(record);
    } else if (mode === "update") {
      const record: Record = {
        recordId: recordId || 0,
        recordType,
        recordCategory,
        paymentType,
        cardId,
        content,
        detail,
        amount: amount || 0,
        date: localDateTime,
      };
      onUpdateRecord(record);
    }
    handleCloseModal();
  };

  const handleDeleteRecord = () => {
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (confirm) {
      onDeleteRecord(recordId || 0);
      handleCloseModal();
      alert("삭제 처리 되었습니다.");
    }
  };

  function formatDate(inputDate: string | undefined) {
    const selectedDate = inputDate ? new Date(inputDate) : new Date();
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = selectedDate.getDate().toString().padStart(2, "0");
    const hours = selectedDate.getHours().toString().padStart(2, "0");
    const minutes = selectedDate.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (!/^\d*$/.test(inputValue)) {
      alert("숫자만 입력할 수 있습니다!");
      return;
    }

    setAmount(inputValue === "" ? undefined : parseInt(inputValue, 10));
  };

  return (
    <div>
      <Modal show={showModal} onHide={handleCloseModal} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>
            {mode === "add" ? "새 내역 추가" : "내역 수정"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="date" style={{ paddingBottom: 10 }}>
              <Form.Label>날짜</Form.Label>
              <Form.Control
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="recordType" style={{ paddingBottom: 10 }}>
              <Form.Label>지출/수입 구분</Form.Label>
              <Form.Control
                as="select"
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
              >
                <option value="">선택하세요</option>
                {Object.keys(recordTypeMap).map((type) => (
                  <option key={type} value={type}>
                    {recordTypeMap[type]}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group
              controlId="recordCategory"
              style={{ paddingBottom: 10 }}
            >
              <Form.Label>카테고리</Form.Label>
              <Form.Control
                as="select"
                value={recordCategory}
                onChange={(e) => setRecordCategory(e.target.value)}
              >
                <option value="">선택하세요</option>
                {Object.keys(recordCategoryMap).map((type) => (
                  <option key={type} value={type}>
                    {recordCategoryMap[type]}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="content" style={{ paddingBottom: 10 }}>
              <Form.Label>내역</Form.Label>
              <Form.Control
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="detail" style={{ paddingBottom: 10 }}>
              <Form.Label>비고</Form.Label>
              <Form.Control
                type="text"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="paymentType" style={{ paddingBottom: 10 }}>
              <Form.Label>결제방식</Form.Label>
              <Form.Control
                as="select"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
              >
                <option value="">선택하세요</option>
                {Object.keys(paymentTypeMap).map((type) => (
                  <option key={type} value={type}>
                    {paymentTypeMap[type]}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {paymentType === "CARD" && (
              <Form.Group controlId="cardAlias" style={{ paddingBottom: 10 }}>
                <Form.Label>카드명</Form.Label>
                <Form.Control
                  as="select"
                  value={cardId || ""}
                  onChange={(e) => setCardId(parseInt(e.target.value, 10))}
                >
                  <option value="">선택하세요</option>
                  {cardList.map((card) => (
                    <option key={card.cardId} value={card.cardId}>
                      {card.cardAlias}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}

            <Form.Group controlId="amount">
              <Form.Label>금액</Form.Label>
              <Form.Control
                type="text"
                value={amount === undefined ? "" : amount}
                onChange={handleAmountChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {mode === "update" && (
            <Button variant="danger" onClick={handleDeleteRecord}>
              삭제
            </Button>
          )}
          <Button variant="primary" onClick={handleConfirmRecord}>
            저장
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            취소
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RecordModal;
