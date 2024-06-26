export const categories = [
  { id: 1, name: "Work", color: "#42aafd" },
  { id: 2, name: "Personal", color: "#01bacc" },
  { id: 3, name: "Shopping", color: "#cd42fd" },
  { id: 4, name: "Health", color: "#ee2375" },
  { id: 5, name: "Other", color: "#8539f9" },
];

// export const tasks = [
//   {
//     id: "1",
//     title: "Do Yoga",
//     date: new Date(),
//     startTime: new Date().setHours(10, 30),
//     endTime: new Date().setHours(11, 0),
//     categoryId: 2,
//     description: "15 minutes",
//     done: true,
//   },
//   {
//     id: "2",
//     title: "Go shopping",
//     date: new Date(),
//     startTime: new Date().setHours(8, 0),
//     endTime: new Date().setHours(9, 0),
//     categoryId: 4,
//     description: "Buy bread",
//     done: false,
//   },
//   {
//     id: "3",
//     title: "Meeting",
//     date: new Date(),
//     startTime: new Date().setHours(12, 30),
//     endTime: new Date().setHours(13, 30),
//     categoryId: 1,
//     description: "Skype meeting with John",
//     done: false,
//   },
//   {
//     id: "4",
//     title: "Running",
//     date: new Date("2023-08-2"),
//     startTime: new Date("2023-08-2").setHours(8, 30),
//     endTime: new Date("2023-08-2").setHours(10, 30),
//     categoryId: 4,
//     description: "Go ruuning",
//     done: false,
//   },
//   {
//     id: "5",
//     title: "Lunch",
//     date: new Date('"2023-08-2"'),
//     startTime: new Date("2023-08-2").setHours(11, 30),
//     endTime: new Date("2023-08-2").setHours(12, 0),
//     categoryId: 3,
//     description: "Make lunch",
//     done: false,
//   },
// ];

export const tasks = (JSON.parse(localStorage.getItem("tasks")) ?? []).map(
  (task) => {
    return {
      ...task,
      date: new Date(task.date),
      startTime: new Date(task.startTime),
      endTime: new Date(task.endTime),
    };
  }
);
