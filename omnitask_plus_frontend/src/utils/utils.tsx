import { Avatar, Tag, Tooltip } from "antd"; // Importing Avatar, Tag, and Tooltip components from antd library for UI elements
import { User } from "../components/Tasks/TaskForm"; // Importing User type from TaskForm component
import { getAllUsers, getUserData } from "../components/apis/UserApi"; // Importing API functions to get user data

// Function to get user objects based on an array of user IDs
const getPersonsResponsible = async (ids: string[]) => {
  const personsResponsible: User[] = [] // Initialize an empty array to hold the user objects
  console.log(ids) // Logging the IDs for debugging purposes
  for (const id of ids) { // Loop through each ID
    const user = await getUserData(id); // Fetch user data for each ID
    if (user) { // If user data is found
      personsResponsible.push(user) // Add the user object to the array
    }
  }
  return personsResponsible // Return the array of user objects
}

// Function to return user avatars based on an array of user IDs
const returnUserAvatars = async (personsResponsible: string[]) => {
  const users: User[] = [] // Initialize an empty array to hold the user objects
  for (const person of personsResponsible) { // Loop through each person ID
    const user =  await getUserData(person.toString()) // Fetch user data for each ID
    if (user) { // If user data is found
      users.push(user) // Add the user object to the array
    }
  }
  console.log(users) // Logging the user objects for debugging purposes
  // Return UI elements based on the number of users found
  if (users.length === 0) { // If no users are found
    return <Tag className="flex justify-center" color="blue">Null</Tag> // Return a Tag component indicating "Null"
  }
  else if (users.length === 1) { // If only one user is found
    // Return a div containing the user's avatar and username
    return <div className="flex justify-center items-center gap-2"><Avatar src={users[0].image} /><Tag color="blue">{users[0].username}</Tag></div>
  }
  else { // If more than one user is found
    // Return a Tooltip containing avatars of all users
    return (
      <Tooltip title={users.map(user => user.username).join(", ")}>
        <div className="flex justify-center items-center gap-2">
          {users.map((user, index) => (
            <Avatar key={user.id} src={user.image} style={{ marginLeft: index > 0 ? '-30px' : '0px', zIndex: users.length - index }} />
          ))}
        </div>
      </Tooltip>
    );
  }
}

// Function to convert a file to a base64 encoded string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); // Create a new FileReader object
    // Resolve the promise with the file's result when reading is complete
    reader.onload = () => resolve(reader.result as string);
    // Reject the promise if an error occurs
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file); // Start reading the file as a Data URL
  });
};

// Function to search for users based on a search term
const getUserSearch = async (searchTerm: string, onResults: (results: User[]) => void, onLoading: (isLoading: boolean) => void) => {
  onLoading(true); // Indicate that loading has started
  const usersData = await getAllUsers(); // Fetch all users
  let filteredUsers: User[] = []; // Initialize an empty array for filtered users
  if (usersData) { // If users data is found
    // Filter users based on whether their username includes the search term
    filteredUsers = usersData.filter((user: User) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  onResults(filteredUsers); // Pass the filtered users to the onResults callback
  onLoading(false); // Indicate that loading has finished
};

export { fileToBase64, getPersonsResponsible, returnUserAvatars, getUserSearch }; // Export the utility functions

