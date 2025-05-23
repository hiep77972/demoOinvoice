// Invoice management class
export class InvoiceManager {
  constructor() {
    this.tableBody = document.querySelector('#invoice-table tbody');
    this.items = [];
    this.nextId = 1;
    this.taxRate = 10; // Default VAT rate of 10%
  }

  // Add an empty row to the invoice table
  addEmptyRows(count = 1) {
    for (let i = 0; i < count; i++) {
      this.addRow();
    }
  }

  // Add a new row to the invoice table
  addRow(data = {}) {
    const rowId = this.nextId++;
    
    // Default values
    const defaultData = {
      id: rowId,
      type: '',
      code: '',
      name: '',
      unit: '',
      quantity: '',
      price: '',
      total: '',
      selected: false
    };
    
    // Merge default data with provided data
    const rowData = { ...defaultData, ...data };
    this.items.push(rowData);
    
    // Create a new row element
    const row = document.createElement('tr');
    row.dataset.id = rowData.id;
    row.className = 'row-added';
    
    // Add row content
    row.innerHTML = `
      <td class="checkbox-cell">
        <input type="checkbox" class="row-selector" ${rowData.selected ? 'checked' : ''}>
      </td>
      <td class="action-cell">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
      </td>
      <td>
        <select class="item-type">
          <option value="">--Chọn--</option>
          <option value="hh-dv" ${rowData.type === 'hh-dv' ? 'selected' : ''}>HH-DV</option>
          <option value="lo" ${rowData.type === 'lo' ? 'selected' : ''}>Lô</option>
          <option value="hop" ${rowData.type === 'hop' ? 'selected' : ''}>Hộp</option>
          <option value="chai" ${rowData.type === 'chai' ? 'selected' : ''}>Chai</option>
          <option value="tui" ${rowData.type === 'tui' ? 'selected' : ''}>Túi</option>
        </select>
      </td>
      <td>
        <div class="search-input dropdown-cell">
          <input type="text" class="item-code" value="${rowData.code}" placeholder="Mã hàng">
          <i class="fa-solid fa-caret-down search-icon dropdown-toggle"></i>
          <div class="dropdown-content">
            <!-- Dropdown items will be added by JavaScript -->
          </div>
        </div>
      </td>
      <td>
        <input type="text" class="item-name" value="${rowData.name}" placeholder="Tên hàng hóa, dịch vụ">
      </td>
      <td>
        <select class="item-unit">
          <option value="">--</option>
          <option value="lo" ${rowData.unit === 'lo' ? 'selected' : ''}>Lô</option>
          <option value="hop" ${rowData.unit === 'hop' ? 'selected' : ''}>Hộp</option>
          <option value="chai" ${rowData.unit === 'chai' ? 'selected' : ''}>Chai</option>
          <option value="tui" ${rowData.unit === 'tui' ? 'selected' : ''}>Túi</option>
        </select>
      </td>
      <td>
        <input type="number" class="item-quantity numeric-cell" value="${rowData.quantity}" placeholder="0" min="0">
      </td>
      <td>
        <input type="number" class="item-price numeric-cell" value="${rowData.price}" placeholder="0" min="0">
      </td>
      <td>
        <input type="text" class="item-total numeric-cell" value="${rowData.total}" readonly>
      </td>
    `;
    
    // Add the row to the table
    this.tableBody.appendChild(row);
    
    // Setup event listeners for this row
    this.setupRowEventListeners(row);
    
    return rowId;
  }

