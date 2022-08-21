export interface Term {
  session: string;
  term: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  currentTerm: Term;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Pagination {
  limit: number;
  page: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateAdmin extends LoginDto {
  name: string;
  currentTerm: Term;
}

export interface StudentBase {
  name: string;
  tuition: number;
}

export interface EditStudent extends StudentBase {
  amountPaid: number;
}

export interface CreateStudent extends StudentBase {
  className: string;
}

export interface CreateStudentDto extends StudentBase {
  classId: string;
}

export interface PaymentBase {
  amountPaid: number;
  currentTerm: Term;
}

export interface AddPayment extends PaymentBase {
  studentName: string;
  className: string;
}

export interface AddPaymentDto extends PaymentBase {
  studentId: string;
  classId: string;
}

export interface AddExpense {
  details: string;
  amountPaid: number;
  currentTerm: Term;
}
