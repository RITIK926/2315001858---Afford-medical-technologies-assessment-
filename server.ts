import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { loggingMiddleware } from "./logging_middleware/logger";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(loggingMiddleware);

const windows: Record<string, number[]> = {
  p: [],
  f: [],
  e: [],
  r: []
};

const WINDOW_SIZE = 10;

function isPrime(num: number): boolean {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function generatePrimes(count: number, startAfter: number = 1): number[] {
  const primes: number[] = [];
  let candidate = startAfter + 1;
  while (primes.length < count) {
    if (isPrime(candidate)) {
      primes.push(candidate);
    }
    candidate++;
  }
  return primes;
}

function generateFibonacci(count: number, startAfter: number = 0): number[] {
  const fibs: number[] = [];
  let a = 1;
  let b = 1;
  while (fibs.length < count + 15) {
    const next = a + b;
    a = b;
    b = next;
    if (next > startAfter) {
      fibs.push(next);
    }
  }
  return fibs.slice(0, count);
}

function generateEvens(count: number, startAfter: number = 0): number[] {
  const evens: number[] = [];
  let candidate = startAfter + (startAfter % 2 === 0 ? 2 : 1);
  while (evens.length < count) {
    if (candidate % 2 === 0) {
      evens.push(candidate);
    }
    candidate += 2;
  }
  return evens;
}

function generateRandoms(count: number, min: number = 1, max: number = 100): number[] {
  const randoms: number[] = [];
  while (randoms.length < count) {
    randoms.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return randoms;
}

const companies = ["AMZ", "FLP", "SNP", "MYN", "AZO"];
const categories = ["Phone", "Computer", "TV", "Earphone", "Tablet", "Charger", "Mouse", "Keypad"];

interface Product {
  id: string;
  productName: string;
  price: number;
  rating: number;
  discount: number;
  availability: "yes" | "no";
  company: string;
  category: string;
  description: string;
}

const productsDb: Product[] = [];

const brandMap: Record<string, string[]> = {
  Phone: ["Apple iPhone", "Samsung Galaxy", "Google Pixel", "OnePlus", "Xiaomi Mi", "Motorola Edge"],
  Computer: ["ThinkPad", "MacBook Air", "MacBook Pro", "Dell XPS", "HP Spectre", "ASUS ROG", "Lenovo Yoga"],
  TV: ["Sony Bravia", "LG OLED", "Samsung QLED", "TCL Smart TV", "Xiaomi Crystal UHD"],
  Earphone: ["Sony Noise Cancelling", "Bose QuietComfort", "Apple AirPods Pro", "Sennheiser Momentum", "Jabra Elite"],
  Tablet: ["Apple iPad Pro", "Samsung Galaxy Tab", "Microsoft Surface Pro", "OnePlus Pad"],
  Charger: ["GaN Prime 65W", "Anker PowerPort", "Belkin BoostCharge", "Apple MagSafe"],
  Mouse: ["Logitech MX Master", "Razer DeathAdder", "SteelSeries Rival", "Apple Magic Mouse"],
  Keypad: ["Keychron Mechanical", "Corsair K70", "Logitech MX Keys", "Razer BlackWidow"]
};

const specMap: Record<string, string[]> = {
  Phone: ["A17 Bionic/Snapdragon 8 Gen 3, 120Hz OLED Display, 50MP Triple Camera, 5000mAh Battery", "A16/Snapdragon 8 Gen 2, Super Retina Display, Dual 48MP Camera, All-Day Battery Life"],
  Computer: ["Intele Core i9 / Apple M3 Max, 32GB RAM, 1TB NVMe SSD, Liquid Retina Display", "Intel Core i7 / Apple M3, 16GB RAM, 512GB SSD, High Res Non-glare IPS Display"],
  TV: ["4K HDR Ultra HD, Dolby Vision, Dolby Atmos Sound, 120Hz refresh rate, Smart Hub Integration", "4K Quantum Dot, Active Dimming, Google TV OS, High Fidelity 40W Speakers"],
  Earphone: ["Active Noise Cancelling, High-Resolution Wireless Audio, 30 Hours Endurance, Spatial Sound", "Ultra HD Audio, Adaptive Isolation, Compact Charging Case, Water Resistant IPX4"],
  Tablet: ["Liquid Retina XDR, Apple M2 chip, Apple Pencil Support, 256GB Solid State Storage", "120Hz Dynamic AMOLED, Snapdragon chip, S-Pen included, Quad Harman Speakers"],
  Charger: ["Triple Port 3-in-1 Charging, Gallium Nitride Technology, Ultra Compact Portable Design", "Dual USB-C Output, Dynamic Safety Temp Control, Smart Device Power IQ Engine"],
  Mouse: ["Ultra Precise 8K DPI Sensor, Quiet Clicks, Bluetooth & Logi Bolt Wireless, Ergonomic Grip", "Lag-free Optical Switches, 20K DPI Sensor, Lightweight Gaming Ergonomics, RGB lighting"],
  Keypad: ["Tactile Mechanical Switches, CNC Aluminum Frame, Bluetooth Multi-Device Pairing, RGB backlight", "Low Profile Linear Switches, Solid Metal Top Panel, Dedicated Media Controls, Long Battery Life"]
};

companies.forEach(company => {
  categories.forEach(category => {
    const brands = brandMap[category] || ["Generic"];
    const specs = specMap[category] || ["Standard high quality hardware accessories"];

    for (let i = 1; i <= 15; i++) {
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const spec = specs[Math.floor(Math.random() * specs.length)];
      const price = Math.floor(Math.random() * 900) + 100;
      const rating = parseFloat((Math.random() * 1.5 + 3.5).toFixed(1));
      const discount = Math.floor(Math.random() * 25) + 5;
      const availability = Math.random() > 0.15 ? "yes" : "no";

      productsDb.push({
        id: `${company}-${category.substring(0, 3)}-${100 + i}`,
        productName: `${brand} ${i}`,
        price,
        rating,
        discount,
        availability,
        company,
        category,
        description: `Premium grade ${category} designed for productivity and entertainment. Technical features include: ${spec}. Built with robust components and backed by a 2-year warranty.`
      });
    }
  });
});

interface Train {
  trainName: string;
  trainNumber: string;
  departureTime: {
    Hours: number;
    Minutes: number;
    Seconds: number;
  };
  seatsAvailable: {
    sleeper: number;
    AC: number;
  };
  price: {
    sleeper: number;
    AC: number;
  };
  delayedBy: number;
  route: string[];
}

const trainsDb: Train[] = [
  {
    trainName: "Shatabdi Express",
    trainNumber: "12001",
    departureTime: { Hours: 6, Minutes: 0, Seconds: 0 },
    seatsAvailable: { sleeper: 0, AC: 45 },
    price: { sleeper: 0, AC: 1250 },
    delayedBy: 5,
    route: ["NDLS", "MTJ", "AGC", "GWL", "VGLB", "BPL"]
  },
  {
    trainName: "Vande Bharat Express",
    trainNumber: "22436",
    departureTime: { Hours: 15, Minutes: 0, Seconds: 0 },
    seatsAvailable: { sleeper: 0, AC: 85 },
    price: { sleeper: 0, AC: 1750 },
    delayedBy: 0,
    route: ["NDLS", "CNB", "PRYJ", "BSBS"]
  },
  {
    trainName: "Duronto Express",
    trainNumber: "12260",
    departureTime: { Hours: 19, Minutes: 40, Seconds: 0 },
    seatsAvailable: { sleeper: 12, AC: 28 },
    price: { sleeper: 520, AC: 1640 },
    delayedBy: 15,
    route: ["NDLS", "CNB", "MGS", "DHN", "HWH"]
  },
  {
    trainName: "Rajdhani Express",
    trainNumber: "12952",
    departureTime: { Hours: 16, Minutes: 55, Seconds: 0 },
    seatsAvailable: { sleeper: 0, AC: 92 },
    price: { sleeper: 0, AC: 2180 },
    delayedBy: 2,
    route: ["NDLS", "KOTA", "RTM", "BRC", "BCT"]
  },
  {
    trainName: "Paschim Express",
    trainNumber: "12926",
    departureTime: { Hours: 11, Minutes: 10, Seconds: 0 },
    seatsAvailable: { sleeper: 210, AC: 42 },
    price: { sleeper: 450, AC: 1350 },
    delayedBy: 45,
    route: ["ASR", "LDH", "UMB", "NDLS", "MTJ", "BRC", "BDTS"]
  },
  {
    trainName: "Taj Express",
    trainNumber: "12280",
    departureTime: { Hours: 6, Minutes: 55, Seconds: 0 },
    seatsAvailable: { sleeper: 154, AC: 18 },
    price: { sleeper: 210, AC: 650 },
    delayedBy: 0,
    route: ["NDLS", "FDB", "MTJ", "AGC", "DHO", "GWL"]
  },
  {
    trainName: "Gatimaan Express",
    trainNumber: "12050",
    departureTime: { Hours: 8, Minutes: 10, Seconds: 0 },
    seatsAvailable: { sleeper: 0, AC: 32 },
    price: { sleeper: 0, AC: 990 },
    delayedBy: 8,
    route: ["NZM", "AGC", "GWL", "VGLB"]
  },
  {
    trainName: "Grand Trunk Express",
    trainNumber: "12616",
    departureTime: { Hours: 18, Minutes: 40, Seconds: 0 },
    seatsAvailable: { sleeper: 48, AC: 11 },
    price: { sleeper: 610, AC: 1850 },
    delayedBy: 25,
    route: ["NDLS", "MTJ", "GWL", "BPL", "NGP", "BPQ", "WL", "MAS"]
  },
  {
    trainName: "Golden Temple Mail",
    trainNumber: "12904",
    departureTime: { Hours: 21, Minutes: 25, Seconds: 0 },
    seatsAvailable: { sleeper: 134, AC: 29 },
    price: { sleeper: 540, AC: 1580 },
    delayedBy: 12,
    route: ["ASR", "LDH", "UMB", "NDLS", "KOTA", "RTM", "BRC", "MMCT"]
  },
  {
    trainName: "Howrah Express",
    trainNumber: "12302",
    departureTime: { Hours: 16, Minutes: 50, Seconds: 0 },
    seatsAvailable: { sleeper: 5, AC: 74 },
    price: { sleeper: 560, AC: 1980 },
    delayedBy: 3,
    route: ["NDLS", "CNB", "MGS", "GAYA", "HWH"]
  }
];

app.get("/api/numbers/:type", (req, res) => {
  const type = req.params.type;
  if (!["p", "f", "e", "r"].includes(type)) {
    return res.status(400).json({ error: "Invalid number class specifier." });
  }

  const windowPrevState = [...windows[type]];
  let lastVal = windowPrevState[windowPrevState.length - 1] || 1;
  if (type === "f" && windowPrevState.length === 0) lastVal = 0;

  const count = Math.floor(Math.random() * 4) + 5;
  let generatedNumbers: number[] = [];

  if (type === "p") {
    generatedNumbers = generatePrimes(count, lastVal);
  } else if (type === "f") {
    generatedNumbers = generateFibonacci(count, lastVal);
  } else if (type === "e") {
    generatedNumbers = generateEvens(count, lastVal);
  } else {
    generatedNumbers = generateRandoms(count, 1, 150);
  }

  const newNumbersDetected = generatedNumbers.filter(num => !windows[type].includes(num));

  for (const num of newNumbersDetected) {
    if (windows[type].length >= WINDOW_SIZE) {
      windows[type].shift();
    }
    windows[type].push(num);
  }

  const windowCurrState = [...windows[type]];
  const sum = windowCurrState.reduce((a, b) => a + b, 0);
  const avg = windowCurrState.length > 0 ? parseFloat((sum / windowCurrState.length).toFixed(2)) : 0;

  res.json({
    windowPrevState,
    windowCurrState,
    numbers: generatedNumbers,
    avg
  });
});

app.get("/api/companies/:companyname/categories/:categoryname/products", (req, res) => {
  const company = req.params.companyname.toUpperCase();
  const category = req.params.categoryname;

  if (!companies.includes(company)) {
    return res.status(400).json({ error: "Invalid e-commerce company." });
  }

  const matchedCat = categories.find(c => c.toLowerCase() === category.toLowerCase());
  if (!matchedCat) {
    return res.status(400).json({ error: "Invalid product category." });
  }

  let filtered = productsDb.filter(p => p.company === company && p.category === matchedCat);

  const minPrice = parseInt(req.query.minPrice as string) || 0;
  const maxPrice = parseInt(req.query.maxPrice as string) || 10000;
  const top = parseInt(req.query.top as string) || 12;
  const sortBy = req.query.sortBy as string;
  const sortOrder = req.query.sortOrder as string || "asc";

  filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

  if (sortBy) {
    filtered.sort((a, b) => {
      let valA = a[sortBy as keyof Product];
      let valB = b[sortBy as keyof Product];

      if (typeof valA === "string") {
        return sortOrder === "asc"
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
      } else {
        return sortOrder === "asc"
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      }
    });
  }

  const limited = filtered.slice(0, top);

  res.json(limited);
});

app.get("/api/products/:productId", (req, res) => {
  const id = req.params.productId;
  const product = productsDb.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: "Product not located." });
  }
  res.json(product);
});

