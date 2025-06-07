const BASE_URL = 'https://api.example.com/vouchers'; // Replace with actual API URL

const getAuthToken = async () => {
  try {
    const token = localStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const getVouchers = async () => {
  const token = await getAuthToken();
  if (!token) throw new Error('No auth token found');

  // Mock response for demo (replace with actual API call)
  return [
    {
      _id: '1',
      name: 'Giảm giá 20% cho đơn đầu tiên',
      discount: '20%',
      minOrder: '100,000đ',
      expiryDate: 'HSD: 30/06/2025',
      image: null,
      status: 'approved',
    },
    {
      _id: '2',
      name: 'Ưu đãi cuối tuần',
      discount: '15%',
      minOrder: '200,000đ',
      expiryDate: 'HSD: 15/07/2025',
      image: 'https://via.placeholder.com/200x160',
      status: 'pending',
    },
  ];

  // Uncomment for actual API call
  /*
  const response = await fetch(`${BASE_URL}/my-vouchers`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch vouchers');
  }

  return response.json();
  */
};

export const createVoucher = async (voucher) => {
  const token = await getAuthToken();
  if (!token) throw new Error('No auth token found');

  // Mock response for demo
  console.log('Sending voucher creation request:', voucher);
  return { ...voucher, _id: `voucher_${Date.now()}` };

  // Uncomment for actual API call
  /*
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...voucher, status: 'pending' }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create voucher');
  }

  return response.json().then(res => res.voucher);
  */
};

export const updateVoucher = async (id, voucher) => {
  const token = await getAuthToken();
  if (!token) throw new Error('No auth token found');

  // Mock response for demo
  console.log('Sending voucher update request:', voucher);
  return voucher;

  // Uncomment for actual API call
  /*
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...voucher, status: 'pending' }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update voucher');
  }

  return response.json().then(res => res.voucher);
  */
};

export const deleteVoucher = async (id) => {
  const token = await getAuthToken();
  if (!token) throw new Error('No auth token found');

  // Mock response for demo
  console.log('Sending voucher deletion request:', id);
  return { success: true };

  // Uncomment for actual API call
  /*
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete voucher');
  }

  return response.json();
  */
};