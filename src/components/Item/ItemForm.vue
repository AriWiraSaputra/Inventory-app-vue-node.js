<template>
  <div>
    <h2>Form Item</h2>
    <form @submit.prevent="submitForm" class="form-item">
      <div>
        <label for="name">Nama Item:</label>
        <input type="text" id="name" v-model="item.name" required autocomplete="name">
      </div>
      <div>
        <label for="unit">Unit:</label>
        <select id="unit" v-model="item.unit" required autocomplete="unit">
          <option value="kg">Kg</option>
          <option value="pcs">Pcs</option>
        </select>
      </div>
      <div>
        <label for="stock">Stok:</label>
        <input type="number" id="stock" v-model.number="item.stock" min="0" required autocomplete="stock">
      </div>
      <div>
        <label for="price">Harga Satuan:</label>
        <input type="number" id="price" v-model.number="item.price" min="0" required autocomplete="price">
      </div>
      <div>
        <label for="image">Gambar:</label>
        <input type="file" id="image" @change="handleImageChange" required autocomplete="image">
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
  name: 'ItemForm',
  data() {
    return {
      showPopup: false, 
      item: {
        name: '',
        unit: 'kg',
        stock: '',
        price: 0,
        image: null,
      },
      isDataSaved: false,
    };
  },
  methods: {
    submitForm() {
      // Validasi nilai stok dan harga satuan
      if (this.item.stock < 0 || this.item.price < 0) {
        alert('Nilai stok dan harga satuan tidak boleh negatif');
        return;
      }
      
      axios.post('http://localhost:3000/items', this.item)
        .then(response => {
          console.log(response.data);
          this.isDataSaved = true; // Set variabel isDataSaved menjadi true
          this.resetForm(); // Panggil method resetForm
        })
        .catch(error => {
          console.error(error);
        });
        
      this.showPopup = true;  
    },
    hidePopup() {
      this.showPopup = false; // Fungsi untuk menyembunyikan popup
    },
    handleImageChange(event) {
      this.item.image = event.target.files[0];
    },
    resetForm() {
      this.item.name = '';
      this.item.unit = 'kg';
      this.item.stock = 0;
      this.item.price = 0;
      // Reset input file gambar
      const imageInput = document.getElementById('image');
      imageInput.value = null; // Menghapus nilai input file
      this.item.image = null;
    },
  },
};
</script>
