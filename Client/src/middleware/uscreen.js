import axios from "axios";

const uscreenApiKey = process.env.USCREEN_API_TOKEN;
const maxPages = 1;

const fetchUsers = async (page) => {
  try {
    const headers = {
      Authorization: `Bearer ${uscreenApiKey}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(
      `https://www.uscreen.io/publisher_api/v1/customers?page=${page}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Unable to fetch users.");
  }
};

const getAllData = async () => {
  const promises = [];

  for (let i = 1; i <= maxPages; i++) {
    const promise = fetchUsers(i);
    promises.push(promise);
    await new Promise(resolve => setTimeout(resolve, 600));
  }

  try {
    const allResponses = await Promise.all(promises);
    const allData = [];
console.log(allResponses);
    allResponses.forEach((res) => {
      res.forEach((item) => {
        if (!allData.some((i) => i.id === item.id)) {
          allData.push(item);
        }
      });
    });

    return allData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const getCustomerData = async (id) => {
  
  try {
    const headers = {
      Authorization: `Bearer ${uscreenApiKey}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(
      `https://www.uscreen.io/publisher_api/v1/customers/${id}/accesses`,
      { headers }
    );
    await new Promise(resolve => setTimeout(resolve, 600));

    return response.data;
  } catch (error) {
    console.error("Error fetching customer data:", error);
    throw new Error("Unable to fetch customer data.");
  }
}

export { fetchUsers, getAllData, getCustomerData };
