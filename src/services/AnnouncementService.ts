import { BASE_URL, getTokenFromLocalStorage } from "@/lib/utils";
import { Announcement } from "@/types/announcement";

const URL = `${BASE_URL}/announcements`

export class AnnouncementService {
    static async getAllAnnouncements() {
        const res = await fetch(`${URL}/get-announcements`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        console.log(res);
        
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || error.message || "Bad Response");
        }

        return res.json()
    }

    static async getAnnouncementById(id: object) {
        const res = await fetch(`${URL}/get-announcement?id=${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || error.message || "Bad Response");
        }

        const data = await res.json();
        return data.token;
    }

    static async createAnnouncement(announcement: Announcement, images: File[]) {
        const formData = new FormData();
        formData.append('userId', announcement.userId.toString());
        images.forEach(file => {
            formData.append('images', file); 
        });
        formData.append('content', announcement.content);
        formData.append('datePosted', announcement.datePosted);

        const res = await fetch(`${URL}/create`, {
            method: 'POST',
            body: formData
        })

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || error.message || "Bad Response");
        }

        const data = await res.json();
        return data.token;
    }

    static async updateAnnouncement(announcement: Announcement) {
        const res = await fetch(`${URL}/update-announcement`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(announcement)
        })

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || error.message || "Bad Response");
        }

        const data = await res.json();
        return data.token;
    }

    static async deleteAnnouncement(id: object) {
        const res = await fetch(`${URL}/delete-announcement?id=${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || error.message || "Bad Response");
        }

        const data = await res.json();
        return data.token;
    }

}
