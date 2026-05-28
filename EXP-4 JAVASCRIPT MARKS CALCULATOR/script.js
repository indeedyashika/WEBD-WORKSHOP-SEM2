function calculateresults(){
    let numberofsubjects = document.getElementById("numSubjects").value;
    if(numberofsubjects === "" || numberofsubjects <= 0){
        alert("Please enter a valid number of subjects.");
        return;
    }
    let totalmarks = 0;
    for(let i=1; i<=numberofsubjects; i++){
        let marks = prompt("Enter marks for Subject " + i + " (0-100)");
        if(marks === null){
            alert("Calculation cancelled.");
            return;
        }
        marks = parseFloat(marks);
        if(isNaN(marks) || marks < 0 || marks > 100){
            alert("Invalid marks entered for Subject " + i);
            return;
        }
        totalmarks += marks;
    }
    let percentage = (totalmarks/(numberofsubjects*100))*100;
    let average = totalmarks/numberofsubjects;
    let grade="";
    if(percentage>=90) grade="A";
    else if(percentage>=80) grade="B";
    else if(percentage>=70) grade="C";
    else if(percentage>=60) grade="D";
    else grade="F";
    let resultStatus = percentage>=40 ? "Pass" : "Fail";
    document.getElementById("results").innerHTML = `
        <p>Total Marks: ${totalmarks}</p>
        <p>Percentage: ${percentage.toFixed(2)}%</p>
        <p>Average: ${average.toFixed(2)}</p>
        <p>Grade: ${grade}</p>
        <p>Result: ${resultStatus}</p>
    `;
}