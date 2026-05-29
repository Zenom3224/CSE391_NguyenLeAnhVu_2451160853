function runTest(title, callback) {
    console.log("\n" + title);
    try {
        callback();
    } catch (error) {
        console.log(error.name + ": " + error.message);
    }
}

runTest("Đoạn 1", function () {
    console.log(x);
    var x = 5;
});

runTest("Đoạn 2", function () {
    console.log(y);
    let y = 10;
});

runTest("Đoạn 3", function () {
    const z = 15;
    z = 20;
    console.log(z);
});

runTest("Đoạn 4", function () {
    const arr = [1, 2, 3];
    arr.push(4);
    console.log(arr);
});

runTest("Đoạn 5", function () {
    let a = 1;
    {
        let a = 2;
        console.log("Trong block:", a);
    }
    console.log("Ngoài block:", a);
});