  // Setup event listeners for a specific row
  setupRowEventListeners(row) {
    const id = parseInt(row.dataset.id);
    
    // Checkbox selection
    const checkbox = row.querySelector('.row-selector');
    checkbox.addEventListener('change', () => {
      const itemIndex = this.findItemIndexById(id);
      if (itemIndex !== -1) {
        this.items[itemIndex].selected = checkbox.checked;
      }
    });
    
    // Calculation events
    const quantityInput = row.querySelector('.item-quantity');
    const priceInput = row.querySelector('.item-price');
    const totalInput = row.querySelector('.item-total');
    
    const calculateRowTotal = () => {
      const quantity = parseFloat(quantityInput.value) || 0;
      const price = parseFloat(priceInput.value) || 0;
      const total = quantity * price;
      
      totalInput.value = this.formatCurrency(total);
      
      // Update the item in the items array
      const itemIndex = this.findItemIndexById(id);
      if (itemIndex !== -1) {
        this.items[itemIndex].quantity = quantity;
        this.items[itemIndex].price = price;
        this.items[itemIndex].total = total;
      }
      
      // Dispatch event for recalculating totals
      document.dispatchEvent(new CustomEvent('invoice:calculate'));
    };
    
    quantityInput.addEventListener('input', calculateRowTotal);
    priceInput.addEventListener('input', calculateRowTotal);
    
    // Item code and dropdown handling
    const dropdownToggle = row.querySelector('.dropdown-toggle');
    const dropdown = row.querySelector('.dropdown-content');
    
    dropdownToggle.addEventListener('click', () => {
      dropdown.classList.toggle('show');
      
      // If no items in dropdown, add sample items
      if (dropdown.children.length === 0) {
        this.populateSampleProducts(dropdown, row);
      }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!event.target.matches('.dropdown-toggle') && !event.target.closest('.dropdown-content')) {
        dropdown.classList.remove('show');
      }
    });
    
    // Update name field when code field changes
    const codeInput = row.querySelector('.item-code');
    const nameInput = row.querySelector('.item-name');
    
    codeInput.addEventListener('change', () => {
      const itemIndex = this.findItemIndexById(id);
      if (itemIndex !== -1) {
        this.items[itemIndex].code = codeInput.value;
      }
    });
    
    nameInput.addEventListener('change', () => {
      const itemIndex = this.findItemIndexById(id);
      if (itemIndex !== -1) {
        this.items[itemIndex].name = nameInput.value;
      }
    });
    
    // Update item type and unit selections
    const typeSelect = row.querySelector('.item-type');
    const unitSelect = row.querySelector('.item-unit');
    
    typeSelect.addEventListener('change', () => {
      const itemIndex = this.findItemIndexById(id);
      if (itemIndex !== -1) {
        this.items[itemIndex].type = typeSelect.value;
      }
    });
    
