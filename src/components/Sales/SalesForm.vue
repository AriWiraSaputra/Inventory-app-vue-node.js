<template>
  <div>
    <h2>Form Sales</h2>

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

    <div>
      <label for="item">Item:</label>
      <select id="item" v-model="selectedItem" required>
        <option v-for="item in items" :value="item" :key="item.id">{{ item.name }}</option>
      </select>
    </div>
    <div>
      <label for="qty">Qty:</label>
      <input type="number" id="qty" v-model.number="selectedQuantity" required min="1">
    </div>
    <div>
      <button @click="addItem">Add Item</button>
    </div>

    <div v-if="salesItems.length > 0">
      <h3>List Item:</h3>
      <ul>
        <li v-for="(item, index) in salesItems" :key="index">
          {{ item.name }} - Qty: {{ item.quantity }}
        </li>
      </ul>
    </div>

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
import '@/components/style.css';

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
        discountType: '',
        discount: '',
      },
      selectedItem: '',
      quantity: 1,
      selectedQuantity: 1,
      salesItems: [],
      totalDiscount: 0,
      totalPrice: 0,
      totalPayment: 0,
      isDataSaved: false,
      isCustomerFormModalOpen: false,
      items: [],
      customers: [],
    };
  },
  methods: {
    addItem() {
      console.log('selectedItem:', this.selectedItem);
      console.log('items:', this.items);

      if (isNaN(this.selectedQuantity) || this.selectedQuantity <= 0) {
        return;
      }

      if (this.selectedItem) {
        if (this.selectedQuantity > this.selectedItem.stock) {
          alert('Jumlah tidak valid.');
          return;
        }

        const selectedItemQuantity = this.selectedQuantity;
        this.selectedItem.stock -= selectedItemQuantity;

        this.salesItems.push({
          codeTransaksi: this.codeTransaksi,
          tanggalTransaksi: this.tanggalTransaksi,
          customer: { ...this.selectedCustomer },
          id: this.selectedItem.id,
          name: this.selectedItem.name,
          quantity: selectedItemQuantity,
          price: this.selectedItem.price,
        });

        this.selectedItem = null;
        this.selectedQuantity = selectedItemQuantity;

        this.calculateTotals();
      } else {
        alert('Item yang dipilih tidak ditemukan.');
      }
    },
    calculateTotals() {
      this.totalPrice = this.salesItems.reduce((total, item) => {
        const selectedItem = this.items.find(i => i.id === item.id);
        if (selectedItem && !isNaN(selectedItem.price)) {
          return total + selectedItem.price * item.quantity;
        } else {
          return total;
        }
      }, 0);

      let totalDiscount = 0;

      this.salesItems.forEach(item => {
        const selectedItem = this.items.find(i => i.id === item.id);
        if (selectedItem && !isNaN(selectedItem.price)) {
          const itemDiscount = parseFloat(item.customer.discount);
          if (!isNaN(itemDiscount)) {
            const itemPrice = selectedItem.price * item.quantity;
            totalDiscount += (itemPrice * itemDiscount) / 100;
          }
        }
      });

      if (this.selectedCustomer.discountType === 'percentage') {
        const discountPercentage = parseFloat(this.selectedCustomer.discount);
        if (!isNaN(discountPercentage)) {
          const customerDiscount = (this.totalPrice * discountPercentage) / 100;
          totalDiscount += customerDiscount;
        }
      } else if (this.selectedCustomer.discountType === 'amount') {
        const discountAmount = parseFloat(this.selectedCustomer.discount);
        if (!isNaN(discountAmount)) {
          totalDiscount += discountAmount;
        }
      }

      this.totalDiscount = totalDiscount;
      this.totalPayment = this.totalPrice - this.totalDiscount;
    },
    saveSales() {
      const salesData = {
        codeTransaksi: this.codeTransaksi,
        tanggalTransaksi: this.tanggalTransaksi,
        customer: this.selectedCustomer,
        salesItems: this.salesItems,
        totalDiscount: this.totalDiscount,
        totalPrice: this.totalPrice,
        totalPayment: this.totalPayment,
        quantity: this.selectedQuantity,
      };

      axios
        .post('http://localhost:3000/sales', salesData)
        .then(response => {
          console.log(response.data);
          this.isDataSaved = true;
        })
        .catch(error => {
          console.error(error);
        });

      const selectedQuantity = this.selectedQuantity;

      this.items.forEach(item => {
        if (this.selectedItem) {
          item.stock -= selectedQuantity;
          console.log(item.stock);

          const itemToUpdate = {
            id: item.id,
            name: item.name,
            stock: item.stock,
          };

          axios
            .put(`http://localhost:3000/items/${itemToUpdate.id}`, itemToUpdate)
            .then(response => {
              console.log(response.data);
            })
            .catch(error => {
              console.error(error);
            });
        }
      });
    },
    openCustomerFormModal() {
      this.isCustomerFormModalOpen = true;
    },
    closeCustomerFormModal() {
      this.isCustomerFormModalOpen = false;
    },
    saveCustomer(customerData) {
      axios
        .post('http://localhost:3000/customers', customerData)
        .then(response => {
          console.log(response.data);
          this.customers.push(response.data);
          this.isCustomerFormModalOpen = false;

          this.selectedCustomer = {
            discountType: customerData.discountType,
            discount: customerData.discount,
          };

          this.calculateTotals();
        })
        .catch(error => {
          console.error(error);
        });
    },
  },
  mounted() {
    axios
      .get('http://localhost:3000/items')
      .then(response => {
        this.items = response.data;
      })
      .catch(error => {
        console.error(error);
      });

    axios
      .get('http://localhost:3000/customers')
      .then(response => {
        this.customers = response.data;
      })
      .catch(error => {
        console.error(error);
      });
  },
};
</script>
