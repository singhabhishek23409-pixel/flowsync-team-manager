import axios from "axios";

const API = "https://daring-youth-production-230b.up.railway.app/api/auth";

export const registerUser = async (userData) => {

  const response = await axios.post(
    `${API}/signup`,
    userData
  );

  return response.data;

};

export const loginUser = async (userData) => {

  const response = await axios.post(
    `${API}/login`,
    userData
  );

  return response.data;

};