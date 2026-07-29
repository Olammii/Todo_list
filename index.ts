const input = document.querySelector<HTMLInputElement>("#task")!;
const form = document.querySelector<HTMLFormElement>("#task-form")!;
const container = document.querySelector<HTMLDivElement>("#task-container")!;
const time = document.querySelector("#time")!;
const secondsel = document.querySelector<HTMLSpanElement>("#seconds")!;
const greetingel = document.querySelector<HTMLHeadingElement>("#greeting")!;
const dateel = document.querySelector<HTMLParagraphElement>("#date")!;
const quoteel = document.querySelector<HTMLParagraphElement>('#quote')!;
const authorel = document.querySelector<HTMLSpanElement>("#author")!;

interface Task {
  id: string;
  task: string;
  completeTask: () => void;
  removeTask: () => void;
}

const tasks: Task[] = [
  // {
  //   id: "2233",
  //   task: "ytruieo",
  //   completeTask() {
  //     complete();
  //   },
  //   removeTask() {
  //     remove(this.id);
  //   },
  // },
  // {
  //   id: "2233",
  //   task: "ytruieo",
  //   completeTask() {
  //     complete();
  //   },
  //   removeTask() {
  //     remove(this.id);
  //   },
  // },
];

// Get tasks from localStorage
const tasksFromStorage = localStorage.getItem("tasks");

if(tasksFromStorage){
  console.log(tasksFromStorage)
  const stored: {id:string ; task: string}[] = JSON.parse(tasksFromStorage)
  stored.forEach(({ id, task}) => {

    const removeTask = () => remove(id);
    const completeTask = () => {

      const store = localStorage.getItem("tasks");
      if(!store) return;

      const remains: { id: string; task: string }[] = JSON.parse(store).filter(
        (item:{id:string}) => item.id !== id
      );
      localStorage.setItem('tasks', JSON.stringify(remains));
      setTimeout(removeTask, 30000);
      const index = tasks.findIndex((item: {id:string})=> item.id === id)
      tasks.splice(index, 1)
      console.log(index)
    };
    tasks.push({ id, task, completeTask , removeTask});
  });
  console.log()
  displayTask(tasks)

}

function createTask(task: string): Task {
  

  const id: string = crypto.randomUUID();
  const completeTask = () => {
    const stored = localStorage.getItem('tasks');
    if(!stored) return;
    const remains = JSON.parse(stored).filter((item: {id: string}) => item.id !== id) 
    localStorage.setItem('tasks', JSON.stringify(remains));
    const index = tasks.findIndex((item: { id: string }) => item.id === id);
    tasks.splice(index, 1);
    setTimeout(removeTask, 30000)

  };
  const removeTask = ():void => {
    remove(id);
  };
  return { id, task, completeTask, removeTask };
}

function dateTime(): void {
  const now: Date = new Date();

  const hours: number = now.getHours();
  const hoursString: string = String(hours).padStart(2, "0");
  const minutes: string = String(now.getMinutes()).padStart(2, "0");
  const seconds: string = String(now.getSeconds()).padStart(2, "0");

  const greeting: string =
    hours < 12
      ? "Good Morning"
      : hours >= 12 && hours < 16
        ? "Good Afternoon"
        : "Good Evening";

  const date = now.toDateString();

  const timeString: string = `${hoursString}:${minutes}`;

  time.textContent = timeString;
  secondsel.textContent = ` :${seconds}`;
  greetingel.textContent = greeting;
  dateel.textContent = date;
}

dateTime();
setInterval(dateTime, 1000);

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  const item = createTask(input?.value);
  tasks.push(item);
  displayTask(tasks);
  localStorage.setItem('tasks', JSON.stringify(tasks))
  console.log(tasks);
  form.reset();
});

console.log(tasks);

function createDiv({ id, task, completeTask, removeTask }: Task) {
  const body = document.createElement("div");
  body.classList.add(
    "flex",
    "flex-col",
    'gap-2',
    "min-w-110",
    "max-w-250",
    "bg-transparent",
    "px-8",
    "py-3",
    "rounded-2xl",
    "backdrop-blur-[7.9px]",
    "shadow-[0_4px_30px_rgba(0,0,0,0.1)]",
    "border-[1px_solid_rgba(255,255,255,0.3)]",
  );
  const emoji = document.createElement("div");
  const para = document.createElement("p");
  para.classList.add("px-3", "py-1", "text-2xl", "wrap-break-word", "inline");
  const btnContainer = document.createElement("div");
  btnContainer.classList.add("flex", "justify-end", "gap-3");
  const btn1 = document.createElement("button");
  btn1.classList.add(
    "border",
    "border-gray-400",
    "hover:bg-white",
    "hover:text-black",
    "hover:shadow-[0px_0px_30px_5px_rgba(0,0,0,0.1)]",
    "active:scale-x-90",
    "rounded-2xl",
    "px-3",
    "py-1",
    "text-center",
  );
  const btn2 = document.createElement("button");
  btn2.classList.add(
    "border",
    'hover:border-none',
    "hover:bg-red-400",
    'hover:text-black',
    "rounded-2xl",
    "px-3",
    "py-1",
    "text-center",
  );

  body.setAttribute("id", id);
  para.textContent = task;
  btn1.textContent = "complete";
  btn2.textContent = "Remove";

  btn1.addEventListener("click", () => {
    completeTask();
    emoji.classList.add("before:content-['✅']", "before:text-lg");
    para.classList.add("line-through");
  });
  btn2.addEventListener("click",removeTask);

  container.appendChild(body);
  body.appendChild(emoji);
  emoji.appendChild(para);
  body.appendChild(btnContainer);
  btnContainer.appendChild(btn1);
  btnContainer.appendChild(btn2);
}

function displayTask(task: Task[]) {
  container.innerHTML = "";
  task.forEach((item) => {
    createDiv(item);
  });
}


const remove = (id: string) => {
  const i = tasks.findIndex((item) => item.id === id);
  tasks.splice(i, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks))
  alert("task deleted");
  displayTask(tasks);
};


//displayTask(tasks);
const rand = Math.floor(Math.random()*100)+1;
const API_KEY = "uLq7O9a8a0a91W6EtAZtwqA6uconZ2Q9J09f9Au3FCJoXQ0256UWXwPe";
const url = `https://api.pexels.com/v1/search?query=green&orientation=landscape&page=${rand}&per_page=1`;

async function getBackGround(): Promise<void> {
  try {
    const data = await fetch(url, {
      headers: {
        Authorization: API_KEY
      }
    });
    const result = await data.json();
    const imageUrl = result.photos[0].src.original;
   

    //const imageUrl = result.urls.regular;
    //const nasa = result.url;

    document.body.style.backgroundImage = `url(${imageUrl})`;

    console.log(result.photos[0].src.original);
  } catch (error) {return}
}

const gerQuote = async () => {
  try {
    const quoteReq = await fetch("http://api.quotable.io/random");
    const result = await quoteReq.json();
    quoteel.textContent = result["content"];
    authorel.textContent = ` - ${result["author"]}`;
  }catch(error){
    return
  }
  
}

window.addEventListener('DOMContentLoaded',() => {
  getBackGround();
  gerQuote()

})
