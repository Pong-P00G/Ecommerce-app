import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
    state: () => ({
        isLoggedIn: false,
        username: "",
        email: "",
        avatar: "avatar",
        password: "",
    }),
    actions: {
        //Login user
        login(user) {
        this.isLoggedIn = true;
        this.username = user.username;
        this.email = user.email;
        this.avatar = user.avatar || "https://via.placeholder.com/150";
        this.password = user.password || "";
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
        updateProfile(updates) {
        this.$patch(updates);
        localStorage.setItem("loggedInUser", JSON.stringify(this.$state));
        },
    },
});
