interface Toast {
  show: boolean;
  type: "error" | "success";  // Add "success" as a valid type
  message: string;
} 