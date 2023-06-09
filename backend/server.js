const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000; // Ganti dengan port yang sesuai

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tambahkan kode untuk endpoint dan routing di sini
let items = [];
let customers = [];
let sales = [];

// Module Item
app.get('/items', (req, res) => {
  res.json(items);
});

app.post('/items', (req, res) => {
  const newItem = req.body;
  items.push(newItem);
  res.json(newItem);
});

app.put('/items/:itemId', (req, res) => {
  const itemId = req.params.itemId.toString();
  const updatedItem = req.body;

  // Cari item berdasarkan ID
  const itemIndex = items.findIndex(item => item.id === itemId);
  if (itemIndex !== -1) {
    // Update nilai stock berdasarkan quantity di form sales
    const itemToUpdate = items[itemIndex];
    itemToUpdate.stock -= updatedItem.quantity;

    // Update properti lainnya jika perlu
    // itemToUpdate.propertiLain = updatedItem.propertiLain;

    // Update item di koleksi
    items[itemIndex] = itemToUpdate;

    // Kirimkan respons dengan item yang diperbarui
    res.json(itemToUpdate);
  } else {
    // Jika item tidak ditemukan, kirimkan respons error
    res.status(404).json({ error: 'Item not found' });
  }
});



// Module Customer
app.get('/customers', (req, res) => {
  res.json(customers);
});

app.post('/customers', (req, res) => {
  const newCustomer = req.body;
  customers.push(newCustomer);
  res.json(newCustomer);
});

// Module Sales
app.get('/sales', (req, res) => {
  res.json(sales);
});

app.post('/sales', (req, res) => {
  const newSale = req.body;
  // Lakukan perhitungan total harga dan total diskon di sini
  sales.push(newSale);
  res.json(newSale);
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
