import axios from 'axios';

const URL = 'http://localhost:8080/brands';

export const fetchBrands = async (keyword: string = '') => {
  return (await axios.get(URL)).data;
};

export const fetchBrand = async(id: string) => {
  const url = `${URL}/${id}`;
  try {
    return (await axios.get(url)).data;
  } catch {
    throw new Error('GET Brand: Error');
  }
};

export const fetchTableBrands = async () => {
  const url = `${URL}/for-table`;

  return (await axios.get(url)).data;
};

export const deleteBrand = async (id: string) => {
  const url = `${URL}/${id}`;
  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Beader ${localStorage.getItem(
          'token'
        )}`
      },
    });

    return response.data;
  } catch {
    throw new Error('Delete Brand: Error');
  }
};

export const createBrand = async(brandName: string) => {
  try {
    const response = await axios.post(URL, { brandName }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    return response.data;
  } catch(err: any) {
    throw new Error(err);
  }
};

export const updateBrand = async(id: string, name: string) => {
  const url = `${URL}/${id}`;

  try {
    const response = await axios.put(url, { name }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    return response.data;
  } catch {
    return false;
  }
}

export const validateBrand = async(name: string) => {
  const url = `${URL}/validate`;
  try {
    return (await axios.post(url, { name })).data;
  } catch {
    return false;
  }
}