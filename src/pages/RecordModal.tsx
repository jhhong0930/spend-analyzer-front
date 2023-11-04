import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useCommonData } from "../data/DataTypeMaps";

interface Record {
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
}

interface Card {
  cardId: number;
  cardAlias: string;
}

const RecordModal: React.FC<RecordModalProps> = ({
  showModal,
  setShowModal,
  onAddRecord,
}) => {
  const { recordTypeMap, recordCategoryMap, paymentTypeMap } = useCommonData();
  const [recordType, setRecordType] = useState<string>("");
  const [recordCategory, setRecordCategory] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("");
  const [cardId, setCardId] = useState<number | null>(null);
  const [content, setContent] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const today = new Date().toISOString().split("T")[0];
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

  const handleCloseModal = () => {
    setDate(today);
    setRecordType("");
    setRecordCategory("");
    setPaymentType("");
    setCardId(null);
    setContent("");
    setDetail("");
    setAmount(0);
    setShowModal(false);
  };

  const handleAddRecord = () => {
    const selectedDate = new Date(date);
    const now = new Date();
    const localDateTime = `${selectedDate.toISOString().split("T")[0]}T${
      now.toTimeString().split(" ")[0]
    }`;

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
    handleCloseModal();
  };

  return (
    <div>
      <Modal show={showModal} onHide={handleCloseModal} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>새 내역 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="date" style={{ paddingBottom: 10 }}>
              <Form.Label>날짜</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="recordType" style={{ paddingBottom: 10 }}>
              <Form.Label>지출/수입 구분</Form.Label>
              <Form.Control
                as="select"
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
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="detail" style={{ paddingBottom: 10 }}>
              <Form.Label>비고</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setDetail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="paymentType" style={{ paddingBottom: 10 }}>
              <Form.Label>결제방식</Form.Label>
              <Form.Control
                as="select"
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
                onChange={(e) => setAmount(parseInt(e.target.value, 10))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAddRecord}>
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
