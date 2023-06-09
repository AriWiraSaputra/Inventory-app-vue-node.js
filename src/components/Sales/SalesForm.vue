<template>
  <div>
    <h2>Form Sales</h2>

    <!-- Button Tambah Customer -->
    <button @click="openCustomerFormModal">Tambah Customer</button>

    <div>
      <label for="codeTransaksi">Code Transaksi:</label>
      <input type="text" id="codeTransaksi" v-model="codeTransaksi" required>
    </div>
    <div>
      <label for="tanggalTransaksi">Tanggal Transaksi:</label>
      <input type="date" id="tanggalTransaksi" v-model="tanggalTransaksi" required>
    </div>
    <div>
      <label for="customer">Customer:</label>
      <select id="customer" v-model="selectedCustomer" required>
        <option v-for="customer in customers" :value="customer" :key="customer.id">{{ customer.name }}</option>
      </select>
    </div>

    <!-- Form Item -->
    <div>
      <label for="item">Item:</label>
      <select id="item" v-model="selectedItem" required>
        <option v-for="item in items" :value="item" :key="item.id">{{ item.name }}</option>
      </select>
    </div>
    <div>
      <label for="qty">Qty:</label>
      <input type="number" id="qty" v-model.number="quantity" required min="1">
    </div>
    <div>
      <button @click="addItem">Add Item</button>
    </div>

    <!-- List Item -->
    <div v-if="salesItems.length > 0">
      <h3>List Item:</h3>
      <ul >
        <li v-for="(item, index) in salesItems" :key="index">
          {{ item.name }} - Qty: {{ item.quantity }}
        </li>
      </ul>
    </div>

    <!-- Total Diskon, Harga, dan Bayar -->
    <div>
      <label for="totalDiscount">Total Diskon:</label>
      <input type="number" id="totalDiscount" v-model.number="totalDiscount" required min="0" readonly>
    </div>
    <div>
      <label for="totalPrice">Total Harga:</label>
      <input type="number" id="totalPrice" v-model.number="totalPrice" required min="0" readonly>
    </div>
    <div>
      <label for="totalPayment">Total Bayar:</label>
      <input type="number" id="totalPayment" v-model.number="totalPayment" required min="0">
    </div>

    <div>
      <button @click="saveSales">Simpan</button>
    </div>

    <div v-if="isDataSaved" class="success-message">
      Data telah tersimpan.
    </div>

    <!-- Modal Customer Form -->
    <div v-if="isCustomerFormModalOpen" class="modal">
      <div class="modal-content">
        <h2>Form Customer</h2>
        <customer-form @submit="saveCustomer"></customer-form>
        <button @click="closeCustomerFormModal">Tutup</button>
      </div>
    </div>
  </div>
</template>


<script>
import CustomerForm from '../Customer/CustomerForm.vue';

import axios from 'axios';

