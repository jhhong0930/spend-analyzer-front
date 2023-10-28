import React, { createContext, useContext, ReactNode } from "react";

interface CommonData {
  recordTypeMap: RecordTypeMap;
  expenseTypeMap: ExpenseTypeMap;
  incomeTypeMap: IncomeTypeMap;
  paymentTypeMap: PaymentTypeMap;
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

interface PaymentTypeMap {
  [key: string]: string;
}

export const CommonDataContext = createContext<CommonData | undefined>(
  undefined
);

interface CommonDataProviderProps {
  children: ReactNode;
}

export const CommonDataProvider: React.FC<CommonDataProviderProps> = ({
  children,
}) => {
  const commonData: CommonData = {
    recordTypeMap: {
      EXPENSE: "지출",
      INCOME: "수입",
    },
    expenseTypeMap: {
      MEAL: "식비",
      DAILY_NECESSARIES: "일상용품",
      SHOPPING: "쇼핑",
      CULTURE: "문화생활",
      HEALTH: "건강",
      EDUCATION: "교육",
      TRAFFIC: "교통/차량",
      MOBILE: "통신",
      SAVING: "예적금",
      EVENT: "경조사",
      ETC: "기타",
    },
    incomeTypeMap: {
      SALARY: "급여",
      BONUS: "상여",
      ADDITIONAL_INCOME: "부수입",
      ALLOWANCE: "용돈",
      ETC: "기타",
    },
    paymentTypeMap: {
      CARD: "카드",
      TRANSFER: "계좌 이체",
      CASH: "현금",
      ETC: "기타",
    },
  };

  return (
    <CommonDataContext.Provider value={commonData}>
      {children}
    </CommonDataContext.Provider>
  );
};

export function useCommonData() {
  const context = useContext(CommonDataContext);
  if (context === undefined) {
    throw new Error("useCommonData must be used within a CommonDataProvider");
  }
  return context;
}
