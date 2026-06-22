const API_URL = 'http://localhost:5000/api';

async function testAddProduct() {
  try {
    console.log('Logging in as admin...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ganesh739825@gmail.com',
        password: 'adming@18'
      })
    });

    if (!loginRes.ok) {
      const errText = await loginRes.text();
      throw new Error(`Login failed (${loginRes.status}): ${errText}`);
    }

    const { token } = await loginRes.json();
    console.log('Login successful, token retrieved.');

    console.log('Preparing multipart/form-data for product creation...');
    const formData = new FormData();
    formData.append('name', 'Test CLI Product');
    formData.append('description', 'Created via programmatic test script');
    formData.append('price', '150');
    formData.append('category', 'Electronics');
    formData.append('stock', '25');
    formData.append('discount', '10');

    // Create a dummy image file/blob
    const blob = new Blob(['dummy image content'], { type: 'image/png' });
    formData.append('image', blob, 'test_image.png');

    console.log('Sending POST request to create product...');
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    console.log('Response Status:', res.status);
    const data = await res.json();
    console.log('Response Data:', data);
  } catch (err) {
    console.error('Error running test:', err);
  }
}

testAddProduct();
