function showPage(pageId){

document.querySelectorAll('.page')
.forEach(page=>page.classList.add('hidden'));

document.getElementById(pageId)
.classList.remove('hidden');

if(pageId==="adminPage"){
loadData();
}
}

let donors=
JSON.parse(localStorage.getItem("donors")) || [];

let requests=
JSON.parse(localStorage.getItem("requests")) || [];

function registerDonor(){

let donor={
name:dName.value,
age:dAge.value,
gender:dGender.value,
blood:dBlood.value,
mobile:dMobile.value,
address:dAddress.value
};

donors.push(donor);

localStorage.setItem(
"donors",
JSON.stringify(donors)
);

alert("Donor Registered Successfully");

dName.value="";
dAge.value="";
dMobile.value="";
dAddress.value="";
}

function checkBlood(){

let blood=requiredBlood.value;

let count=
donors.filter(
d=>d.blood===blood
).length;

let status=
count>0?
"Available ("+count+")":
"Not Available";

result.innerHTML=
blood+" Blood "+status;

requests.push({
patient:pName.value,
mobile:pMobile.value,
blood:blood,
status:status
});

localStorage.setItem(
"requests",
JSON.stringify(requests)
);

pName.value="";
pMobile.value="";
}

function adminAccess(){

let user=adminUser.value;
let pass=adminPass.value;

if(!localStorage.getItem("adminUser")){

localStorage.setItem(
"adminUser",user
);

localStorage.setItem(
"adminPass",pass
);

alert(
"Admin Account Created"
);

showPage("adminPage");

return;
}

if(
user===localStorage.getItem("adminUser")
&&
pass===localStorage.getItem("adminPass")
){
showPage("adminPage");
}
else{
alert("Wrong Username or Password");
}
}

function loadData(){

let donorTable=
document.getElementById("donorTable");

donorTable.innerHTML=
`
<tr>
<th>Name</th>
<th>Age</th>
<th>Gender</th>
<th>Blood</th>
<th>Mobile</th>
<th>Address</th>
</tr>
`;

donors.forEach(d=>{

donorTable.innerHTML+=`
<tr>
<td>${d.name}</td>
<td>${d.age}</td>
<td>${d.gender}</td>
<td>${d.blood}</td>
<td>${d.mobile}</td>
<td>${d.address}</td>
</tr>
`;
});

let requestTable=
document.getElementById("requestTable");

requestTable.innerHTML=
`
<tr>
<th>Patient</th>
<th>Mobile</th>
<th>Blood</th>
<th>Status</th>
</tr>
`;

requests.forEach(r=>{

requestTable.innerHTML+=`
<tr>
<td>${r.patient}</td>
<td>${r.mobile}</td>
<td>${r.blood}</td>
<td>${r.status}</td>
</tr>
`;
});
}

function logout(){
showPage("homePage");
}