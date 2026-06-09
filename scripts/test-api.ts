async function testApi() {
    try {
        const res = await fetch('http://localhost:3000/api/restaurants/le-jardin/menu');
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}
testApi();
