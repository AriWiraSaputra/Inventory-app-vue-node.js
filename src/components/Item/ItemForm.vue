<template>
  <div>
    <h2>Form Item</h2>
    <form @submit.prevent="submitForm">
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
      isDataSaved: false, // Tambahkan variabel isDataSaved
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
      // Fungsi untuk menyembunyikan popup
      this.showPopup = false;
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

