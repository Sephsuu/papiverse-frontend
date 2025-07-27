const BASE_URL = 'http://localhost:8080/api/v1/employees'; 

const EmployeeService = {
    getEmployeesByBranch: async (branchId: number) => {
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

    getEmployeesById: async (id: number) => {
       const response = await fetch(`${BASE_URL}/get-by-id?id=${id}`, {
          method: 'GET',
          headers: {'Content-Type' : 'application/json' }
      });
  
      if(!response.ok){
          throw new Error("Registration Failed");
      }
  
      const data = await response.json();
      return data;
    },

    createEmployee: async (expense: object) => {
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

    updateEmployee: async (employee: object) => {
      console.log(employee);
      
      const response = await fetch(`${BASE_URL}/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(employee),
        });

        console.log(JSON.stringify(employee));
        

        if (!response.ok) {
          throw new Error('Cannot be added');
        }

        const data = await response.json();
        return data;
    },

    deleteEmployee: async (id: number) => {
        await fetch(`${BASE_URL}/delete-by-id?id=${id}`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json' }
        });
    },
};
  
export default EmployeeService;