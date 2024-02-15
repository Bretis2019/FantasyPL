export async function GET(request, { params }) {
    const { title } = params;
    try {
        const myHeaders = new Headers();
        myHeaders.append(
            "Ocp-Apim-Subscription-Key",
            "355f21faaf944257a6c16278e917126f",
        );

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
        // Fetch data from your API using the title
        const response = await fetch(`https://api.immigration.govt.nz/ea-datashare/v1/search/${title}?page=1&_=170795`, requestOptions);
        const data = await response.json();

        // Check if the response data has a non-empty items array
        const hasItems = Array.isArray(data.items) && data.items.length > 0;

        // Return true if items array is not empty, otherwise return false
        return new Response(hasItems);
    } catch (error) {
        console.error('Error fetching data:', error);
        return new Response({ error: 'Error fetching data' });
    }
}