export default {
  name: 'SalesForm',
  components: {
    CustomerForm,
  },
  data() {
    return {
      codeTransaksi: '',
      tanggalTransaksi: '',
      selectedCustomer: {
        discountType: '', // Inisialisasi discountType dengan nilai default
        discount: ''
      },
      selectedItem: '',
      quantity: 1,
      salesItems: [],
      totalDiscount: 0,
      totalPrice: 0,
      totalPayment: 0,
      isDataSaved: false,
      isCustomerFormModalOpen: false,
      items: [], 
      customers: []
    };
  },
  methods: {
    
    addItem() {
  console.log('selectedItem:', this.selectedItem);
  console.log('items:', this.items);

  // Pastikan this.quantity memiliki nilai numerik yang valid
  if (isNaN(this.quantity) || this.quantity <= 0) {
    // Tampilkan pesan kesalahan atau ambil tindakan yang sesuai sesuai kebutuhan Anda
    return;
  }

  // Pastikan selectedItem sudah memiliki nilai sebelum mengakses propertinya
  if (this.selectedItem) {
    console.log('selectedItem name:', this.selectedItem.name);

    // Periksa jika jumlah melebihi stok yang tersedia
    if (this.quantity > this.selectedItem.stock) {
      alert('Jumlah tidak valid.');
      return;
    }

    // Kurangi stok item berdasarkan jumlah yang diambil
    this.selectedItem.stock -= this.quantity;

    // Tambahkan item ke salesItems dengan jumlah yang ditentukan
    this.salesItems.push({
      codeTransaksi: this.codeTransaksi,
      tanggalTransaksi: this.tanggalTransaksi,
      customer: { ...this.selectedCustomer },
      id: this.selectedItem.id,
      name: this.selectedItem.name,
      quantity: this.quantity,
      price: this.selectedItem.price
    });

    // Reset pemilihan item
    this.selectedItem = null;
    this.quantity = 1; // Reset nilai quantity ke nilai awal

    // Hitung ulang Total Harga dan Total Diskon
    this.calculateTotals();
  } else {
    alert('Item yang dipilih tidak ditemukan.');
  }
},

    calculateTotals() {
  // Hitung ulang Total Harga
  this.totalPrice = this.salesItems.reduce((total, item) => {
    const selectedItem = this.items.find(i => i.id === item.id);
    if (selectedItem && !isNaN(selectedItem.price)) {
      // Harga item adalah angka yang valid, lakukan perhitungan
      return total + selectedItem.price * item.quantity;
    } else {
      // Harga item tidak valid, lakukan tindakan yang sesuai (misalnya, lewati item atau set harga item ke nilai default)
      return total;
    }
  }, 0);

  // Hitung total diskon berdasarkan item dan customer
  let totalDiscount = 0;

  this.salesItems.forEach(item => {
    const selectedItem = this.items.find(i => i.id === item.id);
    if (selectedItem && !isNaN(selectedItem.price)) {
      const itemDiscount = parseFloat(item.customer.discount); // Ubah item.discount menjadi item.customer.discount
      if (!isNaN(itemDiscount)) {
        // Nilai diskon adalah angka yang valid
        const itemPrice = selectedItem.price * item.quantity;
        totalDiscount += (itemPrice * itemDiscount) / 100;
      }
    }
  });

  if (this.selectedCustomer.discountType === 'percentage') { // Ubah this.customer menjadi this.selectedCustomer
    const discountPercentage = parseFloat(this.selectedCustomer.discount); // Ubah this.customer.discount menjadi this.selectedCustomer.discount
    if (!isNaN(discountPercentage)) {
      // Nilai diskon adalah angka yang valid
      const customerDiscount = (this.totalPrice * discountPercentage) / 100;
      totalDiscount += customerDiscount;
    }
  } else if (this.selectedCustomer.discountType === 'amount') { // Ubah this.customer menjadi this.selectedCustomer
    const discountAmount = parseFloat(this.selectedCustomer.discount); // Ubah this.customer.discount menjadi this.selectedCustomer.discount
    if (!isNaN(discountAmount)) {
      // Nilai diskon adalah angka yang valid
      totalDiscount += discountAmount;
    }
  }

  // Hitung ulang Total Diskon
  this.totalDiscount = totalDiscount;

  // Hitung ulang Total Bayar
  this.totalPayment = this.totalPrice - this.totalDiscount;
},




    saveSales() {
      // Simpan data sales ke server
      const salesData = {
        codeTransaksi: this.codeTransaksi,
        tanggalTransaksi: this.tanggalTransaksi,
        customer: this.selectedCustomer,
        salesItems: this.salesItems,
        totalDiscount: this.totalDiscount,
        totalPrice: this.totalPrice,
        totalPayment: this.totalPayment,
        
      };

      axios.post('http://localhost:3000/sales', salesData)
        .then(response => {
          console.log(response.data);
          this.isDataSaved = true;
        })
        .catch(error => {
          console.error(error);
        });
        // Simpan perubahan nilai stok dari formItem ke server
      this.items.forEach(item => {
        console.log('Nilai item.stock:', item.stock);
        console.log('Nilai item.stock:', item.quantity);
        // Perbarui nilai stock pada objek item
        const itemToUpdate = {

          id: item.id,
          name: item.name,
          stock: item.stock - item.quantity,
         

          // ... sertakan properti lainnya yang mungkin diperlukan
        };

        // Lakukan permintaan PUT untuk memperbarui item
        console.log('nilai ini bro:',itemToUpdate.stock);

        axios.put(`http://localhost:3000/items/${itemToUpdate.stock}`, itemToUpdate)
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      });
      
    },
    openCustomerFormModal() {
      this.isCustomerFormModalOpen = true;
    },
    closeCustomerFormModal() {
      this.isCustomerFormModalOpen = false;
    },
    saveCustomer(customerData) {
        // Simpan data customer ke server
    axios.post('http://localhost:3000/customers', customerData)
      .then(response => {
        console.log(response.data);
        this.customers.push(response.data); // Menambahkan data pelanggan baru ke dalam list
        this.isCustomerFormModalOpen = false; // Tutup modal setelah data customer tersimpan

        // Ambil nilai diskon dari customerData yang dikirimkan dari form customer
        this.selectedCustomer = {
        discountType: customerData.discountType,
        discount: customerData.discount,
      };



        // Hitung ulang Total Harga dan Total Diskon
        this.calculateTotals();
    })
    .catch(error => {
      console.error(error);
        });
    },
  },
  mounted() {
    // Ambil data items dari server saat komponen dimuat
    axios.get('http://localhost:3000/items')
      .then(response => {
        this.items = response.data;
      })
      .catch(error => {
        console.error(error);
      });
      
    // Ambil data customer dari server saat komponen dimuat
    axios.get('http://localhost:3000/customers')
      .then(response => {
        this.customers = response.data;
      })
      .catch(error => {
        console.error(error);
      });
    
    
  },
};
</script>

<style>
/* Styling form dan popup sama seperti sebelumnya */
</style>

<style>
form {
  display: grid;
  gap: 10px;
  max-width: 400px;
  margin: 0 auto;
  justify-items: center;
  text-align: center;
  background-color: #f2f2f2;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  padding: 10px;
  margin-top: 20px;
  border-radius: 5px;
}

.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 400px;
  border-radius: 5px;
}

.modal-content h2 {
  margin-top: 0;
  color: #333;
}
</style>
