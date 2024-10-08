export async function getConfig() {
    try {
        const response = await fetch('/api/config');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching config:', error);
        return null;
    }
}

