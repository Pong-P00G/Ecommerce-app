// AlieeShop Service Worker - Push Notifications
self.addEventListener("push", (event) => {
    let data = { title: "AlieeShop", body: "", icon: "/favicon.ico", badge: "/favicon.ico" };
    try { if (event.data) { data = { ...data, ...event.data.json() }; } } catch (e) { data.body = event.data?.text() || "New notification"; }
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body, icon: data.icon, badge: data.badge,
            vibrate: [200, 100, 200], tag: data.tag || "default",
            data: data.data || {}, actions: data.actions || [],
        })
    );
});
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const urlToOpen = event.notification.data?.url || "/admin/dashboard";
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
            const matchingClient = windowClients.find((client) => client.url.includes(urlToOpen));
            if (matchingClient) { return matchingClient.focus(); }
            return clients.openWindow(urlToOpen);
        })
    );
});