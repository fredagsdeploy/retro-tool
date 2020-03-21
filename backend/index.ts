import socketio from "socket.io";
import * as uuid from "uuid";
import { sample } from "lodash";
import { Note, Text } from "./interface";

const io = socketio(1234);
const usedNames = new Set<string>();
const notes = new Map<string, Note>();
const texts = new Map<string, Text>();
let largestZ = 0;

const updateNote = (id: string, newParams: Partial<Note>): Note | undefined => {
  const oldNote = notes.get(id);

  if (!oldNote) {
    return undefined;
  }

  const newNote: Note = {
    ...oldNote,
    ...newParams,
    z: largestZ++
  };

  notes.set(id, newNote);

  return newNote;
};

const generateUniqueName = () => {
  let name = "";
  do {
    if (usedNames.size === names.length) {
      usedNames.clear();
    }
    name = sample(names)!;
  } while (usedNames.has(name));
  usedNames.add(name);
  return name;
};

io.on("connection", socket => {
  const id = uuid.v4();
  const name = generateUniqueName();

  socket.on("mouse", event => {
    const { x, y } = event;
    socket.broadcast.volatile.emit("mouse", { x, y, id, name });
  });

  socket.on("create-text", event => {
    const id = uuid.v4();
    const { x, y, color, content } = event;
    const newText: Text = {
      id,
      x,
      y,
      content,
      color
    };
    texts.set(id, newText);
    io.emit("update-text", newText);
  });

  socket.on("update-text-content", (updatedText: Text) => {
    texts.set(updatedText.id, updatedText);
    io.emit("update-text", updatedText);
  });

  socket.on("create-note", event => {
    const id = uuid.v4();
    const { x, y } = event;
    const newNote: Note = {
      content: `crap\n // ${name} `,
      color:
        "#" +
        Math.random()
          .toString(16)
          .substring(9),
      id,
      x,
      y,
      z: largestZ++
    };

    notes.set(id, newNote);

    io.emit("update-note", newNote);
  });

  socket.on("move-note", event => {
    const { id, x, y } = event;
    const newNote = updateNote(id, { x, y });

    if (!newNote) {
      return;
    }

    socket.broadcast.volatile.emit("update-note", newNote);
  });

  socket.on("drop-note", event => {
    const { id, x, y } = event;
    const newNote = updateNote(id, { x, y });

    if (!newNote) {
      return;
    }

    io.emit("update-note", newNote);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("remove", { id });
  });
});

const names = [
  "Liam",
  "Emma",
  "Noah",
  "Olivia",
  "William",
  "Ava",
  "James",
  "Isabella",
  "Oliver",
  "Sophia",
  "Benjamin",
  "Charlotte",
  "Elijah",
  "Mia",
  "Lucas",
  "Amelia",
  "Mason",
  "Harper",
  "Logan",
  "Evelyn",
  "Alexander",
  "Abigail",
  "Ethan",
  "Emily",
  "Jacob",
  "Elizabeth",
  "Michael",
  "Mila",
  "Daniel",
  "Ella",
  "Henry",
  "Avery",
  "Jackson",
  "Sofia",
  "Sebastian",
  "Camila",
  "Aiden",
  "Aria",
  "Matthew",
  "Scarlett",
  "Samuel",
  "Victoria",
  "David",
  "Madison",
  "Joseph",
  "Luna",
  "Carter",
  "Grace",
  "Owen",
  "Chloe",
  "Wyatt",
  "Penelope",
  "John",
  "Layla",
  "Jack",
  "Riley",
  "Luke",
  "Zoey",
  "Jayden",
  "Nora",
  "Dylan",
  "Lily",
  "Grayson",
  "Eleanor",
  "Levi",
  "Hannah",
  "Isaac",
  "Lillian",
  "Gabriel",
  "Addison",
  "Julian",
  "Aubrey",
  "Mateo",
  "Ellie",
  "Anthony",
  "Stella",
  "Jaxon",
  "Natalie",
  "Lincoln",
  "Zoe",
  "Joshua",
  "Leah",
  "Christopher",
  "Hazel",
  "Andrew",
  "Violet",
  "Theodore",
  "Aurora",
  "Caleb",
  "Savannah",
  "Ryan",
  "Audrey",
  "Asher",
  "Brooklyn",
  "Nathan",
  "Bella",
  "Thomas",
  "Claire",
  "Leo",
  "Skylar",
  "Isaiah",
  "Lucy",
  "Charles",
  "Paisley",
  "Josiah",
  "Everly",
  "Hudson",
  "Anna",
  "Christian",
  "Caroline",
  "Hunter",
  "Nova",
  "Connor",
  "Genesis",
  "Eli",
  "Emilia",
  "Ezra",
  "Kennedy",
  "Aaron",
  "Samantha",
  "Landon",
  "Maya",
  "Adrian",
  "Willow",
  "Jonathan",
  "Kinsley",
  "Nolan",
  "Naomi",
  "Jeremiah",
  "Aaliyah",
  "Easton",
  "Elena",
  "Elias",
  "Sarah",
  "Colton",
  "Ariana",
  "Cameron",
  "Allison",
  "Carson",
  "Gabriella",
  "Robert",
  "Alice",
  "Angel",
  "Madelyn",
  "Maverick",
  "Cora",
  "Nicholas",
  "Ruby",
  "Dominic",
  "Eva",
  "Jaxson",
  "Serenity",
  "Greyson",
  "Autumn",
  "Adam",
  "Adeline",
  "Ian",
  "Hailey",
  "Austin",
  "Gianna",
  "Santiago",
  "Valentina",
  "Jordan",
  "Isla",
  "Cooper",
  "Eliana",
  "Brayden",
  "Quinn",
  "Roman",
  "Nevaeh",
  "Evan",
  "Ivy",
  "Ezekiel",
  "Sadie",
  "Xavier",
  "Piper",
  "Jose",
  "Lydia",
  "Jace",
  "Alexa",
  "Jameson",
  "Josephine",
  "Leonardo",
  "Emery",
  "Bryson",
  "Julia",
  "Axel",
  "Delilah",
  "Everett",
  "Arianna",
  "Parker",
  "Vivian",
  "Kayden",
  "Kaylee",
  "Miles",
  "Sophie",
  "Sawyer",
  "Brielle",
  "Jason",
  "Tejp",
  "Madeline"
];
