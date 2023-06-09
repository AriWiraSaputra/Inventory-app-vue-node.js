<template>
  <div>
    <h2>Form Customer</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label for="name">Nama Customer:</label>
        <input type="text" id="name" v-model="customer.name" required>
      </div>
      <div>
        <label for="contact">Kontak:</label>
        <input type="text" id="contact" v-model="customer.contact" required>
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="text" id="email" v-model="customer.email" required>
      </div>
      <div>
        <label for="address">Alamat:</label>
        <textarea id="address" v-model="customer.address" required class="custom-textarea"></textarea>
      </div>
      <div>
        <label for="discount">Diskon:</label>
        <input type="number" id="discount" v-model.number="customer.discount" min="0" required>
      </div>
      <div>
        <label for="discountType">Tipe Diskon:</label>
        <select id="discountType" v-model="customer.discountType" required>
          <option value="percentage">Persentase</option>
          <option value="fixed">Nilai Tetap</option>
        </select>
      </div>
      <div>
        <label for="ktp">KTP (Image):</label>
        <input type="file" id="ktp" @change="handleKTPChange" required>
      </div>
      <div>
        <button type="submit">Simpan</button>
      </div>
    </form>
    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <p>Data Anda sudah tersimpan</p>
        <button @click="hidePopup">Tutup</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CustomerForm',
  data() {
    return {
      showPopup: false,
      customer: {
        name: '',
        contact: '',
        email: '',
        address: '',
        discount: 0,
        discountType: 'percentage',
        ktp: null,
      },
    };
  },
  methods: {
    submitForm() {
      // Validasi nilai diskon
      if (this.customer.discount < 0) {
        alert('Nilai diskon tidak boleh negatif');
        return;
      }
      
      axios.post('http://localhost:3000/customers', this.customer)
        .then(response => {
          console.log(response.data);
          this.resetForm();
          this.showPopup = true;
        })
        .catch(error => {
          console.error(error);
        });
    },
    hidePopup() {
      // Fungsi untuk menyembunyikan popup
      this.showPopup = false;
    },
    handleKTPChange(event) {
      this.customer.ktp = event.target.files[0];
    },
    resetForm() {
      this.customer.name = '';
      this.customer.contact = '';
      this.customer.email = '';
      this.customer.address = '';
      this.customer.discount = 0;
      this.customer.discountType = 'percentage';
      const ktpInput = document.getElementById('ktp');
      ktpInput.value = null;
      this.customer.ktp = null;
    },
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
  font-size: 24px;
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
.custom-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input[type="text"],
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center; /* Menyatukan teks ke tengah secara horizontal */
}

input[type="number"],
input[type="file"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center; /* Menyatukan teks ke tengah secara horizontal */
}

button {
  background-color: #4caf50;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
  margin-top: 5px;
}

.success-message {
  color: green;
  margin-top: 5px;
  background-color: #d4edda;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #c3e6cb;
}

/* Tambahkan gaya untuk popup */
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  width: 300px;
  color: #fff;
  padding: 20px;
  border-radius: 5px;
  z-index: 999;
}

.popup-content {
  text-align: center;
}

.popup p {
  margin-bottom: 10px;
}

.popup button {
  background-color: #4caf50;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.popup button:hover {
  background-color: #45a049;
}
</style>

