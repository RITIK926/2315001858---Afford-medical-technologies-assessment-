export interface NumberResponse {
  windowPrevState: number[];
  windowCurrState: number[];
  numbers: number[];
  avg: number;
}

export interface Product {
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

export interface Train {
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
