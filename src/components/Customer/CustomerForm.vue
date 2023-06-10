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
import '@/components/style.css';

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

