import { defineStore } from "pinia";
import * as api from "../api/api";

export const useUserStore = defineStore("user", {
    state: () => ({
        isLoggedIn: false,
        username: "",
        email: "",
        avatar: "avatar",
        password: "",
        userId: null,
    }),
    actions: {
        //Login user
        login(user) {
        this.isLoggedIn = true;
        this.username = user.username;
        this.email = user.email;
        this.avatar = user.avatar || "https://via.placeholder.com/150";
        this.password = user.password || "";
        this.userId = user.userid;
        localStorage.setItem("loggedInUser", JSON.stringify(this.$state));
        },
        //Logout user
        logout() {
        this.$reset();
        localStorage.removeItem("loggedInUser");
        },
        //Load saved user on refresh
        loadFromLocalStorage() {
        const saved = localStorage.getItem("loggedInUser");
        if (saved) {
            this.$patch({ ...JSON.parse(saved), isLoggedIn: true });
        }
        },
        //Update profile & persist
        async updateProfile(updates) {
            try {
                const { data } = await api.updateUserProfile(updates);
                this.$patch(data);
                localStorage.setItem("loggedInUser", JSON.stringify(this.$state));
            } catch (error) {
                console.error("Failed to update profile:", error);
                throw error;
            }
        },

        async fetchUserProfile() {
            try {
                const { data } = await api.getUserProfile();
                this.$patch(data);
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
                throw error;
            }
        }
    },
});
