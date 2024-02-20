const copyButton = document.getElementById("copy-code-button");
copyButton.addEventListener("click", e => {
    navigator.clipboard.writeText(document.getElementById("program-code").value).then(
        () => { // Success
            copyButton.value = "Copied!";
            console.log("Clipboard successfully written");
        },
        () => { // Fail
            copyButton.value = "Failed!";
            copyButton.style.backgroundColor = "#f38ba8";
            console.log("Clipboard failed to write");
        }
    );
    setTimeout(() => {
        copyButton.value = "Copy";
        copyButton.style.backgroundColor = "#a6e3a1";
    }, 1500);
});
