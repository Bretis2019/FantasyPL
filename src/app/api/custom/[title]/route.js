async function getResponse(title){
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

    fetch(`https://api.immigration.govt.nz/ea-datashare/v1/search/${title}?page=1&_=170795`, requestOptions,)
        .then((response) => response.json())
        .then((result) => {
            return result.items.length > 0;
        })
        .catch((error) => {
            return error;
        })
}

export async function GET(request, { params }) {
    const { title } = params;
    const response = await getResponse(title);
    return new Response(response);

}