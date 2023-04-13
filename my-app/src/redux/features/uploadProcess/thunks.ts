import { createAsyncThunk } from "@reduxjs/toolkit";
import { uploadFile, updateInfo } from "redux/common/fetch";


export const uploadDatasetThunk = createAsyncThunk(
  "uploadDataset",
  async (request: any) => {
    
    return uploadFile("/api/upload", request).then((res: any) => res.json());
  }
);

export const updateinfoThunk = createAsyncThunk(
  "updateDataset",
  async (request: any) => {
    
    return updateInfo(`/api/update_info/${request.fileid}`, request).then((res: any) => res.json());
  }
);
