import axios from 'axios';

export const uploadCsvFile = async (file: File, apiUrl: string) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(apiUrl, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
