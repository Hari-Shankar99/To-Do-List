var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["INPROGRESS"] = 0] = "INPROGRESS";
    TaskStatus[TaskStatus["COMPLETED"] = 1] = "COMPLETED";
})(TaskStatus || (TaskStatus = {}));
var tasks = []; //list of all tasks
var listInProgress = document.getElementById("tableInProgress");
var listCompleted = document.getElementById("tableCompleted");
var form = document.getElementById("form");
var button = document.getElementById("button");
var taskTable = document.getElementById("taskTable");
var dateOptions = {
    weekday: "short",
    month: "short",
    day: "numeric"
};
/* delete tasks with task id */
function deleteTask(id) {
    var row = document.getElementById("".concat(id));
    row.remove();
}
/* toggles the status of the tasks */
function toggleTask(id) {
    if (tasks[id].taskStatus === TaskStatus.COMPLETED) {
        tasks[id].taskStatus = TaskStatus.INPROGRESS; // changing the status
    }
    else {
        tasks[id].taskStatus = TaskStatus.COMPLETED; // changing the status
    }
    deleteTask(id); //deleting from 1st list
    loadtask(id); //adding to other list
}
function loadtask(id) {
    //creating rows
    var row = document.createElement("tr");
    row.setAttribute("id", "".concat(id));
    var colArray = [];
    //creating 4 columns
    for (var i = 0; i < 4; i++) {
        colArray[i] = document.createElement("td");
    }
    colArray[1].setAttribute("align", "center");
    colArray[2].setAttribute("align", "center");
    colArray[3].setAttribute("align", "center");
    colArray[0].innerHTML = tasks[id].taskName;
    colArray[1].innerHTML = tasks[id].assignee;
    colArray[2].innerHTML = tasks[id].dueDate.toLocaleDateString("en-US", dateOptions);
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("job", "toggle");
    checkbox.setAttribute("id", "checkbox".concat(id));
    var target;
    //checking if it belongs to inProgress or Completed
    if (tasks[id].taskStatus === TaskStatus.INPROGRESS) {
        checkbox.setAttribute("checked", "");
        target = document.getElementById("tableCompleted");
    }
    else {
        target = document.getElementById("tableInProgress");
    }
    colArray[3].appendChild(checkbox);
    colArray.map(function (item) {
        row.appendChild(item);
    });
    //adding row
    target.appendChild(row);
}
//error when not a valid task form data
var ErrorType;
(function (ErrorType) {
    ErrorType["TASK_NAME_ERROR"] = "taskNameError";
    ErrorType["ASSIGNEE_ERROR"] = "assigneeError";
    ErrorType["INVALID_DUE_DATE_ERROR"] = "invalidDueDate";
    ErrorType["NO_DUE_DATE_ERROR"] = "noDueDate";
})(ErrorType || (ErrorType = {}));
//ADDING ERROR MESSAGE WHEN SOMETHING IS WRONG
function addErrorMsg(error) {
    var element;
    switch (error) {
        case "taskNameError":
            element = document.getElementById(error);
            element.innerHTML = "Please enter a Task Name";
            break;
        case "assigneeError":
            element = document.getElementById(error);
            element.innerHTML = "Please choose a Assignee Name";
            break;
        case "invalidDueDate":
            element = document.getElementById("dueDateError");
            element.innerHTML = "Please choose a Future Due Date";
            break;
        case "noDueDate":
            element = document.getElementById("dueDateError");
            element.innerHTML = "Please choose a Due Date";
            break;
    }
}
function removeErrorMsg() {
    document.getElementById("taskNameError").innerHTML = "";
    document.getElementById("assigneeError").innerHTML = "";
    document.getElementById("dueDateError").innerHTML = "";
}
function validateTask(newTask) {
    removeErrorMsg();
    var todaysDate = new Date(); //getting the current date
    todaysDate.setHours(0, 0, 0, 0); //setting the time of this day to zero for comparision
    var validity = true;
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
    }
    else if (isNaN(+newTask.dueDate)) {
        //no date
        addErrorMsg(ErrorType.NO_DUE_DATE_ERROR);
        validity = false;
    }
    return validity;
}
//convert form data to task object
function getTaskObj(formData) {
    var newTask = {
        taskId: tasks.length,
        taskName: formData.get("taskName"),
        assignee: formData.get("assignee"),
        dueDate: new Date(formData.get("dueDate")),
        taskStatus: TaskStatus.COMPLETED
    };
    return newTask;
}
// sends the tasks for submission if it is valid
function submitTask() {
    var formElement = document.getElementById("form");
    var formData = new FormData(formElement);
    var newTask = getTaskObj(formData);
    //valid tasks
    if (validateTask(newTask)) {
        tasks.push(newTask);
        loadtask(newTask.taskId); //load the new task
        //reset the input fields
        var form_1 = document.getElementById("form");
        form_1.reset();
    }
}
// return key to submit task
document.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        submitTask();
    }
});
function getJobValue(element) {
    // return the job value of the clicked element
    var attributesList = element.attributes;
    return attributesList.job.value;
}
// Add task button clicked
button.addEventListener("click", function (event) {
    var element = event.target;
    var elementJob = getJobValue(element);
    if (elementJob === "submit") {
        submitTask();
    }
});
//click monitoring
taskTable.addEventListener("click", function (event) {
    var _a;
    var element = event.target;
    var elementJob = getJobValue(element);
    //submit button is clicked
    if (elementJob === "toggle") {
        var row = (_a = element === null || element === void 0 ? void 0 : element.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode;
        var id = +row.id;
        toggleTask(id);
    }
});
