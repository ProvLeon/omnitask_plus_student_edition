import { Avatar, Tag, Tooltip } from "antd";
import { User } from "../components/Tasks/TaskForm";
import { getUserData } from "../components/apis/UserApi";

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

    return <div className="flex items-center gap-2"><Avatar src={users[0].image} /><Tag color="blue">{users[0].username}</Tag></div>
  }
  else if (users.length === 2) {
    console.log(users[0].id)
    return (<Tooltip title={users[0].username + ", " + users[1].username}>
    <div className="flex relative justify-center">
      <div className="absolute left-3">
      <Avatar src={users[0].image} />
      </div>
    <div >
      <Avatar src={users[1].image} />
      </div>
      </div>
      </Tooltip>)
  }
  else if (users.length === 3) {
    console.log(users)
    return(
      <Tooltip title={users[0].username + ", " + users[1].username + ", " + users[2].username}>
        <div>
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <Avatar src={users[0].image} />
      </div>
        <Avatar src={users[1].image} />
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <Avatar src={users[2].image} />
      </div>
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <Avatar src={users[3].image} />
      </div>

    </div>
      </Tooltip>
    )
  }
  else {
    return <div>
      <Avatar src={users[0].image} />
      <Avatar src={users[1].image} />
      <Avatar src={users[2].image} />
      <Avatar src={users[3].image} />
    </div>
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

export { fileToBase64, getPersonsResponsible, returnUserAvatars };

