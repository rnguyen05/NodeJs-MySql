# NodeJs-MySql
### Amazon-like storefront
#### App Flows:
1. Run node bamazon.js from terminal.
2. Prompt User to Login or Create New Account.
3. If Logged in User is:
    ##### I. Customer
    1. List all products for sales
    2. Prompt to get customer purchase by item id and quantity
    3. Display order item on screen to customer
    4. Ask if customer wants to add more items to order. If customer responds
        - Y (Yes) : Repeat steps i -> iv
        - N (No) : Show customer's order summary
        
    ##### II. Manager
    Display Manager Menu Options
    1. View Products for Sale by
        - Department
        - Item Id
        - Customer
    2. View Low Inventory
        - a Number
    3. Add to Inventory
        - Item Id, Quantity
    4. Add New Product
        - Product Name, Price, Stock Quantity, Department
    
    ##### III. Supervisor
    Display Supervisor Menu Options
    1. View Products for Sale by
        - Department
        - Item Id
        - Customer
    2. Create New Department
        - Department Name, Over Head Costs
    

#### App Files:
    - Main File: bamazon.js
    - Sales Order: salesOrder.js
    - User Management: users.js
    - Order Details: orders.js
    - Inventory: products.js
    - Print Item Ordered: ItemOrder.js
    


[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/gjHc_GlWvQM/2.jpg)](https://www.youtube.com/watch?v=gjHc_GlWvQM)

