export interface Auth {
  token?: string;
  authorities?: Array<string>;
  customerId?: string;
  exp?: number;
}
