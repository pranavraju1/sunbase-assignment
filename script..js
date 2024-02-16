const form = document.querySelector("#submit");
const inputBtn = document.querySelector("#inputBtn");
const selectBtn = document.querySelector("#selectBtn");
const textareaBtn = document.querySelector("#textareaBtn");
const main = document.querySelector(".main");

//adding input textregion
inputBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const inputItem = createInputItem("Sample Input");
  main.appendChild(inputItem);
});

//adding select dropdown
selectBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const inputItem = createInputItem("Sample Select");
  main.appendChild(inputItem);
});

//adding textarea
textareaBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const inputItem = createInputItem("Sample Textarea");
  main.appendChild(inputItem);
});

//common create form for inputs
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
  if (labelText === "Sample Textarea") {                  //for textarea
    const textarea = document.createElement("textarea");
    textarea.cols = "20";
    textarea.rows = "10";
    textarea.placeholder = "Please enter in textarea";
    inputItem.appendChild(textarea);
  } else if (labelText === "Sample Select") {             //for select dropdown
    const select = document.createElement("select");
    for (let i = 0; i < 3; i++) {
      const option = document.createElement("option");
      option.innerText = i;
      option.value = i;
      select.appendChild(option);
    }
    inputItem.appendChild(select);
  } else {                                                //for input text
    input.placeholder = "Please enter";
    input.type = "text";
    inputItem.appendChild(input);
  }

  // draggable item
  inputItem.addEventListener("dragstart", () => {
    inputItem.classList.add("dragging");
  });
  inputItem.addEventListener("dragend", () => {
    inputItem.classList.remove("dragging");
  });

  button.addEventListener("click", () => {                //delete button
    inputItem.remove();
  });

  return inputItem;
}

main.addEventListener("dragover", (e) => {              //element drop place logic
  e.preventDefault();
  const afterElement = getDragAfterElement(main, e.clientY);
  console.log(afterElement);
  const draggable = document.querySelector(".dragging");
  if (afterElement == null) {
    main.appendChild(draggable);                        //if not existing place at end
  } else {
    main.insertBefore(draggable, afterElement);         //else place before
  }
});

function getDragAfterElement(main, y) {                 //logic to get next element while dragging
  const draggableElements = [
    ...main.querySelectorAll(".input-item:not(.dragging)"),
  ];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      // console.log(box);
      const offset = Math.floor(y - box.top - box.height / 2);
      console.log(offset);
      if (offset < 0 && offset > closest.offset) {      //if less than zero element hovering on elemnts abovve
        return { offset: offset, element: child };
      } else {                                          //else element is hovering on elemnts below
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

form.addEventListener("click", (e) => {
  e.preventDefault();
  let inputItems = document.querySelectorAll(".input-item");
  if(inputItems.length === 0){                          //checking if any element is added in form
    alert("Add Form Elements");
    return;
  }
  let obj = [];
  inputItems.forEach((item,index) => {                //preparing json output
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
