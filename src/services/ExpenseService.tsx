
const BASE_URL = 'http://localhost:8080/api/v1/financial-logs'; 

const ExpenseService = {
    getExpensesByBranch: async (branchId: number) => {
      const response = await fetch(`${BASE_URL}/get-by-branch?branchId=${branchId}`, {
          method: 'GET',
          headers: {'Content-Type' : 'application/json' }
      });
  
      if(!response.ok){
          throw new Error("Registration Failed");
      }
  
      const data = await response.json();
      return data;
    },

    getExpense: async (id: number) => {
       const response = await fetch(`${BASE_URL}/get-announcement?id=${id}`, {
          method: 'GET',
          headers: {'Content-Type' : 'application/json' }
      });
  
      if(!response.ok){
          throw new Error("Registration Failed");
      }
  
      const data = await response.json();
      return data;
    },

    createExpense: async (expense: object) => {
      console.log(JSON.stringify(expense));
      
      const response = await fetch(`${BASE_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(expense),
      });
      
      
      if (!response.ok) {
        throw new Error('Cannot be added');
      }

  
      const data = await response.json();
      return data;
    },

    updateExpense: async (expense: object) => {
      const response = await fetch(`${BASE_URL}/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(expense),
        });
        
        if (!response.ok) {
          throw new Error('Cannot be added');
        }

        const data = await response.json();
        return data;
    },

    deleteExpense: async (id: number) => {
        await fetch(`${BASE_URL}/delete?id=${id}`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json' }
        });
    },
};
  
export default ExpenseService;