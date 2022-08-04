var assignees = ['Hari', 'Shibo', 'Sarthak', 'Prabjoth', 'John Doe'];
var taskStatus;
(function (taskStatus) {
    taskStatus[taskStatus["INPROGRESS"] = 0] = "INPROGRESS";
    taskStatus[taskStatus["COMPLETED"] = 1] = "COMPLETED";
})(taskStatus || (taskStatus = {}));
var tasks = []; //list of all tasks
var listInProgress = document.getElementById("table_inProgress");
var listCompleted = document.getElementById("table_Completed");
var inputData = document.getElementById("input");
var taskTable = document.getElementById("taskTabel");
var options = { weekday: "short", day: "numeric", month: "short" };
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
    var row = document.createElement('tr');
    var colArray = [];
    for (var i = 0; i < 4; i++) {
        colArray[i] = document.createElement('td');
    }
    colArray[1].setAttribute('align', 'center');
    colArray[2].setAttribute('align', 'center');
    colArray[3].setAttribute('align', 'center');
    var checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('job', 'toggle');
    checkbox.setAttribute('id', "checkbox".concat(id));
    if (tasks[id].taskStatus === taskStatus.INPROGRESS) {
        checkbox.setAttribute('checked', '');
    }
    colArray[3].appendChild(checkbox);
    colArray.map(function (item) { row.appendChild(item); });
}
// interface formDataType{
//   taskName:string,
//    assignee:assigneeList,
//   dueDate:string
// }
var unHideError;
(function (unHideError) {
    unHideError[unHideError["taskNameError"] = 0] = "taskNameError";
    unHideError[unHideError["assigneeError"] = 1] = "assigneeError";
    unHideError[unHideError["dueDateError"] = 2] = "dueDateError";
})(unHideError || (unHideError = {}));
function unHide(error) {
    console.log("".concat(error));
    document.getElementById("".concat(error)).classList.add('display-hidden');
}
function Hide(error) {
    document.getElementById("".concat(error)).classList.remove('display-hidden');
}
function validateTask(newTask) {
    var todaysDate = new Date(); //getting the current date
    todaysDate.setHours(0, 0, 0, 0); //setting the time of this day to zero for comparision
    if (newTask.taskName.trim() == "") {
        //no task's name
        unHide(unHideError.taskNameError);
        return false;
    }
    else if (!newTask.assignee) {
        //no task's assignee
        unHide(unHideError.assigneeError);
        return false;
    }
    else if (newTask.dueDate < todaysDate) {
        // the date is in the past
        unHide(unHideError.dueDateError);
        return false;
    }
    Hide(unHideError.taskNameError);
    Hide(unHideError.assigneeError);
    Hide(unHideError.dueDateError);
    return true;
}
function getTaskObj(formData) {
    var newTask = {
        taskId: tasks.length,
        taskName: formData.taskName,
        assignee: formData.assignee,
        dueDate: new Date(formData.dueDate),
        taskStatus: taskStatus.COMPLETED
    };
    return newTask;
}
;
// sends the tasks for submission if it is valid
function submitTask() {
    var formData = new FormData(document.getElementById('form'));
    var newTask = getTaskObj(formData);
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
    var _a;
    var element = event.target; // return the clicked element inside list
    var attributesList = element === null || element === void 0 ? void 0 : element.attributes;
    var elementJob = attributesList.job.value;
    //submit button is clicked
    if (elementJob === "toggle") {
        var row = (_a = element === null || element === void 0 ? void 0 : element.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode;
        var id = +row.id;
        toggleTask(id);
    }
});
