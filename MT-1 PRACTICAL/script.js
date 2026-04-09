function checkPrime() {
    var input = document.getElementById("number").value;
    if (input === "") {
        alert("Please enter a number.");
        return;
    }
    var num = Number(input);
    if (isNaN(num)) {
        alert("Invalid input. Enter a valid number.");
        return;
    }
    if (num <= 0) {
        alert("Please enter a positive number.");
        return;
    }
    var isPrime = true;
    if (num === 1) {
        isPrime = false;
    } else {
        for (var i = 2; i < num; i++) {
            if (num % i === 0) {
                isPrime = false;
                break;
            }
        }
    }
    var result = document.getElementById("result");
    if (isPrime) {
        result.innerHTML = num + " is a Prime Number.";
    } else {
        result.innerHTML = num + " is NOT a Prime Number.";
    }
}