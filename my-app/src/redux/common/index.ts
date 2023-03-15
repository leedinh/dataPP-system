import { StatusEnum } from 'redux/constant';

export const stateLoading = (state: any) => {
  state.status = StatusEnum.LOADING;
  state.error = undefined;
};

export const stateError = (state: any, msgError: string) => {
  state.status = StatusEnum.FAILED;
  state.error = msgError;
};

export const stateSucceeded = (state: any) => {
  state.status = StatusEnum.SUCCEEDED;
  state.error = undefined;
};
