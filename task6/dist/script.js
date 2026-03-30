function calculateAge() {
    const inputDate = document.getElementById("birthdate").value
    if (inputDate===""){
        alert("Please Enter the date ")
        return;
    }
 const birthdate = new Date(inputDate);
 const today = new Date();
 let years = today.getFullYear() - birthdate.getFullYear();
 let months = today.getMonth() - birthdate.getMonth();
 let days = today.getDate() - birthdate.getDate();
 if (days < 0) {
        months--;
        
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        days += lastMonth;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

 document.getElementById("out-year").innerText = years;
 document.getElementById("out-month").innerText = months;
 document.getElementById("out-day").innerText = days;
}