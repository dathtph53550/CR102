import axios from 'axios';

// Using local json-server
const API_URL = 'http://10.24.7.228:3000';

export const fetchXeMay = async () => {
  try {
    const response = await axios.get(`${API_URL}/XeMay`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const addXeMay = async (newXeMay) => {
  try {
    const response = await axios.post(`${API_URL}/XeMay`, newXeMay);
    return response.data;
  } catch (error) {
    console.error('Error adding motorcycle:', error);
    throw error;
  }
};

export const updateXeMay = async (id, updatedXeMay) => {
  try {
    // Đảm bảo id là string
    const idString = String(id);
    console.log('Updating motorcycle with ID:', idString);
    const response = await axios.put(`${API_URL}/XeMay/${idString}`, updatedXeMay);
    return response.data;
  } catch (error) {
    console.error('Error updating motorcycle:', error);
    throw error;
  }
};

export const deleteXeMay = async (id) => {
  try {
    // Đảm bảo id là string
    const idString = String(id);
    await axios.delete(`${API_URL}/XeMay/${idString}`);
    return idString;
  } catch (error) {
    console.error('Error deleting motorcycle:', error);
    throw error;
  }
}; 