const form = document.querySelector("#submit");
const inputBtn = document.querySelector("#inputBtn");
const selectBtn = document.querySelector("#selectBtn");
const textareaBtn = document.querySelector("#textareaBtn");
const main = document.querySelector(".main");

inputBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const inputItem = createInputItem("Sample Input");
  main.appendChild(inputItem);
});

selectBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const inputItem = createInputItem("Sample Select");
  main.appendChild(inputItem);
});

textareaBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const inputItem = createInputItem("Sample Textarea");
  main.appendChild(inputItem);
});

function createInputItem(labelText) {
  const inputItem = document.createElement("div");
  inputItem.className = "input-item";
  inputItem.draggable = true;

  const details = document.createElement("div");
  details.className = "details";

  const label = document.createElement("label");
  label.innerText = labelText;

  const button = document.createElement("button");
  button.className = "delete"
  button.innerText = "Delete";

  details.appendChild(label);
  details.appendChild(button);
  inputItem.appendChild(details);

  const input = document.createElement("input");
  if (labelText === "Sample Textarea") {
    const textarea = document.createElement("textarea");
    textarea.cols = "20";
    textarea.rows = "10";
    textarea.placeholder = "Please enter in textarea";
    inputItem.appendChild(textarea);
  } else if (labelText === "Sample Select") {
    const select = document.createElement("select");
    for (let i = 0; i < 3; i++) {
      const option = document.createElement("option");
      option.innerText = i;
      option.value = i;
      select.appendChild(option);
    }
    inputItem.appendChild(select);
  } else {
    input.placeholder = "Please enter";
    input.type = "text";
    inputItem.appendChild(input);
  }

  inputItem.addEventListener("dragstart", () => {
    inputItem.classList.add("dragging");
  });

  inputItem.addEventListener("dragend", () => {
    inputItem.classList.remove("dragging");
  });

  button.addEventListener("click", () => {
    inputItem.remove();
  });

  return inputItem;
}

main.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(main, e.clientY);
  console.log(afterElement);
  const draggable = document.querySelector(".dragging");
  if (afterElement == null) {
    main.appendChild(draggable);
  } else {
    main.insertBefore(draggable, afterElement);
  }
});

function getDragAfterElement(main, y) {
  const draggableElements = [
    ...main.querySelectorAll(".input-item:not(.dragging)"),
  ];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      // console.log(box);
      const offset = Math.floor(y - box.top - box.height / 2);
      console.log(offset);
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

form.addEventListener("click", (e) => {
  e.preventDefault();
  let inputItems = document.querySelectorAll(".input-item");
  if(inputItems.length === 0){
    alert("Add Form Elements");
    return;
  }
  let obj = [];
  inputItems.forEach((item,index) => {
    let type = item.childNodes[1].localName;
    if (type === "input") {
      obj.push({
        id: new Date().getTime()+index,
        type: type,
        label: item.childNodes[0].firstChild.innerText,
        placeholder:item.childNodes[1].placeholder,
        value: item.childNodes[1].value
      });
    }else if(type === "select"){
      let selectOptions=[];
      item.childNodes[1].childNodes.forEach((element)=>{
        selectOptions.push(element.innerText);
      })
      obj.push({
        id: new Date().getTime()+index,
        type: type,
        label: item.childNodes[0].firstChild.innerText,
        options: selectOptions,
        value: item.childNodes[1].value
      });
    }else if (type === "textarea") {
      obj.push({
        id: new Date().getTime()+index,
        type: type,
        label: item.childNodes[0].firstChild.innerText,
        placeholder:item.childNodes[1].placeholder,
        value: item.childNodes[1].value
      });
    }    
  });
  let displayDetails = document.querySelector(".dispaly-detail") ;
  console.log(obj);
  const objJson = JSON.stringify(obj);
  console.log(objJson);
  displayDetails.innerText = objJson; 

});
