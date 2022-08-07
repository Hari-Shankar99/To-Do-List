const assignees = ["none", "Hari", "Shibo", "Sarthak", "Prabjoth", "John Doe"];
enum taskStatus {
  INPROGRESS,
  COMPLETED,
}

type assigneesName =
  | "none"
  | "Hari"
  | "Shibo"
  | "Sarthak"
  | "Prabjoth"
  | "John Doe";

interface taskType {
  taskId: number;
  taskName: string;
  assignee: assigneesName;
  dueDate: Date;
  taskStatus: taskStatus;
}

let tasks: taskType[] = []; //list of all tasks

const listInProgress = document.getElementById(
  "tableInProgress"
) as HTMLTableElement;
const listCompleted = document.getElementById(
  "tableCompleted"
) as HTMLTableElement;
const form = document.getElementById("form") as HTMLFormElement;
const button = document.getElementById("button") as HTMLButtonElement;
const taskTable = document.getElementById("taskTable") as HTMLDivElement;
let options = { weekday: 'short', month: 'short', day: 'numeric' };

/* delete tasks with task id */
function deleteTask(id: number) {
  let row = document.getElementById(`${id}`) as HTMLTableRowElement;
  row.remove();
}

/* toggles the status of the tasks */
function toggleTask(id: number) {
  if (tasks[id].taskStatus === taskStatus.COMPLETED) {
    tasks[id].taskStatus = taskStatus.INPROGRESS;
  } // changing the status
  else {
    tasks[id].taskStatus = taskStatus.COMPLETED;
  } // changing the status
  deleteTask(id); //deleting from 1st list
  loadtask(id); //adding to other list
}

function loadtask(id: number) {
  //checking if it belongs to done or not done
  const row = document.createElement("tr");
  row.setAttribute('id',`${id}`)
  const colArray: HTMLTableCellElement[] = [];
  for (let i = 0; i < 4; i++) {
    colArray[i] = document.createElement("td");
  }

  colArray[1].setAttribute("align", "center");
  colArray[2].setAttribute("align", "center");
  colArray[3].setAttribute("align", "center");

  colArray[0].innerHTML = tasks[id].taskName;
  colArray[1].innerHTML = tasks[id].assignee;
  colArray[2].innerHTML = tasks[id].dueDate.toLocaleDateString("en-US",options as Intl.DateTimeFormatOptions);

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("job", "toggle");
  checkbox.setAttribute("id", `checkbox${id}`);
  let target: Element;
  if (tasks[id].taskStatus === taskStatus.INPROGRESS) {
    checkbox.setAttribute("checked", "");
    target = document.getElementById('tableCompleted');
  }
  else{
    target = document.getElementById('tableInProgress');
  }

  colArray[3].appendChild(checkbox);
  
  colArray.map((item) => {
    row.appendChild(item);
  });
  target.appendChild(row);
}

// interface formDataType{
//   taskName:string,
//    assignee:assigneeList,
//   dueDate:string
// }

enum errorType {
  taskNameError = "taskNameError",
  assigneeError = "assigneeError",
  invalidDueDateError = "invalidDueDate",
  noDueDateError = "noDueDate",
}

function addErrorMsg(error: errorType) {
  let element: Element;
  switch (error) {
    case "taskNameError":
      element = document.getElementById(error) as Element;
      element.innerHTML = "Please enter a Task Name";
      break;
    case "assigneeError":
      element = document.getElementById(error) as Element;
      element.innerHTML = "Please choose a Assignee Name";
      break;
    case "invalidDueDate":
      element = document.getElementById("dueDateError") as Element;
      element.innerHTML = "Please choose a Future Due Date";
      break;
    case "noDueDate":
      element = document.getElementById("dueDateError") as Element;
      element.innerHTML = "Please choose a Due Date";
      break;
  }
}

function removeErrorMsg() {
  document.getElementById("taskNameError").innerHTML = '';
  document.getElementById("assigneeError").innerHTML = '';
  document.getElementById("dueDateError").innerHTML = "";
}

function validateTask(newTask: taskType): boolean {
  removeErrorMsg();
  let todaysDate = new Date(); //getting the current date
  todaysDate.setHours(0, 0, 0, 0); //setting the time of this day to zero for comparision
  let validity: boolean = true;
  if (newTask.taskName.trim() == "") {
    //no task's name
    console.log(newTask.taskName)
    addErrorMsg(errorType.taskNameError);
    validity = false;
  }
  if (!newTask.assignee) {
    //no task's assignee
    addErrorMsg(errorType.assigneeError);
    validity = false;
  }
  if (newTask.dueDate < todaysDate) {
    // the date is in the past
    addErrorMsg(errorType.invalidDueDateError);
    validity = false;
  }
  else if(isNaN(+newTask.dueDate)){
    addErrorMsg(errorType.noDueDateError);
    validity = false;
  }
  return validity;
}
type formDataType = FormData & {
  taskName: string;
  assignee: assigneesName;
  dueDate: string;
};

function getTaskObj(formData: formDataType): taskType {
  let newTask: taskType = {
    taskId: tasks.length,
    taskName: formData.get("taskName") as string,
    assignee: formData.get("assignee") as assigneesName,
    dueDate: new Date(formData.get("dueDate") as string),
    taskStatus: taskStatus.COMPLETED,
  };
  return newTask;
}

// sends the tasks for submission if it is valid
function submitTask() {
  const formElement = document.getElementById("form") as HTMLFormElement;
  let formData = new FormData(formElement) as formDataType;

  let newTask = getTaskObj(formData);
  //valid tasks
  if (validateTask(newTask)) {
    tasks.push(newTask);
    loadtask(newTask.taskId); //load the new task
  }

  //reset the input fields
  const form = document.getElementById("form")as HTMLFormElement;
  form.reset();
}

// return key to submit task
document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    submitTask();
  }
});

function getJobValue(element: Element): string {
  // return the clicked element inside list

  type hasJob = NamedNodeMap & { job: {value: string} };
  const attributesList = element.attributes as hasJob;
  return attributesList.job.value as string;
}

// Add task button clicked
button.addEventListener("click", function (event) {
  const element = event.target as Element;
  const elementJob = getJobValue(element);
  if (elementJob === "submit") {
    submitTask();
  }
});

//click monitoring
taskTable.addEventListener("click", function (event) {
  const element = event.target as Element;
  const elementJob = getJobValue(element);
  //submit button is clicked
  if (elementJob === "toggle") {
    //task is checked/unchecked
    type rowAttributes = Element & { id: string };
    const row = element?.parentNode?.parentNode as rowAttributes;
    let id: number = +row.id;
    toggleTask(id);
  }
});
