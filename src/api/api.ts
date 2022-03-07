const API_URL = 'http://jsonplaceholder.typicode.com/photos';

export async function getData() {
  const response = await fetch(API_URL);

  return response.json();
}
