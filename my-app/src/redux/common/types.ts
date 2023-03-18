import { StatusEnum } from 'redux/constant';

export interface CommonState {
  error?: string;
  status: StatusEnum;
}
