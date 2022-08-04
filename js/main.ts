const assignees= ['Hari' , 'Shibo' , 'Sarthak' , 'Prabjoth' , 'John Doe'];
enum taskStatus{
  INPROGRESS, COMPLETED
}

type assigneesName = 'Hari' | 'Shibo' | 'Sarthak' | 'Prabjoth' | 'John Doe';

interface taskType {
  taskId: number,
  taskName: string;
  assignee : assigneesName;
  dueDate: Date;
  taskStatus: taskStatus;
}

let tasks: taskType[] = []; //list of all tasks

const listInProgress = document.getElementById("table_inProgress") as HTMLTableElement;
const listCompleted = document.getElementById("table_Completed")as HTMLTableElement;
const inputData = document.getElementById("input") as HTMLInputElement;
const taskTable = document.getElementById("taskTabel") as HTMLDivElement;
let options = { weekday: "short", day: "numeric", month: "short" };


/* delete tasks with task id */
function deleteTask(id: number) {
  let row = document.getElementById(`${id}`) as HTMLTableRowElement;
  row.remove();
}

/* toggles the status of the tasks */
function toggleTask(id: number) {
  if(tasks[id].taskStatus === taskStatus.COMPLETED) {tasks[id].taskStatus = taskStatus.INPROGRESS} // changing the status
  else {tasks[id].taskStatus = taskStatus.COMPLETED} // changing the status
  deleteTask(id); //deleting from 1st list
  loadtask(id); //adding to other list
}

function loadtask(id: number) {
  //checking if it belongs to done or not done 
  const row = document.createElement('tr')
  const colArray: HTMLTableCellElement[] = [];
  for(let i=0; i< 4; i++){
    colArray[i] = document.createElement('td');

  }
  
  colArray[1].setAttribute('align', 'center')
  colArray[2].setAttribute('align', 'center')
  colArray[3].setAttribute('align', 'center')

  const checkbox = document.createElement('input')
  checkbox.setAttribute('type','checkbox')
  checkbox.setAttribute('job','toggle')
  checkbox.setAttribute('id',`checkbox${id}`)
  
  

  if (tasks[id].taskStatus === taskStatus.INPROGRESS) {
    checkbox.setAttribute('checked','')
  }

  colArray[3].appendChild(checkbox);

  colArray.map((item) => {row.appendChild(item)})
}

// interface formDataType{
//   taskName:string,
//    assignee:assigneeList,
//   dueDate:string
// }





enum unHideError{
  taskNameError, assigneeError, dueDateError
}

function unHide(error: unHideError){
  console.log(`${error}`)
  document.getElementById(`${error}`).classList.add('display-hidden')
}

function Hide(error: unHideError){
  document.getElementById(`${error}`).classList.remove('display-hidden')
}


function validateTask(newTask: taskType){
  let todaysDate = new Date(); //getting the current date
  todaysDate.setHours(0, 0, 0, 0); //setting the time of this day to zero for comparision
  if (newTask.taskName.trim() == "") {
    //no task's name
    unHide(unHideError.taskNameError);
    return false;
  } else if (!newTask.assignee) {
    //no task's assignee
    unHide(unHideError.assigneeError);
    return false;
  } else if (newTask.dueDate < todaysDate) {
    // the date is in the past
    unHide(unHideError.dueDateError);
    return false;
  }
  Hide(unHideError.taskNameError)
  Hide(unHideError.assigneeError)
  Hide(unHideError.dueDateError)
  return true;
}

type formDataType = FormData & {taskName:string, assignee:assigneesName, dueDate: string}

function getTaskObj(formData: formDataType): taskType{
  let newTask: taskType = {
    taskId: tasks.length,
    taskName : formData.taskName,
    assignee : formData.assignee,
    dueDate : new Date(formData.dueDate),
    taskStatus : taskStatus.COMPLETED 
  }
  return newTask;
  };


// sends the tasks for submission if it is valid
function submitTask() {
  let formData = new FormData(document.getElementById('form') as HTMLFormElement) as formDataType;
  let newTask = getTaskObj(formData);
  

  //valid tasks
  tasks.push(newTask);
  loadtask(newTask.taskId); //load the new task

  //reset the input fields
  // for (const key in formData) {
  //   formData = "";
  // }
}

// return key to submit task
document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    submitTask();
  }
});

//click monitoring
taskTable.addEventListener("click", function (event) {
  const element = event.target as Element; // return the clicked element inside list

  //to avoid meaningless clicks
  type xyz = NamedNodeMap & {job: {value: string}}
  const attributesList = element?.attributes as xyz
  const elementJob = attributesList.job.value

  //submit button is clicked
  if (elementJob === "toggle") {
    //task is checked/unchecked
    type rowAttributes = Element & {id: string}
    const row = element?.parentNode?.parentNode as rowAttributes;
    let id: number = +row.id;
    toggleTask(id);
  }
});
