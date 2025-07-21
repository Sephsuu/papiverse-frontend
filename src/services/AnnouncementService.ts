import { Announcement } from "@/types/announcement";

const BASE_URL = 'http://localhost:8080/api/v1/announcements'; 


const AnnouncementService = {
    createAnnouncement: async (announcement  : object) => {
      console.log(JSON.stringify(announcement));
      
      const response = await fetch(`${BASE_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(announcement),
      });

      console.log(JSON.stringify(announcement));
      
      
      if (!response.ok) {
        throw new Error('Cannot be added');
      }

  
      const data = await response.json();
      return data;
    },
  
    getAllAnnouncement: async () => {
      const response = await fetch(`${BASE_URL}/get-announcements`, {
          method: 'GET',
          headers: {'Content-Type' : 'application/json' }
      });
  
      if(!response.ok){
          throw new Error("Registration Failed");
      }
  
      const data = await response.json();
      return data;
    },

    getAnnoucement: async (id: number) => {
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

    deleteAnnouncement: async (id: number) => {
        const response = await fetch(`${BASE_URL}/delete-announcement?id=${id}`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json' }
        });

        // const data = await response.json();
        // return data;
    },

    updateAnnoucement: async (updatedAnnoucement: Announcement) => {
      const response = await fetch(`${BASE_URL}/update-annoucement`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(updatedAnnoucement),
        });
        
        if (!response.ok) {
          throw new Error('Cannot be added');
        }

    
        const data = await response.json();
        return data;
      }


  };

  
  export default AnnouncementService;