const BASE_URL = 'http://localhost:8080/api/v1/raw-materials'; 

const RawMaterialService = {
    createRawMaterial: async (rawMaterial  : object) => {
      const response = await fetch(`${BASE_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(rawMaterial),
      });
      
      if (!response.ok) {
        throw new Error('Cannot be added');
      }

  
      const data = await response.json();
      return data;
    },
  
    getAllRawMaterial: async () => {
      const response = await fetch(`${BASE_URL}/get-all`, {
          method: 'GET',
          headers: {'Content-Type' : 'application/json' }
      });
  
      if(!response.ok){
          throw new Error("Query Failed");
      }
      
      const data = await response.json();
      return data;
    },

    getRawMaterialById: async (id: number) => {
      const response = await fetch(`${BASE_URL}/get-by-id?id=${id}`, {
          method: 'GET',
          headers: {'Content-Type' : 'application/json' }
      });
  
      if(!response.ok){
          throw new Error("Query Failed");
      }
      
      const data = await response.json();
      return data;
    },

     getRawMaterialByCode: async (code: String) => {
      const response = await fetch(`${BASE_URL}/get-by-code?code=${code}`, {
          method: 'GET',
          headers: {'Content-Type' : 'application/json' }
      });
  
      if(!response.ok){
          throw new Error("Query Failed");
      }
      
      const data = await response.json();
      return data;
    },

    updateRawMaterial: async (material: object) => {
      const response = await fetch(`${BASE_URL}/update`, {
          method: 'POST',
          headers: {'Content-Type' : 'application/json' },
          body: JSON.stringify(material)
      });
      
      if(!response.ok){
          throw new Error('Failed to Update User');
      }
      return await response.json();
    },

    deleteRawMaterial: async (code: string) => {
      const response = await fetch(`${BASE_URL}/delete-by-code?code=${code}`, {
          method: 'POST',
          headers: {'Content-Type' : 'application/json' }
      });
      
      if (response.ok) {
          const text = await response.text();
          return text ? JSON.parse(text) : null;
      }
    },    


  };

  
  export default RawMaterialService;