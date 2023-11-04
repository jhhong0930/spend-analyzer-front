import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useCommonData } from "../data/DataTypeMaps";

interface Record {
  recordId: number;
  recordType: string;
  recordCategory: string;
  paymentType: string;
  cardId: number;
  content: string;
  detail: string;
  amount: number;
  date: string;
  cardAlias: string;
}

interface RecordModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  handleAddRecord: (record: Record) => void;
}

const RecordModal: React.FC<RecordModalProps> = ({
  showModal,
  setShowModal,
  handleAddRecord,
}) => {
  const { recordTypeMap, recordCategoryMap, paymentTypeMap } = useCommonData();
  const [recordId, setRecordId] = useState<number>();
  const [recordType, setRecordType] = useState<string>("");
  const [recordCategory, setRecordCategory] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("");
  const [cardId, setCardId] = useState<number>();
  const [content, setContent] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [amount, setAmount] = useState<number>();
  const [date, setDate] = useState<string>("");
  const [cardAlias, setCardAlias] = useState<string>("");

  return <div>hello</div>;
};
