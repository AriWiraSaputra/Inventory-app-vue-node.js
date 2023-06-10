# Simple Sales Inventory Application (Administrator)

A simple Sales Inventory Application (Administrator) built using _**Vue.js**_ as the frontend and _**Node.js**_ as the backend.
  <p align="left"><img align="center" width="280" <img src="https://github.com/AriWiraSaputra/Inventory-app-vue-node.js/blob/main/Img/nodejs.gif" width="48"></p>
  
## 🚩 Modules

This application consists of 3 main modules:
1. **Item Module:** Module to manage item data.
2. **Customer Module:** Module to manage customer data.
3. **Sales Module:** Module to manage sales data.

## 💡 Features

- **Item Management (Item Module):** item_name, unit (kg/pcs), stock, unit_price, and item_image.
- **Customer Management (Customer Module):** name, contact, email, address, discount, discount_type, and ktp_image.
- **Sales Management (Sales Module):** transaction_code, transaction_date, customer, items (multiple), quantity, total_discount (auto-filled), total_price (auto-filled), and total_payment.
- Calculation of total price adjusted based on the discount in the Customer Module (if applicable).
- Validation to ensure that the quantity does not exceed the item stock.
- Reduction of stock when a purchase is made.

## 🔖 Folder Structure

Here is the folder structure of the project:

- backend/ - Node.js backend folder
  - node_modules/ - Node.js dependencies (generated by npm/yarn)
  - package.json - Backend package configuration
  - package-lock.json - Backend package lock file
  - server.js - Backend server file

- frontend/ - Vue.js frontend folder
  - src/ - Vue.js source code
    - assets/ - Folder for assets
    - components/ - Folder for Vue.js components
    - app/ - Folder for main application files
    - main/ - Folder for main page files
    
- .babelrc - Babel configuration file
- jsconfig.json - jsconfig configuration file
- README.md - This is the README file

## ⚙️ Installation 👇

1. Clone this repository to your local machine:

    ```sh 
    git clone <https://github.com/AriWiraSaputra/Inventory-app-vue-node.js.git>
    ```
2. Navigate to the backend folder and install the dependencies:
 
    ```sh 
    cd backend
    npm install
    ```
3. Configure the database according to your preferences.
4. Start the backend server:
    
    ```sh 
    node server.js
    ```
5. Navigate to the frontend folder and install the dependencies:
    
    ```sh
    cd frontend
    npm install
    ```
6. Run the frontend application:
    
    ```sh
    npm run serve
    ```
 7. Open a browser and access the application at 
    - http://localhost:8080/items/new.
    - http://localhost:8080/costumers/new.
    - http://localhost:8080/sales/new.
    
## 💞 Image and Video 












