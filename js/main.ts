enum TaskStatus {
  INPROGRESS,
  COMPLETED,
}

type AssigneesName =
  | "none"
  | "Hari"
  | "Shibo"
  | "Sarthak"
  | "Prabjoth"
  | "John Doe";

interface TaskType {
  taskId: number;
  taskName: string;
  assignee: AssigneesName;
  dueDate: Date;
  taskStatus: TaskStatus;
}

let tasks: TaskType[] = []; //list of all tasks

const listInProgress = document.getElementById(
  "tableInProgress"
) as HTMLTableElement;

const listCompleted = document.getElementById(
  "tableCompleted"
) as HTMLTableElement;

const form = document.getElementById("form") as HTMLFormElement;
const button = document.getElementById("button") as HTMLButtonElement;
const taskTable = document.getElementById("taskTable") as HTMLDivElement;

const dateOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
} as Intl.DateTimeFormatOptions;

/* delete tasks with task id */
function deleteTask(id: number) {
  let row = document.getElementById(`${id}`) as HTMLTableRowElement;
  row.remove();
}

/* toggles the status of the tasks */
function toggleTask(id: number) {
  if (tasks[id].taskStatus === TaskStatus.COMPLETED) {
    tasks[id].taskStatus = TaskStatus.INPROGRESS; // changing the status
  } else {
    tasks[id].taskStatus = TaskStatus.COMPLETED; // changing the status
  }
  deleteTask(id); //deleting from 1st list
  loadtask(id); //adding to other list
}

function loadtask(id: number) {
  //creating rows
  const row = document.createElement("tr");
  row.setAttribute("id", `${id}`);
  const colArray: HTMLTableCellElement[] = [];
  //creating 4 columns
  for (let i = 0; i < 4; i++) {
    colArray[i] = document.createElement("td");
  }

  colArray[1].setAttribute("align", "center");
  colArray[2].setAttribute("align", "center");
  colArray[3].setAttribute("align", "center");

  colArray[0].innerHTML = tasks[id].taskName;
  colArray[1].innerHTML = tasks[id].assignee;
  colArray[2].innerHTML = tasks[id].dueDate.toLocaleDateString(
    "en-US",
    dateOptions as Intl.DateTimeFormatOptions
  );

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("job", "toggle");
  checkbox.setAttribute("id", `checkbox${id}`);
  let target: Element;

  //checking if it belongs to inProgress or Completed
  if (tasks[id].taskStatus === TaskStatus.INPROGRESS) {
    checkbox.setAttribute("checked", "");
    target = document.getElementById("tableCompleted");
  } else {
    target = document.getElementById("tableInProgress");
  }

  colArray[3].appendChild(checkbox);

  colArray.map((item) => {
    row.appendChild(item);
  });
  //adding row
  target.appendChild(row);
}

//error when not a valid task form data
enum ErrorType {
  TASK_NAME_ERROR = "taskNameError",
  ASSIGNEE_ERROR = "assigneeError",
  INVALID_DUE_DATE_ERROR = "invalidDueDate",
  NO_DUE_DATE_ERROR = "noDueDate",
}

//ADDING ERROR MESSAGE WHEN SOMETHING IS WRONG
function addErrorMsg(error: ErrorType) {
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
  document.getElementById("taskNameError").innerHTML = "";
  document.getElementById("assigneeError").innerHTML = "";
  document.getElementById("dueDateError").innerHTML = "";
}

function validateTask(newTask: TaskType): boolean {
  removeErrorMsg();
  let todaysDate = new Date(); //getting the current date
  todaysDate.setHours(0, 0, 0, 0); //setting the time of this day to zero for comparision
  let validity: boolean = true;

  if (newTask.taskName.trim() == "") {
    //no task's name
    console.log(newTask.taskName);
    addErrorMsg(ErrorType.TASK_NAME_ERROR);
    validity = false;
  }
  if (!newTask.assignee) {
    //no task's assignee
    addErrorMsg(ErrorType.ASSIGNEE_ERROR);
    validity = false;
  }
  if (newTask.dueDate < todaysDate) {
    // the date is in the past
    addErrorMsg(ErrorType.INVALID_DUE_DATE_ERROR);
    validity = false;
  } else if (isNaN(+newTask.dueDate)) {
    //no date
    addErrorMsg(ErrorType.NO_DUE_DATE_ERROR);
    validity = false;
  }
  return validity;
}
type formDataType = FormData & {
  taskName: string;
  assignee: AssigneesName;
  dueDate: string;
};

//convert form data to task object
function getTaskObj(formData: formDataType): TaskType {
  let newTask: TaskType = {
    taskId: tasks.length,
    taskName: formData.get("taskName") as string,
    assignee: formData.get("assignee") as AssigneesName,
    dueDate: new Date(formData.get("dueDate") as string),
    taskStatus: TaskStatus.COMPLETED,
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
    //reset the input fields
    const form = document.getElementById("form") as HTMLFormElement;
    form.reset();
  }
}

// return key to submit task
document.addEventListener("keyup", function (event: Event & {key:string}) {
  if (event.key === "Enter") {
    submitTask();
  }
});

function getJobValue(element: Element): string {
  // return the job value of the clicked element

  type hasJob = NamedNodeMap & { job: { value: string } };
  const attributesList = element.attributes as hasJob;
  return attributesList.job.value as string;
}

// Add task button clicked
button.addEventListener("click", function (event: Event) {
  const element = event.target as Element;
  const elementJob = getJobValue(element);
  if (elementJob === "submit") {
    submitTask();
  }
});

//click monitoring
taskTable.addEventListener("click", function (event: Event) {
  const element = event.target as Element;
  const elementJob = getJobValue(element);
  //submit button is clicked
  if (elementJob === "toggle") {
    type rowAttributes = Element & { id: string };
    const row = element?.parentNode?.parentNode as rowAttributes;
    let id: number = +row.id;
    toggleTask(id);
  }
});
