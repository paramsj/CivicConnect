// backend/src/utils/sse.js

// Map of userId string -> Set of active HTTP response stream objects
const clients = new Map();

export const sseManager = {
    /**
     * Add a client connection for a specific user
     */
    addClient(userId, res) {
        if (!userId) return;
        const idStr = userId.toString();
        if (!clients.has(idStr)) {
            clients.set(idStr, new Set());
        }
        clients.get(idStr).add(res);
        console.log(`[SSE] Client connected for user ${idStr}. Total clients for user: ${clients.get(idStr).size}`);

        // Clean up when client disconnects
        res.on('close', () => {
            const userClients = clients.get(idStr);
            if (userClients) {
                userClients.delete(res);
                if (userClients.size === 0) {
                    clients.delete(idStr);
                }
            }
            console.log(`[SSE] Client disconnected for user ${idStr}`);
        });
    },

    /**
     * Send an SSE event specifically to all active dashboard tabs of a user
     */
    sendToUser(userId, eventType, data) {
        if (!userId) return;
        const idStr = userId.toString();
        const userClients = clients.get(idStr);
        if (userClients && userClients.size > 0) {
            const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
            for (const client of userClients) {
                try {
                    client.write(payload);
                } catch (err) {
                    console.warn(`[SSE] Failed to write event to user ${idStr}:`, err.message);
                }
            }
            console.log(`[SSE] Dispatched '${eventType}' to ${userClients.size} client(s) for user ${idStr}`);
        } else {
            console.log(`[SSE] User ${idStr} has no active SSE connections, skipping push`);
        }
    }
};
