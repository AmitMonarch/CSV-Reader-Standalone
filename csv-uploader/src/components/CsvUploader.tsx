import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Form } from 'react-bootstrap';
import styled from 'styled-components';
import { FaCloudUploadAlt } from 'react-icons/fa';

// Styled components
const StyledContainer = styled(Container)`
  max-width: 100%;
  margin-top: 50px;
  text-align: center;
`;

const UploadButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1.2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #4a90e2;
  margin-bottom: 20px;
`;

const CategoriesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Three equal columns */
  gap: 20px; /* Space between items */
  margin-top: 20px;
  max-height: 80vh; /* Limit height for scrolling */
  overflow-y: auto; /* Enable vertical scrolling */
`;

const NameCard = styled.div`
  background-color: #e7f3fe;
  border: 1px solid #c1e1fb;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px; /* Remove margin to avoid space after categories */
  height: 60px; /* Fixed height */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* Prevent overflow */
  white-space: nowrap; /* Prevent text from wrapping */
  text-overflow: ellipsis; /* Add ellipsis if text is too long */
  position: relative; /* Positioning for tooltip */
  transition: background-color 0.3s;

  &:hover {
    background-color: #d1e7ff; /* Change background color on hover */
  }

  &::after {
    content: attr(data-fulltext); /* Tooltip content */
    position: absolute;
    bottom: 100%; /* Position above the card */
    left: 50%;
    transform: translateX(-50%);
    visibility: hidden; /* Hide by default */
    opacity: 0; /* Transparent by default */
    background-color: #333; /* Tooltip background */
    color: white;
    text-align: center;
    border-radius: 4px;
    padding: 5px;
    white-space: nowrap;
    transition: opacity 0.3s;
    z-index: 1;
  }

  &:hover::after {
    visibility: visible; /* Show on hover */
    opacity: 1; /* Fully visible */
  }
`;

interface CsvUploaderProps {
  apiUrl: string;
}

const CsvUploader: React.FC<CsvUploaderProps> = ({ apiUrl }) => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
    }
  };

  return (
    <StyledContainer>
      <Title>CSV Uploader</Title>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Select a CSV File</Form.Label>
        <Form.Control type="file" accept=".csv" onChange={handleFileChange} />
      </Form.Group>
      <UploadButton>
        <Button variant="primary" onClick={handleUpload}>
          <FaCloudUploadAlt /> Upload and Process
        </Button>
      </UploadButton>

      {data.length > 0 && (
        <CategoriesContainer>
          {data.map((categoryData, index) => (
            <div key={index}>
              <h5 style={{ margin: '0 0 10px' }}>{categoryData.category}</h5>
              <div>
                {categoryData.names.map((name: string, idx: number) => (
                  <NameCard key={idx} data-fulltext={name}>
                    {name}
                  </NameCard>
                ))}
              </div>
            </div>
          ))}
        </CategoriesContainer>
      )}
    </StyledContainer>
  );
};

export default CsvUploader;