app.get("/api/trains", (req, res) => {
  const nowInMinutes = 430;
  const validTrains = trainsDb.filter(train => {
    const depMinutes = train.departureTime.Hours * 60 + train.departureTime.Minutes + train.delayedBy;
    return depMinutes > nowInMinutes + 30;
  });

  validTrains.sort((a, b) => {
    const priceA = a.seatsAvailable.sleeper > 0 ? a.price.sleeper : a.price.AC;
    const priceB = b.seatsAvailable.sleeper > 0 ? b.price.sleeper : b.price.AC;
    if (priceA !== priceB) return priceA - priceB;

    const seatsA = a.seatsAvailable.sleeper + a.seatsAvailable.AC;
    const seatsB = b.seatsAvailable.sleeper + b.seatsAvailable.AC;
    if (seatsA !== seatsB) return seatsB - seatsA;

    const depMinutesA = a.departureTime.Hours * 60 + a.departureTime.Minutes + a.delayedBy;
    const depMinutesB = b.departureTime.Hours * 60 + b.departureTime.Minutes + b.delayedBy;
    return depMinutesB - depMinutesA;
  });

  res.json(validTrains);
});

app.get("/api/trains/:trainNo", (req, res) => {
  const trainNo = req.params.trainNo;
  const train = trainsDb.find(t => t.trainNumber === trainNo);
  if (!train) {
    return res.status(404).json({ error: "Train schedules not located." });
  }
  res.json(train);
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched successfully on http://0.0.0.0:${PORT}`);
  });
}

startServer();
