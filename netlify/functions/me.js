export async function handler(event) {
    const cookie = event.headers.cookie || "";
    const match = cookie.match(/user=([^;]+)/);

    if (!match) {
        return {
            statusCode: 200,
            body: JSON.stringify(null)
        };
    }

    return {
        statusCode: 200,
        body: decodeURIComponent(match[1])
    };
}
