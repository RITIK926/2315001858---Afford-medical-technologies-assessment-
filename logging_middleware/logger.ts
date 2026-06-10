import { Request, Response, NextFunction } from "express";

export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime();
  const timestamp = new Date().toISOString();
  
  // Intercept response to capture response body
  const originalSend = res.send;
  let responseBody: any = "";
  
  res.send = function (body: any): Response {
    responseBody = body;
    return originalSend.apply(res, arguments as any);
  };

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const durationInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    
    console.log(`\n================= API SECURE REQUEST LOG =================`);
    console.log(`[TIMESTAMP] : ${timestamp}`);
    console.log(`[REQUEST]   : ${req.method} ${req.originalUrl}`);
    console.log(`[HEADERS]   : ${JSON.stringify(req.headers, null, 2)}`);
    
    if (req.body && Object.keys(req.body).length > 0) {
      console.log(`[REQ BODY]  : ${JSON.stringify(req.body, null, 2)}`);
    } else {
      console.log(`[REQ BODY]  : { empty }`);
    }
    
    console.log(`[STATUS]    : ${res.statusCode}`);
    console.log(`[TIME TAKEN]: ${durationInMs} ms`);
    
    try {
      if (responseBody) {
        let parsed = responseBody;
        if (typeof responseBody === "string") {
          try {
            parsed = JSON.parse(responseBody);
          } catch {
            // Keep as string
          }
        }
        // Truncate response if it's too large to prevent flooding logs
        const responseString = JSON.stringify(parsed, null, 2);
        if (responseString.length > 800) {
          console.log(`[RESPONSE]  : ${responseString.substring(0, 800)}\n... [Truncated for readability]`);
        } else {
          console.log(`[RESPONSE]  : ${responseString}`);
        }
      }
    } catch (e) {
      console.log(`[RESPONSE]  : (Unable to serialize)`);
    }
    console.log(`========================================================\n`);
  });

  next();
}
