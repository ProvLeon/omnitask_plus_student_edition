import { Avatar, Tag, Tooltip } from "antd";
import { User } from "../components/Tasks/TaskForm";
import { getAllUsers, getUserData } from "../components/apis/UserApi";
import { useEffect, useState } from "react";

const getPersonsResponsible = async (ids: string[]) => {
  const personsResponsible: User[] = []
  console.log(ids)
  for (const id of ids) {
    const user = await getUserData(id);
    if (user) {
      personsResponsible.push(user)
    }
  }
  return personsResponsible
}


const returnUserAvatars = async (personsResponsible: string[]) => {
  const users: User[] = []
  for (const person of personsResponsible) {
    const user =  await getUserData(person.toString())
    if (user) {
      users.push(user)
    }
  }
  console.log(users)
  if (users.length === 0) {
    return <Tag className="flex justify-center" color="blue">Null</Tag>
  }
  else if (users.length === 1) {
    return <div className="flex justify-center items-center gap-2"><Avatar src={users[0].image} /><Tag color="blue">{users[0].username}</Tag></div>
  }
  else {
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

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

const getUserSearch = async (searchTerm: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const usersData = await getAllUsers();
      if (usersData) {
        setUsers(usersData);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    const filteredUsers = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredUsers);
  }, [searchTerm, users]);

  return { searchResults, loading };
}

export { fileToBase64, getPersonsResponsible, returnUserAvatars, getUserSearch };


