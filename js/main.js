var assignees = ["none", "Hari", "Shibo", "Sarthak", "Prabjoth", "John Doe"];
var taskStatus;
(function (taskStatus) {
    taskStatus[taskStatus["INPROGRESS"] = 0] = "INPROGRESS";
    taskStatus[taskStatus["COMPLETED"] = 1] = "COMPLETED";
})(taskStatus || (taskStatus = {}));
var tasks = []; //list of all tasks
var listInProgress = document.getElementById("tableInProgress");
var listCompleted = document.getElementById("tableCompleted");
var form = document.getElementById("form");
var button = document.getElementById("button");
var taskTable = document.getElementById("taskTable");
var options = { weekday: 'short', month: 'short', day: 'numeric' };
/* delete tasks with task id */
function deleteTask(id) {
    var row = document.getElementById("".concat(id));
    row.remove();
}
/* toggles the status of the tasks */
function toggleTask(id) {
    if (tasks[id].taskStatus === taskStatus.COMPLETED) {
        tasks[id].taskStatus = taskStatus.INPROGRESS;
    } // changing the status
    else {
        tasks[id].taskStatus = taskStatus.COMPLETED;
    } // changing the status
    deleteTask(id); //deleting from 1st list
    loadtask(id); //adding to other list
}
function loadtask(id) {
    //checking if it belongs to done or not done
    var row = document.createElement("tr");
    row.setAttribute('id', "".concat(id));
    var colArray = [];
    for (var i = 0; i < 4; i++) {
        colArray[i] = document.createElement("td");
    }
    colArray[1].setAttribute("align", "center");
    colArray[2].setAttribute("align", "center");
    colArray[3].setAttribute("align", "center");
    colArray[0].innerHTML = tasks[id].taskName;
    colArray[1].innerHTML = tasks[id].assignee;
    colArray[2].innerHTML = tasks[id].dueDate.toLocaleDateString("en-US", options);
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("job", "toggle");
    checkbox.setAttribute("id", "checkbox".concat(id));
    var target;
    if (tasks[id].taskStatus === taskStatus.INPROGRESS) {
        checkbox.setAttribute("checked", "");
        target = document.getElementById('tableCompleted');
    }
    else {
        target = document.getElementById('tableInProgress');
    }
    colArray[3].appendChild(checkbox);
    colArray.map(function (item) {
        row.appendChild(item);
    });
    target.appendChild(row);
}
// interface formDataType{
//   taskName:string,
//    assignee:assigneeList,
//   dueDate:string
// }
var errorType;
(function (errorType) {
    errorType["taskNameError"] = "taskNameError";
    errorType["assigneeError"] = "assigneeError";
    errorType["invalidDueDateError"] = "invalidDueDate";
    errorType["noDueDateError"] = "noDueDate";
})(errorType || (errorType = {}));
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
    document.getElementById("taskNameError").innerHTML = '';
    document.getElementById("assigneeError").innerHTML = '';
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
    else if (isNaN(+newTask.dueDate)) {
        addErrorMsg(errorType.noDueDateError);
        validity = false;
    }
    return validity;
}
function getTaskObj(formData) {
    var newTask = {
        taskId: tasks.length,
        taskName: formData.get("taskName"),
        assignee: formData.get("assignee"),
        dueDate: new Date(formData.get("dueDate")),
        taskStatus: taskStatus.COMPLETED
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
    }
    //reset the input fields
    var form = document.getElementById("form");
    form.reset();
}
// return key to submit task
document.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        submitTask();
    }
});
function getJobValue(element) {
    // return the clicked element inside list
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