    unitSelect.addEventListener('change', () => {
      const itemIndex = this.findItemIndexById(id);
      if (itemIndex !== -1) {
        this.items[itemIndex].unit = unitSelect.value;
      }
    });
  }

  // Populate sample products in dropdown
  populateSampleProducts(dropdown, row) {
    const sampleProducts = [
      { code: 'SP001', name: 'Cao sao vàng (lọ 8g)', unit: 'Lọ', price: 10000 },
      { code: 'SP002', name: 'Băng cá nhân bé', unit: 'Hộp', price: 30000 },
      { code: 'SP003', name: 'Băng cá nhân to', unit: 'Hộp', price: 75000 },
      { code: 'SP004', name: 'Nacl 0,9% 10ml', unit: 'Lốc', price: 25000 },
      { code: 'SP005', name: 'Efferalgan 500mg sủi Pháp', unit: 'Hộp', price: 44000 },
      { code: 'SP006', name: 'Berberin', unit: 'Lọ', price: 10000 },
      { code: 'SP007', name: 'Trà gừng', unit: 'Hộp', price: 15000 }
    ];
    
    sampleProducts.forEach(product => {
      const item = document.createElement('div');
      item.className = 'dropdown-item';
      item.textContent = `${product.code} - ${product.name}`;
      
      item.addEventListener('click', () => {
        const id = parseInt(row.dataset.id);
        const itemIndex = this.findItemIndexById(id);
        
        if (itemIndex !== -1) {
          // Update the item in the items array
          this.items[itemIndex].code = product.code;
          this.items[itemIndex].name = product.name;
          this.items[itemIndex].unit = product.unit;
          this.items[itemIndex].price = product.price;
          
          // Update the form fields
          row.querySelector('.item-code').value = product.code;
          row.querySelector('.item-name').value = product.name;
          row.querySelector('.item-unit').value = product.unit.toLowerCase();
          row.querySelector('.item-price').value = product.price;
          
          // Calculate row total
          const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
          row.querySelector('.item-quantity').value = quantity || 1;
          const total = (quantity || 1) * product.price;
          row.querySelector('.item-total').value = this.formatCurrency(total);
          
          // Update item total in array
          this.items[itemIndex].quantity = quantity || 1;
          this.items[itemIndex].total = total;
          
          // Highlight the row
          row.classList.add('highlight-row');
          setTimeout(() => {
            row.classList.remove('highlight-row');
          }, 1000);
          
          // Recalculate totals
          document.dispatchEvent(new CustomEvent('invoice:calculate'));
        }
        
        // Close the dropdown
        dropdown.classList.remove('show');
      });
      
      dropdown.appendChild(item);
    });
  }

  // Delete selected rows from the invoice table
  deleteSelectedRows() {
    const selectedItems = this.items.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một dòng để xóa.');
      return;
    }
    
    const selectedIds = selectedItems.map(item => item.id);
    
    // Remove rows from the DOM
    selectedIds.forEach(id => {
      const row = this.tableBody.querySelector(`tr[data-id="${id}"]`);
      if (row) {
        row.remove();
      }
    });
    
    // Remove items from the items array
    this.items = this.items.filter(item => !selectedIds.includes(item.id));
    
    // Recalculate totals
    document.dispatchEvent(new CustomEvent('invoice:calculate'));
    
    // If no rows left, add an empty one
    if (this.items.length === 0) {
      this.addEmptyRows(1);
    }
  }

  // Find an item index by ID
  findItemIndexById(id) {
    return this.items.findIndex(item => item.id === id);
  }

  // Get all items
  getItems() {
    return this.items;
  }

  // Format currency
  formatCurrency(value) {
    return new Intl.NumberFormat('vi-VN').format(value);
  }

  // Get total amount
  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
  }

  // Get total tax
  getTax(subtotal) {
    // Get the selected discount type
    const discountPercentage = document.getElementById('chiet-khau-phan-tram').checked;
    const discountAmount = document.getElementById('chiet-khau-tien').checked;
    
    let discountValue = 0;
    
    if (discountPercentage) {
      // Get percentage discount value
      const percentInput = document.querySelector('input[name="discount-percent"]');
      if (percentInput) {
        const percent = parseFloat(percentInput.value) || 0;
        discountValue = (subtotal * percent) / 100;
      }
    } else if (discountAmount) {
      // Get fixed amount discount
      const amountInput = document.querySelector('input[name="discount-amount"]');
      if (amountInput) {
        discountValue = parseFloat(amountInput.value) || 0;
      }
    }
    
    // Apply tax on subtotal minus discount
    const taxableAmount = subtotal - discountValue;
    return (taxableAmount * this.taxRate) / 100;
  }

  // Get discount amount
  getDiscount(subtotal) {
    // Get the selected discount type
    const discountPercentage = document.getElementById('chiet-khau-phan-tram').checked;
    const discountAmount = document.getElementById('chiet-khau-tien').checked;
    
    if (discountPercentage) {
      // Get percentage discount value
      const percentInput = document.querySelector('input[name="discount-percent"]');
      if (percentInput) {
        const percent = parseFloat(percentInput.value) || 0;
        return (subtotal * percent) / 100;
      }
    } else if (discountAmount) {
      // Get fixed amount discount
      const amountInput = document.querySelector('input[name="discount-amount"]');
      if (amountInput) {
        return parseFloat(amountInput.value) || 0;
      }
    }
    
    return 0;
  }
}