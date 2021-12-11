var serverAddress = "http://python-env.eba-kvfipmqa.us-east-1.elasticbeanstalk.com/students";

window.onload = function() {
  showViewForm();
};

function showAddForm(){
    document.getElementById("addForm").style.display="block";
    document.getElementById("tablearea").style.display="none";
}

function showViewForm(){
    document.getElementById("addForm").style.display="none";
    document.getElementById("tablearea").style.display="block";

    fetch(serverAddress, {
      method: "GET"
    })
    .then(response => response.json())
    .then(json => {
      var tablearea = document.getElementById('tablearea'),
      table = document.createElement('table');

      table.setAttribute("id", 'studentTable');
      thead = document.createElement('thead');
      thead.setAttribute('class', 'thead-dark');

      tbody = document.createElement('tbody');
      if(json.students.length > 0){
        tr = document.createElement('tr');

        tr.appendChild(document.createElement('th'));
        tr.appendChild(document.createElement('th'));
        tr.appendChild(document.createElement('th'));
        tr.appendChild(document.createElement('th'));
        tr.appendChild(document.createElement('th'));
        
        tr.cells[0].appendChild(document.createTextNode('Id'));
        tr.cells[1].appendChild(document.createTextNode('Name'));
        tr.cells[2].appendChild(document.createTextNode('Contact number'));
        tr.cells[3].appendChild(document.createTextNode('Email Id'));
        tr.cells[4].appendChild(document.createTextNode('#'));
        
        thead.appendChild(tr);

        table.appendChild(thead);

        for (var i = 0; i < json.students.length; i++) {
          var tr = document.createElement('tr');

          var btnUpdate = document.createElement("button");
          btnUpdate.setAttribute('id', 'updateBtn' + json.students[i].id);
          btnUpdate.setAttribute('class', 'actionBtn updateBtn');
          btnUpdate.setAttribute('title', 'Update student details.');
          btnUpdate.setAttribute('onclick', `openDialogBox(${JSON.stringify(json.students[i])})`);
          btnUpdate.innerHTML ='<i class="fa fa-edit"></i>';

          var btnDelete = document.createElement("button");
          btnDelete.setAttribute('id', 'deleteBtn' + json.students[i].id);
          btnDelete.setAttribute('class', 'actionBtn deleteBtn');
          btnDelete.setAttribute('title', 'Delete record.');
          btnDelete.value = json.students[i].id;
          btnDelete.setAttribute('onclick', `deleteStudent(${json.students[i].id})`);
          btnDelete.innerHTML ='<i class="fa fa-trash" aria-hidden="true"></i>';

          tr.appendChild( document.createElement('td') );
          tr.appendChild( document.createElement('td') );
          tr.appendChild( document.createElement('td') );
          tr.appendChild( document.createElement('td') );
          tr.appendChild( document.createElement('td') );

          tr.cells[0].appendChild( document.createTextNode(json.students[i].id) );
          tr.cells[1].appendChild( document.createTextNode(json.students[i].name) );
          tr.cells[2].appendChild( document.createTextNode(json.students[i].contactNumber) );
          tr.cells[3].appendChild( document.createTextNode(json.students[i].emailId) );
          tr.cells[4].appendChild(btnDelete);
          tr.cells[4].appendChild(document.createTextNode(' '));
          tr.cells[4].appendChild(btnUpdate);
  
          tbody.appendChild(tr);
        }
      }else{
        var tr = document.createElement('tr');
  
        tr.appendChild( document.createElement('td') );
        tr.cells[0].appendChild( document.createTextNode('Data not available.!') );
        table.appendChild(tr);
      }
      table.appendChild(tbody);
      tablearea.appendChild(table);
    })
    .catch(err => {
      console.log(err);
    });

    const parent = document.getElementById("tablearea");
    const tableTag = document.getElementById('studentTable');
    
    if(parent.contains(tableTag)){
      parent.removeChild(tableTag);
    }
}

function openDialogBox(stdntRec){
  var updateStudentDialog = document.getElementById("updateStudentDialog"), loadMask = document.createElement("div");

  document.forms['updateStudentDialog'].elements['studentId'].value = stdntRec.id;
  document.forms['updateStudentDialog'].elements['name'].value = stdntRec.name;
  document.forms['updateStudentDialog'].elements['emailId'].value = stdntRec.emailId;
  document.forms['updateStudentDialog'].elements['contactNumber'].value = stdntRec.contactNumber;
  
  loadMask.style.width =  window.innerWidth + 'px';
  loadMask.style.height = window.innerHeight + 'px';
  loadMask.className = 'loadMask';
  
  loadMask.onclick = function(){
      document.body.removeChild(this);   
      updateStudentDialog.style.visibility = 'hidden';
  }
      
  document.body.appendChild(loadMask);
  
  updateStudentDialog.style.visibility = 'visible';
}

function validateAddForm() {
  var name = document.forms["addForm"]["name"];
  var emailId = document.forms["addForm"]["emailId"];
  var contactNumber = document.forms["addForm"]["contactNumber"];

  if (name.value == "") {
      window.alert("Please enter name.");
      name.focus();
      return false;
  }

  if (emailId.value == "") {
      window.alert("Please enter valid email address.");
      emailId.focus();
      return false;
  }

  if (contactNumber.value == "") {
      window.alert("Please enter contact number.");
      contactNumber.focus();
      return false;
  }

  return true;
}

function addStudent() {
  fetch(serverAddress, {
    method: "POST",
    body: JSON.stringify({
      name: document.forms['addForm'].elements['name'].value,
      contactNumber: document.forms['addForm'].elements['contactNumber'].value,
      emailId: document.forms['addForm'].elements['emailId'].value
    }),
    headers: {
    "Content-type": "text/plain"
    }
  })
  .then(response => response.json())
  .then(json => {
    showViewForm();
    if(json.success){
      alert("Record added successfully.");
    }
  })
  .catch(err => {
    console.log(err);
  });
}

function updateStudent() {
  fetch(serverAddress, {
    method: "PUT",
    body: JSON.stringify({
      id: document.forms['updateStudentDialog'].elements['studentId'].value,
      name: document.forms['updateStudentDialog'].elements['name'].value,
      contactNumber: document.forms['updateStudentDialog'].elements['contactNumber'].value,
      emailId: document.forms['updateStudentDialog'].elements['emailId'].value
    }),
    headers: {
    "Content-type": "text/plain"
    }
  })
  .then(response => response.json())
  .then(json => {
    showViewForm();
    if(json.success){
      alert("Record updated successfully.");
    }
  })
  .catch(err => {
    console.log(err);
  });
}

function deleteStudent(studentId) {
  fetch(serverAddress, {
    method: "DELETE",
    body: JSON.stringify({
      id: studentId
    }),
    headers: {
    "Content-type": "text/plain"
    }
  })
  .then(response => response.json())
  .then(json => {
    showViewForm();
    if(json.success){
      alert("Record deleted successfully!!");
    }
  })
  .catch(err => {
    console.log(err);
  });
}
