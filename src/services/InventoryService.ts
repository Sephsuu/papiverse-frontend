const BASE_URL = 'http://localhost:8080/api/v1/inventory'; 

const InventoryService = {
    getInventoryByBranch: async (branchId: number) => {
      const response = await fetch(`${BASE_URL}/get-by-branch?id=${branchId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'},
      });
      
      if (!response.ok) {
        throw new Error('Cannot get inventory by branch');
      }

      const data = await response.json();
      return data;
    },

    createInventory: async (inventory  : object) => {
      console.log(inventory);
      
      const response = await fetch(`${BASE_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(inventory),
      });
      
      if (!response.ok) {
        throw new Error('Cannot be added');
      }

      const data = await response.json();
      return data;
    },
    deleteInventory: async (inventoryId : number) => {
       const response = await fetch(`${BASE_URL}/delete?id=${inventoryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
      });
      
      if (!response.ok) {
        throw new Error('Cannot be Deleted');
      }

      return true;
    },
    processInput : async (transactionInput : object) => {
      const response = await fetch(`${BASE_URL}/process-transaction-input`, {
        method : 'POST',
        headers : {'Content-Type': 'application/json'},
        body : JSON.stringify(transactionInput),
      });

      if(!response.ok) {
          throw new Error('Cannot create input transaction');
      }

      const data = await response.json();
      return data;
    },
    processOrder : async (transactionOrder : object) => {
      const response = await fetch(`${BASE_URL}/process-transaction-order`, {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify(transactionOrder)
      });

      if(!response.ok) {
        throw new Error("Cannot create Order Transaction")
      }

      const data = await response.json();
      return data;
    },
    getAudits : async (branchId : number ) =>  {
      const response = await fetch(`${BASE_URL}/get-audits`, {
        method : 'GET',
        headers : {'Content-type' : 'application/json'}
      })

      if (!response.ok) {
        throw new Error('Cannot get inventory by branch');
      }

      const data = await response.json();
      return data;
    }


}

export default InventoryService;