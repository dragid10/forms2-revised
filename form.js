$(function () { // Waits until document has loaded before it proceeds with any of the JS

    // Just some initialization
    var formData = "", firstname = "", lastname = '', miamiuid = '', hometown = '', currentcity = '', comment = '', myData = '',
        uid = '', tempObj = {}, obj = "";

    // Get request to get data loaded on the campbest server
    // "http://oladelaa.270e.csi.miamioh.edu:3400/student"
    function getMethod() {
    	$.get("http://oladelaa.270e.csi.miamioh.edu:3400/student", function (data, status) {
        console.log("Status is (GET): " + status + "\nData is: " + data);

        // If the connection went through, the and there is data, then save it to a local variable
        if (status === "success" && data != "") {
            formData = data.data;
            console.log("Status was good! data assigned to formData: ");
            console.log(formData);

        }
    }, "json").error(function () {
        // Indicates that something is wrong, and couldn't get the data
        alert("Something went wrong! Could not get data from Campbest (Probably because CORS isn't being allowed)");
    });
    }

    getMethod();

    // Updates the left column with the data from the server
    $("#updateLeft").click(function () {
    	getMethod();
        obj = formData[0];
        console.log(obj);
        // Goes through and created new rows based on the parsed data by appending them to the HTML
        for (var i = 0; i < formData.length; i++) {
            var info = formData[i];

            $("#tableBody").append("<tr>").append("<td>" + info.firstname + "</td>")
                .append("<td>" + info.lastname + "</td>").append("<td>" + info.currentcity + "</td>")
                .append("<td>" + info.uid + "</td>").append("<td>" + info["ip"] + "</td>")
                .append("<td>" + info["updateTime"] + "</td>").append("</tr>");
        }
    });

    // Any of the selectors listed below will hide their respective alert boxes if the content in their input is more than 2 chars long
    $("#firstname, #lastname, #miamiuid, #hometown, #currentcity, #comment").keyup(function () {
        // Stores input value in a variable
        var content = $(this).val();

        // Saves the values from the fields into variables to use in POST
        firstname = $("#firstname").val();
        lastname = $("#lastname").val();
        miamiuid = $("#miamiuid").val();
        hometown = $("#hometown").val();
        currentcity = $("#currentcity").val();
        comment = $("#comment").val();
        uid = "oladelaa";

        // Creates Obj with the values (THAT APPARENTLY DOESN"T NEED TO BE STRINGIFIED)
        tempObj = {
            "firstname": firstname,
            "lastname": lastname,
            "miamiuid": miamiuid,
            "hometown": hometown,
            "currentcity": currentcity,
            "comment": comment,
            "uid": miamiuid.toLowerCase(),
            "option1": "0",
            "option2": "1",
            "option3": "0",
            "year": "Sophomore"
        };

        // Just some standard debugging
        console.log("content is " + content);

        // If the text in the input field is at least 2 characters, then hide the alert boxes for said field
        if (content.length >= 2) {
            $(this).siblings(".alert").fadeOut();
            $("#submitError").fadeOut();
        }

        // Checks to see if all necessary fields are filled out. If the fields are not filled out, then It'll prevent the submission
        $("#submitButton").unbind().click(function () {
            if (($("#firstname").val() || $("#lastname").val() || $("#miamiuid").val() || $("#hometown").val() ||
                $("#currentcity").val() || $("#comment").val()) === ("" || " " )) {
                $("#myform").submit(function (e) {
                    $("#submitError").show();
                    e.preventDefault();
                })
            } else {
                // What to do if all the fields are filled out

                // Sets up a POST request to the server
                $.post("http://oladelaa.270e.csi.miamioh.edu:3400/student", tempObj, function (data, status) {
                    // If data successfully submitted, then show an alert box
                    if (status === "ok") {
                        console.log("POST STATUS: " + status);
                        console.log(data);
                        alert("Form successfully submitted!");
                    }

                    getMethod();
                }, "json").error(function () {
                    // If data not successfully submitted, then show the status message and an alert dialog
                    console.log("Status: " + status);
                    alert("Form not submitted! Error occurred!");
                });
            }
        });
    });
});
