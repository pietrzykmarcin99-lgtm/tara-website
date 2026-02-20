// Logger utility
export function log(message: string, ...args: any[]): void {
  if (import.meta.env.DEV) {
    console.log(`[App] ${message}`, ...args);
  }
}

export function error(message: string, ...args: any[]): void {
  console.error(`[App Error] ${message}`, ...args);
}

export function warn(message: string, ...args: any[]): void {
  if (import.meta.env.DEV) {
    console.warn(`[App Warning] ${message}`, ...args);
  }
}
